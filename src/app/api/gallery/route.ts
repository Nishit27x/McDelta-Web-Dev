import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

// This function now fetches gallery images from the public/img/jpg/ folder.
export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'img', 'jpg');
    const filenames = await readdir(imagesDirectory);

    // Filter for image files and create image objects
    const imageFiles = filenames.filter(name =>
      name.toLowerCase().endsWith('.jpg') ||
      name.toLowerCase().endsWith('.jpeg') ||
      name.toLowerCase().endsWith('.png') ||
      name.toLowerCase().endsWith('.webp')
    );

    // Convert filenames to image objects with required properties
    const images = imageFiles.map((filename, index) => ({
      id: `img-${index}-${filename.replace(/\.[^/.]+$/, "")}`, // Unique ID using index and filename
      src: `/img/jpg/${filename}`, // Public URL path
      alt: `Gallery image ${filename.replace(/\.[^/.]+$/, "")}`, // Alt text using filename
      createdAt: Date.now() - index // Mock creation date for sorting (newest first)
    }));

    // Sort by creation date descending (newest first)
    const sortedImages = images.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json(sortedImages);
  } catch (error) {
    console.error('Error fetching gallery images from folder:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images.' }, { status: 500 });
  }
}
