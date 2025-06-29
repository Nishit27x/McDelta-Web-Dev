import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1).max(5),
});

// Check if Firebase Admin is initialized
function isFirebaseAdminInitialized() {
  return admin.apps.length > 0;
}

export async function GET() {
  if (!isFirebaseAdminInitialized()) {
    // Return empty array if Firebase is not configured, so the page doesn't break.
    return NextResponse.json([], { status: 200 });
  }

  try {
    const db = admin.database();
    const ref = db.ref('reviews');
    const snapshot = await ref.orderByChild('createdAt').limitToLast(50).once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Transform the object of reviews into an array and sort descending
      const reviews = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })).sort((a, b) => b.createdAt - a.createdAt);
      return NextResponse.json(reviews, { status: 200 });
    }

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validation = feedbackSchema.safeParse(body);
  if (!validation.success) {
    const errorMessages = validation.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flatMap(e => e)?.[0] || "Invalid input.";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }
  
  const { name, message, rating } = validation.data;

  // If Firebase isn't configured, we'll simulate a successful submission for development purposes.
  if (!isFirebaseAdminInitialized()) {
    console.warn("Firebase Admin not configured. Simulating feedback submission.");
    const mockReview = {
        id: new Date().toISOString(),
        name,
        message,
        rating,
        avatar: `https://crafatar.com/avatars/${name}?overlay`,
        createdAt: Date.now(),
    };
    return NextResponse.json({ 
        message: 'Feedback submitted successfully! (This is a demo, data was not saved)', 
        review: mockReview 
    }, { status: 201 });
  }

  // If Firebase IS configured, proceed to save the data to the database.
  try {
    const db = admin.database();
    const ref = db.ref('reviews');
    
    const newReview = {
        name,
        message,
        rating,
        avatar: `https://crafatar.com/avatars/${name}?overlay`,
        createdAt: Date.now(),
        userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const newReviewRef = await ref.push(newReview);
    const createdReview = { ...newReview, id: newReviewRef.key };
    
    return NextResponse.json({ message: 'Feedback submitted successfully!', review: createdReview }, { status: 201 });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}
