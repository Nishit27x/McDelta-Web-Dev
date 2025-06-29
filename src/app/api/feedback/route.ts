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
    // The form will show an error on POST if they try to submit.
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
  if (!isFirebaseAdminInitialized()) {
    return NextResponse.json({ error: 'Server configuration error: The feedback system is currently unavailable.' }, { status: 500 });
  }

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

  try {
    const db = admin.database();
    const ref = db.ref('reviews');
    
    // We'll use the gamertag to try and fetch an avatar from Crafatar
    // This is not guaranteed to be a real player UUID, but Crafatar has fallbacks.
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
