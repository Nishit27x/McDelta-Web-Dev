import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { cookies } from 'next/headers';

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1).max(5),
});

export async function GET() {
  try {
    const db = admin.database();
    const ref = db.ref('reviewsBySessionId');
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Transform the object of reviews into an array
      const reviews = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      })).sort((a, b) => b.lastEditedAt - a.lastEditedAt); // Sort by most recent
      return NextResponse.json(reviews, { status: 200 });
    }

    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'You must be signed in to leave feedback.' }, { status: 401 });
  }

  const userAgent = request.headers.get('user-agent') || 'unknown';

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validation = feedbackSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }
  
  const { name, message, rating } = validation.data;

  try {
    const db = admin.database();
    
    // Fetch user session to get avatar
    const userRef = db.ref(`usersBySessionId/${sessionId}`);
    const userSnapshot = await userRef.once('value');
    if (!userSnapshot.exists()) {
      return NextResponse.json({ error: 'No user session found. Cannot submit feedback.' }, { status: 403 });
    }
    const userData = userSnapshot.val();
    const avatar = userData.avatar;
    
    // Now handle the review
    const ref = db.ref(`reviewsBySessionId/${sessionId}`);
    const now = Date.now();

    const snapshot = await ref.once('value');
    
    if (snapshot.exists()) {
      // Review exists, update it
      await ref.update({
        name,
        message,
        rating,
        avatar,
        lastEditedAt: now,
        userAgent, // Optionally update user agent on edit
      });
       return NextResponse.json({ message: 'Feedback updated successfully.' }, { status: 200 });
    } else {
      // New review, create it
      await ref.set({
        name,
        message,
        rating,
        avatar,
        userAgent,
        createdAt: now,
        lastEditedAt: now,
      });
      return NextResponse.json({ message: 'Feedback submitted successfully.' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}
