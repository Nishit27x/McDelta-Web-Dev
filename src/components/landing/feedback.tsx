'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSession } from "@/contexts/user-session-context";
import SignInModal from "@/components/sign-in-modal";
import { useRouter } from "next/navigation";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1, "Please provide a rating.").max(5),
});

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: number;
  avatar?: string;
}

function StarRating({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer transition-colors ${i <= value ? 'text-primary fill-primary' : 'text-muted-foreground/50 hover:text-primary'}`}
                    onClick={() => onChange(i)}
                />
            ))}
        </div>
    );
}

export default function Feedback() {
  const router = useRouter();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const { session, isLoading: isLoadingSession, refetch } = useUserSession();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: "", message: "", rating: 0 },
  });

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (session?.gamertag) {
      form.setValue('name', session.gamertag);
    }
  }, [session, form]);

  useEffect(() => {
    if (!isLoadingSession && !session) {
      setIsSignInModalOpen(true);
    }
  }, [isLoadingSession, session]);

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast({
        title: response.status === 201 ? "Feedback submitted!" : "Feedback updated!",
        description: "Thanks for sharing your thoughts with us.",
      });
      form.reset({ name: session?.gamertag || "", message: "", rating: 0 });
      fetchReviews(); // Refresh the list
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message,
      });
    }
  }

  const handleSignInSuccess = () => {
    setIsSignInModalOpen(false);
    refetch();
  };

  const handleCancelSignIn = () => {
    setIsSignInModalOpen(false);
    router.push('/');
  };

  return (
    <section id="feedback" className="py-16 md:py-24">
      {isSignInModalOpen && <SignInModal onSuccess={handleSignInSuccess} onCancel={handleCancelSignIn} />}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Player Feedback</h2>
          <p className="text-lg text-muted-foreground mt-2">See what our players have to say.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Leave Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSession ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32" />
                </div>
              ) : session ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Gamertag</FormLabel>
                          <FormControl><Input placeholder="e.g., Steve" {...field} readOnly /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl><Textarea rows={4} placeholder="Tell us what you think..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                              <StarRating value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <p>Please sign in to leave feedback.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center">
            {isLoadingReviews ? (
                <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <Skeleton className="w-16 h-16 rounded-full mb-4" />
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-5 w-32 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-1" />
                    </CardContent>
                </Card>
            ) : reviews.length > 0 ? (
                <Carousel opts={{ loop: true }} className="w-full">
                  <CarouselContent>
                    {reviews.map((fb) => (
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
            ) : (
                <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
                    <CardContent className="p-6 text-center text-muted-foreground">
                        <p>No feedback yet. Be the first to leave a review!</p>
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
