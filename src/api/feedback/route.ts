import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { verifySession } from '@/lib/session-verifier';

const feedbackSchema = z.object({
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
  let decodedToken;
  try {
    // This will throw an error if the session is not valid, protecting the endpoint.
    decodedToken = await verifySession(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
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
  
  const { message, rating } = validation.data;
  const { uid, display_name: gamertag, picture: avatar } = decodedToken;

  if (!gamertag) {
     return NextResponse.json({ error: 'Gamertag not found in user session.' }, { status: 400 });
  }
  
  try {
    const db = admin.database();
    const ref = db.ref('reviews');
    
    const newReview = {
        name: gamertag,
        message,
        rating,
        avatar: avatar || `https://crafatar.com/avatars/${uid}?overlay`, // Use token picture or fallback
        createdAt: Date.now(),
        uid: uid
    };

    const newReviewRef = await ref.push(newReview);
    const createdReview = { ...newReview, id: newReviewRef.key };
    
    return NextResponse.json({ message: 'Feedback submitted successfully!', review: createdReview }, { status: 201 });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}
