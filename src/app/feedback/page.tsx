'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { app, firebaseClientError } from '@/lib/firebase-client';
import { getDatabase, ref, push } from 'firebase/database';
import { Skeleton } from '@/components/ui/skeleton';

const feedbackSchema = z.object({
  name: z.string().min(3, "Your name must be at least 3 characters.").max(20, "Your name is too long."),
  message: z.string().min(10, "Your message is too short.").max(500, "Your message is too long."),
  rating: z.number().min(1, "Please provide a rating.").max(5),
});

const StarRating = ({ value, onChange }: { value: number, onChange: (value: number) => void }) => {
  const [hoverValue, setHoverValue] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={cn(
            "h-8 w-8 cursor-pointer transition-colors",
            (hoverValue || value) >= star ? "text-primary fill-primary" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

const FeedbackForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        try {
            if (localStorage.getItem('hasSubmittedFeedback') === 'true') {
                setHasSubmitted(true);
            }
        } catch (error) {
            console.warn("Could not access localStorage. Feedback can be submitted multiple times.");
        } finally {
            setIsChecking(false);
        }
    }, []);

    const form = useForm<z.infer<typeof feedbackSchema>>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            name: '',
            message: '',
            rating: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof feedbackSchema>) {
        setIsSubmitting(true);
        if (!app) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: firebaseClientError || 'Firebase is not configured. Please contact an administrator.',
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const db = getDatabase(app);
            const reviewsRef = ref(db, 'reviews');
            
            const anonymousId = crypto.randomUUID();
            const newReview = {
                ...values,
                avatar: `https://crafatar.com/avatars/${anonymousId}?overlay`,
                createdAt: Date.now(),
                uid: anonymousId,
            };

            await push(reviewsRef, newReview);

            toast({
                title: 'Feedback Submitted!',
                description: "Thanks for helping us improve McDelta SMP.",
            });
            form.reset();
            try {
                localStorage.setItem('hasSubmittedFeedback', 'true');
            } catch (error) {
                 console.warn("Could not set localStorage. Feedback can be submitted multiple times.");
            }
            setHasSubmitted(true);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: (error as Error).message || 'Could not submit feedback to the database.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isChecking) {
        return (
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-48 mt-4 mx-auto" />
                    <Skeleton className="h-5 w-64 mt-2 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        )
    }

    if (hasSubmitted) {
        return (
             <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="mt-4">Thank You!</CardTitle>
                    <CardDescription>
                        Your feedback has already been submitted. We appreciate you taking the time to help us improve.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <MessageSquareQuote className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4">Share Your Feedback</CardTitle>
                <CardDescription>
                    Let us know what you think about McDelta SMP! Your opinion matters.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormLabel className="mb-2">Your Rating</FormLabel>
                                    <FormControl>
                                        <StarRating value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name or gamertag"
                                            {...field}
                                        />
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
                                    <FormLabel>Your Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about your experience..."
                                            rows={5}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  );
}
