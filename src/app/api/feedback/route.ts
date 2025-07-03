
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { randomUUID } from 'crypto';

const feedbackSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(20, "Name is too long."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1).max(5),
});

function isFirebaseAdminInitialized() {
  return admin.apps.length > 0;
}

export async function GET() {
  if (!isFirebaseAdminInitialized()) {
    return NextResponse.json([], { status: 200 });
  }
  try {
    const db = admin.database();
    const ref = db.ref('reviews');
    
    // Only fetch reviews from the last 30 days
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const snapshot = await ref.orderByChild('createdAt').startAt(oneMonthAgo).once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      const reviews = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })).sort((a, b) => b.createdAt - a.createdAt); // Keep sorting by most recent
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
    return NextResponse.json({ error: 'Server not configured for feedback.' }, { status: 503 });
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
    
    const anonymousId = randomUUID();
    const newReview = {
        name,
        message,
        rating,
        avatar: `https://crafatar.com/avatars/${anonymousId}?overlay`, // Generic but unique avatar
        createdAt: Date.now(),
        uid: anonymousId, // use randomId as a unique identifier for the avatar
    };

    const newReviewRef = await ref.push(newReview);
    const createdReview = { ...newReview, id: newReviewRef.key };
    
    return NextResponse.json({ message: 'Feedback submitted successfully!', review: createdReview }, { status: 201 });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}
