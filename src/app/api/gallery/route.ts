import { NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

// This function now fetches gallery images from the Firebase Realtime Database.
export async function GET() {
  if (admin.apps.length === 0) {
    return NextResponse.json({ error: 'Firebase Admin not initialized.' }, { status: 503 });
  }

  try {
    const db = admin.database();
    const ref = db.ref('galleryImages');
    const snapshot = await ref.orderByChild('createdAt').once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert the object of objects into an array and sort by creation date descending
      const images = Object.keys(data)
        .map(key => ({ id: key, ...data[key] }))
        .sort((a, b) => b.createdAt - a.createdAt);
      return NextResponse.json(images);
    } else {
      // If no images exist in the database, return an empty array.
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching gallery images from Firebase:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images.' }, { status: 500 });
  }
}
