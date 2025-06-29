'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface GalleryImage {
  src: string;
  alt: string;
  tag: string;
  hint: string;
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const selectedImageData = images.find((img) => img.src === selectedImage);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Gallery</h2>
          <p className="text-lg text-muted-foreground mt-2">A glimpse into the world of McDelta.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
               <div key={index} className="relative aspect-video rounded-xl bg-muted overflow-hidden">
                  <Skeleton className="w-full h-full" />
               </div>
            ))
          ) : images.length > 0 ? (
            images.map((img) => (
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
            ))
          ) : (
             <p className="col-span-full text-center text-muted-foreground">No images in the gallery yet.</p>
          )}
        </div>
      </div>
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-1 border-0 bg-background rounded-xl">
          <DialogTitle className="sr-only">Enlarged gallery image</DialogTitle>
          <DialogDescription className="sr-only">
            {selectedImageData ? selectedImageData.alt : 'An enlarged view of a gallery image.'}
          </DialogDescription>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt={selectedImageData?.alt || 'Enlarged gallery view'}
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
