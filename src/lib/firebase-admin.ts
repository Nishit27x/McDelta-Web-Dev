// IMPORTANT: Create a .env.local file in your project root and add your Firebase service account credentials.
// You can get these from your Firebase project settings -> Service accounts -> Generate new private key.
// .env.local should look like this:
//
// FIREBASE_PROJECT_ID="your-project-id"
// FIREBASE_CLIENT_EMAIL="firebase-adminsdk-.....@your-project-id.iam.gserviceaccount.com"
// FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n.....\n-----END PRIVATE KEY-----\n"
// NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://your-project-id-default-rtdb.firebaseio.com"
//

import admin from 'firebase-admin';

const hasFirebaseAdminConfig = 
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY;

if (hasFirebaseAdminConfig && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else if (!hasFirebaseAdminConfig) {
    console.warn(
        'Firebase Admin credentials are not set in .env.local. Skipping initialization. Some API routes may not work.'
    );
}

export default admin;
