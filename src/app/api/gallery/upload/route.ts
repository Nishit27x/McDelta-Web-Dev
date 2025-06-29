
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';
import { verifySession } from '@/lib/session-verifier';
import * as z from 'zod';
import { randomUUID } from 'crypto';

const uploadSchema = z.object({
  image: z.string().refine(s => s.startsWith('data:image/'), 'Image must be a data URL.'),
  tag: z.string().min(1).max(50),
  alt: z.string().min(1).max(200),
});

async function isAdmin(uid: string): Promise<boolean> {
  const db = admin.database();
  const adminGamertags = (process.env.ADMIN_GAMERTAGS || '').split(',').map(g => g.trim().toLowerCase()).filter(Boolean);
  
  const userRef = db.ref(`users/${uid}`);
  const snapshot = await userRef.once('value');
  if (!snapshot.exists()) return false;
  
  const userProfile = snapshot.val();
  return adminGamertags.includes(userProfile.gamertag.toLowerCase());
}

export async function POST(request: NextRequest) {
  let decodedToken;
  try {
    decodedToken = await verifySession(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  
  if (!await isAdmin(decodedToken.uid)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }
  
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const validation = uploadSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
  }

  const { image, tag, alt } = validation.data;

  try {
    const bucket = admin.storage().bucket();
    
    // Extract mime type and base64 data
    const matches = image.match(/^data:(image\/.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid image data URL format.' }, { status: 400 });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const fileExtension = mimeType.split('/')[1];
    const fileName = `gallery/${randomUUID()}.${fileExtension}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: mimeType },
      public: true,
    });

    // The public URL is available after making the file public
    const publicUrl = file.publicUrl();

    // Save metadata to Realtime Database
    const db = admin.database();
    const newImageRef = db.ref('galleryImages').push();
    const newImageData = {
        src: publicUrl,
        alt,
        tag,
        hint: tag.toLowerCase().replace(/\s+/g, ' '), // A simple hint for AI
        createdAt: Date.now(),
        uploadedBy: decodedToken.uid
    };
    await newImageRef.set(newImageData);

    return NextResponse.json({ message: 'Image uploaded successfully!', image: { id: newImageRef.key, ...newImageData } });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}
