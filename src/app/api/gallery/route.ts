import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/lib/firebase-admin';

const defaultGalleryImages = [
  { src: 'https://placehold.co/600x400.png', alt: 'Spawn Area', tag: 'Spawn Area', hint: 'minecraft spawn' },
  { src: 'https://placehold.co/600x401.png', alt: 'PvP Zone', tag: 'PvP Zone', hint: 'minecraft pvp' },
  { src: 'https://placehold.co/600x402.png', alt: 'Epic Base Build', tag: 'Player Build', hint: 'minecraft base' },
  { src: 'https://placehold.co/600x403.png', alt: 'Nether Hub', tag: 'Infrastructure', hint: 'minecraft nether' },
  { src: 'https://placehold.co/600x404.png', alt: 'Community Farm', tag: 'Community', hint: 'minecraft farm' },
  { src: 'https://placehold.co/600x405.png', alt: 'Quest Giver Village', tag: 'Quests', hint: 'minecraft village' },
];

export async function GET() {
  try {
    const db = admin.database();
    const ref = db.ref('galleryImages');
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Firebase returns an object, convert it to an array if it's not already
      const images = Array.isArray(data) ? data : Object.values(data);
      return NextResponse.json(images, { status: 200 });
    } else {
      // If no data exists, populate it with default images and return them
      await ref.set(defaultGalleryImages);
      return NextResponse.json(defaultGalleryImages, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    // Return default images on error to ensure the gallery doesn't break
    return NextResponse.json(defaultGalleryImages, { status: 500 });
  }
}
