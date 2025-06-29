import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { randomUUID } from 'crypto';

const loginSchema = z.object({
  gamertag: z.string().min(3, "Gamertag must be at least 3 characters.").max(20),
});

async function isFirebaseAdminInitialized() {
    return admin.apps.length > 0;
}

export async function POST(request: NextRequest) {
    if (!await isFirebaseAdminInitialized()) {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin not initialized.' }, { status: 503 });
    }

    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.flatten().fieldErrors.gamertag?.[0] || 'Invalid input.' }, { status: 400 });
    }

    const { gamertag } = validation.data;
    const db = admin.database();
    const auth = admin.auth();

    try {
        const gamertagRef = db.ref(`gamertags/${gamertag.toLowerCase()}`);
        const gamertagSnapshot = await gamertagRef.once('value');
        let uid;

        if (gamertagSnapshot.exists()) {
            uid = gamertagSnapshot.val();
        } else {
            // User does not exist, create a new one in Firebase Auth and RTDB
            const newUserRecord = await auth.createUser({
                displayName: gamertag,
            });
            uid = newUserRecord.uid;

            const crafatarId = randomUUID(); // Use a random UUID for the avatar to avoid collisions
            const userProfile = {
                gamertag,
                avatar: `https://crafatar.com/avatars/${crafatarId}?overlay`,
                createdAt: new Date().toISOString(),
                uid: uid,
            };
            
            // Set data in two places for easy lookup
            await db.ref(`users/${uid}`).set(userProfile);
            await gamertagRef.set(uid);
        }

        // Generate a custom token for the client to sign in with
        const customToken = await auth.createCustomToken(uid);
        
        return NextResponse.json({ customToken });

    } catch (error: any) {
        console.error('Error in login process:', error);
        // Handle specific Firebase errors
        if (error.code === 'auth/invalid-display-name') {
             return NextResponse.json({ error: 'Invalid gamertag format.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
    }
}
