'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const galleryImages = [
  { src: 'https://placehold.co/600x400.png', alt: 'Spawn Area', tag: 'Spawn Area', hint: 'minecraft spawn' },
  { src: 'https://placehold.co/600x401.png', alt: 'PvP Zone', tag: 'PvP Zone', hint: 'minecraft pvp' },
  { src: 'https://placehold.co/600x402.png', alt: 'Epic Base Build', tag: 'Player Build', hint: 'minecraft base' },
  { src: 'https://placehold.co/600x403.png', alt: 'Nether Hub', tag: 'Infrastructure', hint: 'minecraft nether' },
  { src: 'https://placehold.co/600x404.png', alt: 'Community Farm', tag: 'Community', hint: 'minecraft farm' },
  { src: 'https://placehold.co/600x405.png', alt: 'Quest Giver Village', tag: 'Quests', hint: 'minecraft village' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Gallery</h2>
          <p className="text-lg text-muted-foreground mt-2">A glimpse into the world of McDelta.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.src}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(img.src)}
            >
              <div
                className="relative aspect-video rounded-xl overflow-hidden shadow-lg shadow-black/20 transition-all duration-300 ease-in-out group-hover:shadow-primary/20 group-hover:scale-105"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={img.hint}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/50 transition-colors" />
                <div className="absolute bottom-2 left-2 p-1 bg-black/50 rounded-md text-white text-xs md:text-sm font-semibold">
                  {img.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-1 border-0 bg-background rounded-xl">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Enlarged gallery view"
              width={1600}
              height={900}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
