
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import * as z from 'zod';
import { randomUUID } from 'crypto';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

async function isFirebaseAdminInitialized() {
    return admin.apps.length > 0;
}

// Hardcoded admin credentials
const ADMIN_USERNAME = "a=dv/dt";
const ADMIN_PASSWORD = "calculus "; // As requested, with a trailing space

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
        return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const { username, password } = validation.data;

    // Case-insensitive comparison
    if (username.toLowerCase() !== ADMIN_USERNAME.toLowerCase() || password.toLowerCase() !== ADMIN_PASSWORD.toLowerCase()) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // --- At this point, credentials are correct. Now, we get a Firebase token for the admin user. ---
    
    const gamertag = ADMIN_USERNAME; // The gamertag is the username
    const db = admin.database();
    const auth = admin.auth();

    try {
        const gamertagRef = db.ref(`gamertags/${gamertag.toLowerCase()}`);
        const gamertagSnapshot = await gamertagRef.once('value');
        let uid;

        if (gamertagSnapshot.exists()) {
            uid = gamertagSnapshot.val();
        } else {
            // Admin user does not exist, create a new one in Firebase Auth and RTDB
            const newUserRecord = await auth.createUser({
                displayName: gamertag,
            });
            uid = newUserRecord.uid;

            const crafatarId = randomUUID();
            const userProfile = {
                gamertag,
                avatar: `https://crafatar.com/avatars/${crafatarId}?overlay`,
                createdAt: new Date().toISOString(),
                uid: uid,
            };
            
            await db.ref(`users/${uid}`).set(userProfile);
            await gamertagRef.set(uid);
        }

        // Generate a custom token for the client to sign in with
        const customToken = await auth.createCustomToken(uid);
        
        return NextResponse.json({ customToken });

    } catch (error: any) {
        console.error('Error in admin login process:', error);
        return NextResponse.json({ error: 'An unexpected error occurred during admin login.' }, { status: 500 });
    }
}
