import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const gamertagSchema = z.object({
  gamertag: z.string().min(3).max(20),
});

const getAdminGamertags = () => {
    return (process.env.ADMIN_GAMERTAGS || '').split(',').map(g => g.trim().toLowerCase()).filter(Boolean);
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'No session found.' }, { status: 404 });
  }

  try {
    const db = admin.database();
    const ref = db.ref(`usersBySessionId/${sessionId}`);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const adminGamertags = getAdminGamertags();

      const responseData = {
          ...userData,
          isAdmin: adminGamertags.includes(userData.gamertag.toLowerCase())
      };

      // Update last seen timestamp
      await ref.update({ lastSeen: new Date().toISOString() });
      return NextResponse.json(responseData, { status: 200 });
    } else {
      // Session ID in cookie is invalid, maybe DB was cleared. Delete it.
      cookieStore.delete('sessionId');
      return NextResponse.json({ error: 'User session not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user session:', error);
    if ((error as any)?.code === 'app/no-app') {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin SDK is not initialized.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch user session.' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validation = gamertagSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }
  
  const { gamertag } = validation.data;
  const adminGamertags = getAdminGamertags();
  const isAdmin = adminGamertags.includes(gamertag.toLowerCase());
  const now = new Date().toISOString();

  try {
    const db = admin.database();
    let sessionId = cookieStore.get('sessionId')?.value;
    
    // Path 1: A session ID already exists in the cookie.
    if (sessionId) {
      const userRef = db.ref(`usersBySessionId/${sessionId}`);
      const snapshot = await userRef.once('value');

      // If the user exists for that session, update their gamertag and lastSeen.
      if (snapshot.exists()) {
        const updatedData = { gamertag, lastSeen: now };
        await userRef.update(updatedData);
        
        const responseData = { ...snapshot.val(), ...updatedData, isAdmin };
        return NextResponse.json(responseData, { status: 200 });
      }
    }

    // Path 2: No valid session found. Create a new one.
    const newSessionId = randomUUID();
    const crafatarId = randomUUID();
    const newUser = {
      gamertag,
      avatar: `https://crafatar.com/avatars/${crafatarId}?overlay`,
      createdAt: now,
      lastSeen: now,
    };
    
    await db.ref(`usersBySessionId/${newSessionId}`).set(newUser);

    cookieStore.set('sessionId', newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    
    const responseData = { ...newUser, isAdmin };
    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('Error creating or updating user session:', error);
    if ((error as any)?.code === 'app/no-app') {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin SDK is not initialized. Please check your environment variables.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to create or update user session.' }, { status: 500 });
  }
}
