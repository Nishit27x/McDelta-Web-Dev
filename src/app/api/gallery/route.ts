import { NextResponse } from 'next/server';

const defaultGalleryImages = [
  { src: 'https://placehold.co/600x400.png', alt: 'Spawn Area', tag: 'Spawn Area', hint: 'minecraft spawn' },
  { src: 'https://placehold.co/600x401.png', alt: 'PvP Zone', tag: 'PvP Zone', hint: 'minecraft pvp' },
  { src: 'https://placehold.co/600x402.png', alt: 'Epic Base Build', tag: 'Player Build', hint: 'minecraft base' },
  { src: 'https://placehold.co/600x403.png', alt: 'Nether Hub', tag: 'Infrastructure', hint: 'minecraft nether' },
  { src: 'https://placehold.co/600x404.png', alt: 'Community Farm', tag: 'Community', hint: 'minecraft farm' },
  { src: 'https://placehold.co/600x405.png', alt: 'Quest Giver Village', tag: 'Quests', hint: 'minecraft village' },
];

export async function GET() {
  // Returns a static list of images to avoid dependency on Firebase DB
  return NextResponse.json(defaultGalleryImages, { status: 200 });
}
