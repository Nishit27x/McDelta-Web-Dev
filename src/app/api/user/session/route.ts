import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session-verifier';

// This endpoint now verifies the session cookie and returns the user's profile data.
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifySession(request);
    const db = admin.database();
    
    const userRef = db.ref(`users/${decodedToken.uid}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    }

    const userProfile = snapshot.val();
    
    // Check if user is an admin
    const adminGamertags = (process.env.ADMIN_GAMERTAGS || '').split(',').map(g => g.trim().toLowerCase()).filter(Boolean);
    const isAdmin = adminGamertags.includes(userProfile.gamertag.toLowerCase());

    return NextResponse.json({ ...userProfile, isAdmin });

  } catch (error: any) {
    // AuthError is thrown by verifySession for specific, clear reasons.
    if (error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error('Error fetching user session:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
