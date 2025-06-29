'use client';

import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// --- Feedback Form Schema and Component ---

const feedbackFormSchema = z.object({
  name: z.string().min(3, "Gamertag must be at least 3 characters.").max(20),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1, "Please provide a rating.").max(5),
});

function FeedbackForm({ onFeedbackSubmit }: { onFeedbackSubmit: (newReview: Review) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: '',
      message: '',
      rating: 0,
    },
  });

  const currentRating = form.watch('rating');

  async function onSubmit(values: z.infer<typeof feedbackFormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feedback.');
      }

      toast({
        title: 'Thank you!',
        description: result.message,
      });
      onFeedbackSubmit(result.review);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Your Feedback</CardTitle>
        <CardDescription>Let us know what you think about McDelta SMP!</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minecraft Gamertag</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Steve" {...field} />
                  </FormControl>
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
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`cursor-pointer h-7 w-7 transition-colors ${
                            star <= (hoverRating || currentRating)
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground/50'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
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
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your experience..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- Review Display Component ---

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  avatar?: string;
  createdAt: number;
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <Card className="bg-card/50">
            <CardContent className="p-6 flex gap-6">
                <Avatar className="h-12 w-12 hidden sm:flex">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-y-2">
                        <h4 className="font-bold text-lg">{review.name}</h4>
                        <div className="flex items-center gap-1">
                            {Array(review.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
                            {Array(5 - review.rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-muted-foreground/50" />)}
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2 italic">"{review.message}"</p>
                    <p className="text-xs text-muted-foreground/80 mt-4 text-right">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/feedback');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleNewFeedback = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
                <FeedbackForm onFeedbackSubmit={handleNewFeedback} />
            </div>
            <div className="lg:col-span-2 space-y-6">
                <h3 className="text-3xl font-bold text-center lg:text-left">Recent Feedback</h3>
                {isLoading ? (
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-28 w-full rounded-xl" />
                        <Skeleton className="h-28 w-full rounded-xl" />
                        <Skeleton className="h-28 w-full rounded-xl" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                    </div>
                ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Be the first to leave feedback!</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
