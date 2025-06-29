'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

export default function Hero() {
  const images = [
    { src: 'https://placehold.co/1920x1080.png', alt: 'Minecraft gameplay screenshot 1', hint: 'minecraft landscape' },
    { src: 'https://placehold.co/1920x1081.png', alt: 'Minecraft PvP battle', hint: 'minecraft pvp' },
    { src: 'https://placehold.co/1920x1082.png', alt: 'Minecraft custom build', hint: 'minecraft castle' },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center text-center">
      <Carousel
        plugins={[plugin.current]}
        className="absolute inset-0 w-full h-full overflow-hidden"
        opts={{
          loop: true,
        }}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[80vh] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.hint}
                />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
        </div>
      </Carousel>

      <div className="relative z-10 p-4 text-white">
        <h1 className="font-jokerman tracking-wider drop-shadow-xl text-5xl md:text-7xl lg:text-8xl">
          <span className="block text-2xl md:text-4xl font-headline font-bold">Welcome to</span>
          McDelta SMP
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg">
          Experience the ultimate Minecraft Lifesteal SMP. Forge alliances, conquer enemies, and build your legacy.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <a href="https://discord.gg/placeholder" target="_blank" rel="noopener noreferrer">
              Join Now
            </a>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
