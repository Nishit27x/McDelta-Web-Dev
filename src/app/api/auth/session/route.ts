import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import admin from '@/lib/firebase-admin';

async function isFirebaseAdminInitialized() {
    return admin.apps.length > 0;
}

// Exchanges a client-side ID token for a server-side session cookie.
export async function POST(request: NextRequest) {
    if (!await isFirebaseAdminInitialized()) {
        return NextResponse.json({ error: 'Server configuration error: Firebase Admin not initialized.' }, { status: 503 });
    }
    
    const { idToken } = await request.json();

    if (!idToken) {
        return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
        
        const options = {
            name: 'session',
            value: sessionCookie,
            maxAge: expiresIn,
            httpOnly: true,
            secure: true,
            sameSite: 'strict' as const,
        };

        cookies().set(options);
        
        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Error creating session cookie:', error);
        return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
    }
}

// Clears the session cookie, logging the user out.
export async function DELETE() {
    try {
        cookies().delete('session');
        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Error deleting session cookie:', error);
        return NextResponse.json({ error: 'Failed to log out.' }, { status: 500 });
    }
}
