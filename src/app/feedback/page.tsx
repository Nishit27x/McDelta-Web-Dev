'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUserSession, AuthWrapper } from '@/contexts/user-session-context';
import { Star, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib/utils';

const feedbackSchema = z.object({
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
    const { toast } = useToast();
    const { profile } = useUserSession();

    const form = useForm<z.infer<typeof feedbackSchema>>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            message: '',
            rating: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof feedbackSchema>) {
        if (!profile) {
            toast({
                variant: 'destructive',
                title: 'Not Signed In',
                description: 'You must be signed in to submit feedback.',
            });
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong.');
            }
            toast({
                title: 'Feedback Submitted!',
                description: "Thanks for helping us improve McDelta SMP.",
            });
            form.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: (error as Error).message,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!profile) {
        return (
             <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <MessageSquareQuote className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Share Your Feedback</CardTitle>
                    <CardDescription>
                        You must be signed in to leave a review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please use the "ADMIN" button in the header to sign in.
                    </p>
                </CardContent>
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
        <AuthWrapper>
            <FeedbackForm />
        </AuthWrapper>
      </main>
      <Footer />
    </div>
  );
}
