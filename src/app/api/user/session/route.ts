'use server';

import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { randomUUID } from 'crypto';

const gamertagSchema = z.object({
  gamertag: z.string().min(3).max(20),
});

function getIp(request: NextRequest) {
    let ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    if (!ip) {
      // Fallback for local development where IP might not be available
      if (process.env.NODE_ENV === 'development') {
        ip = '127.0.0.1'; // Use a mock IP for dev
      } else {
        return 'unknown';
      }
    }
    // Sanitize IP to use as a Firebase key
    return ip.replace(/\./g, '_').replace(/:/g, '_');
}

export async function GET(request: NextRequest) {
  const sanitizedIp = getIp(request);
  if (sanitizedIp === 'unknown') {
      return NextResponse.json({ error: 'Could not identify IP address.' }, { status: 400 });
  }

  try {
    const db = admin.database();
    const ref = db.ref(`usersByIP/${sanitizedIp}`);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      const userData = snapshot.val();
      // Update last seen timestamp
      await ref.update({ lastSeen: new Date().toISOString() });
      return NextResponse.json(userData, { status: 200 });
    } else {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user session:', error);
    return NextResponse.json({ error: 'Failed to fetch user session.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sanitizedIp = getIp(request);
  if (sanitizedIp === 'unknown') {
      return NextResponse.json({ error: 'Could not identify IP address.' }, { status: 400 });
  }

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

  try {
    const db = admin.database();
    const ref = db.ref(`usersByIP/${sanitizedIp}`);
    const snapshot = await ref.once('value');
    
    if (snapshot.exists()) {
      return NextResponse.json({ error: 'A user is already registered for this IP address.' }, { status: 409 });
    }
    
    const now = new Date().toISOString();
    const userId = randomUUID();
    const newUser = {
      gamertag,
      avatar: `https://crafatar.com/avatars/${userId}?overlay`,
      ip: request.ip,
      createdAt: now,
      lastSeen: now,
    };

    await ref.set(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user session:', error);
    return NextResponse.json({ error: 'Failed to create user session.' }, { status: 500 });
  }
}
