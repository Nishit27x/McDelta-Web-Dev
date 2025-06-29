import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import admin from '@/lib/firebase-admin';

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Verifies the session cookie from the request and returns the decoded token.
// Throws an AuthError if the session is invalid.
export async function verifySession(request: NextRequest) {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        throw new AuthError('No session cookie found. Please sign in.');
    }
    
    if (admin.apps.length === 0) {
        throw new AuthError('Server configuration error: Firebase Admin not initialized.');
    }
    
    try {
        const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
        return decodedToken;
    } catch (error) {
        console.warn('Session cookie verification failed:', error);
        throw new AuthError('Your session has expired or is invalid. Please sign in again.');
    }
}
