'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  avatar?: string;
  createdAt: number;
  uid: string;
}

export default function Feedback() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/feedback');
        const data = await response.json();
        if (response.ok) {
          setReviews(data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Skeleton className="w-16 h-16 rounded-full mb-4" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-4 w-48" />
             <Skeleton className="h-4 w-40 mt-2" />
          </CardContent>
        </Card>
      );
    }
    if (reviews.length === 0) {
      return (
        <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
            <CardContent className="p-6 flex flex-col items-center text-center">
                 <p className="text-muted-foreground">No feedback has been submitted recently.</p>
                 <p className="text-muted-foreground mt-2">Be the first to share your thoughts!</p>
            </CardContent>
        </Card>
      );
    }
    return (
      <Carousel 
          plugins={[plugin.current]}
          opts={{ loop: true }} 
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {reviews.map((fb) => (
            <CarouselItem key={fb.id}>
              <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 mb-4 border-2 border-primary">
                    <AvatarImage src={fb.avatar || `https://crafatar.com/avatars/${fb.uid}?overlay`} data-ai-hint="pixel avatar" />
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
    );
  };
  
  return (
    <section id="feedback" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Player Feedback</h2>
          <p className="text-lg text-muted-foreground mt-2">See what our players have to say.</p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            {renderContent()}
          </div>
        </div>
         <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">Want to leave feedback? <Link href="/feedback" className="text-primary hover:underline">Click here</Link> to share your thoughts!</p>
        </div>
      </div>
    </section>
  );
}
