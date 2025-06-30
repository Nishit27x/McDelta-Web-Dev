
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  avatar?: string;
}

const staticReviews: Review[] = [
  {
    id: '1',
    name: 'Steve',
    rating: 5,
    message: 'This server is amazing! The community is great and the lifesteal mechanic is so much fun.',
    avatar: 'https://crafatar.com/avatars/690a424c-2a66-4f51-872f-5f89a2e6e87b?overlay'
  },
  {
    id: '2',
    name: 'Alex',
    rating: 4,
    message: 'Really enjoy the quests and custom builds. Keeps things interesting.',
    avatar: 'https://crafatar.com/avatars/55125263-a26a-4638-a59f-d50d2448ca33?overlay'
  },
  {
    id: '3',
    name: 'CreeperLover_99',
    rating: 5,
    message: 'Best SMP I have ever played on. 10/10 would get blown up again.',
    avatar: 'https://crafatar.com/avatars/3c6e7a6c-4b53-4d4b-a7f4-f8b868e47b4d?overlay'
  }
];

export default function Feedback() {
    const plugin = React.useRef(
      Autoplay({ delay: 5000, stopOnInteraction: true })
    );

  return (
    <section id="feedback" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Player Feedback</h2>
          <p className="text-lg text-muted-foreground mt-2">See what our players have to say.</p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
             <Carousel 
                plugins={[plugin.current]}
                opts={{ loop: true }} 
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
              <CarouselContent>
                {staticReviews.map((fb) => (
                  <CarouselItem key={fb.id}>
                    <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="w-16 h-16 mb-4 border-2 border-primary">
                          <AvatarImage src={fb.avatar || "https://placehold.co/40x40.png"} data-ai-hint="pixel avatar" />
                          <AvatarFallback>{fb.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-bold text-lg">{fb.name}</h4>
                        <div className="flex my-2">
                          {Array(fb.rating).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)}
                          {Array(5 - fb.rating).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-muted-foreground/50" />)}
                        </div>
                        <p className="text-muted-foreground italic">"{fb.message}"</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
         <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">Want to leave feedback? Join our <a href="https://discord.gg/bwXrXzH3Wt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord</a> and let us know!</p>
        </div>
      </div>
    </section>
  );
}
