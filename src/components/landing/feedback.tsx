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
import React from "react";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500),
  rating: z.number().min(1, "Please provide a rating.").max(5),
});

const recentFeedback = [
  { name: 'Steve', avatar: 'https://placehold.co/40x40.png', hint: 'pixel avatar', rating: 5, message: "Absolutely the best Lifesteal SMP I've ever played. The community is fantastic!" },
  { name: 'Alex', avatar: 'https://placehold.co/40x40.png', hint: 'pixel avatar', rating: 5, message: "The PvP events are intense and the custom builds are epic. 10/10." },
  { name: 'NoobSlayer69', avatar: 'https://placehold.co/40x40.png', hint: 'pixel avatar', rating: 4, message: "Great server, very challenging. Lost a few hearts but it's part of the fun." },
];

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
  const { toast } = useToast();
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: "", message: "", rating: 0 },
  });

  function onSubmit(values: z.infer<typeof feedbackSchema>) {
    console.log(values);
    toast({
      title: "Feedback Sent!",
      description: "Thanks for sharing your thoughts with us.",
    });
    form.reset({ name: "", message: "", rating: 0 });
  }

  return (
    <section id="feedback" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Player Feedback</h2>
          <p className="text-lg text-muted-foreground mt-2">See what our players have to say.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Card>
            <CardHeader>
              <CardTitle>Leave Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Steve" {...field} /></FormControl>
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
                  <Button type="submit">Submit Feedback</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-center">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {recentFeedback.map((fb, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-card border-2 border-primary/20 shadow-primary/10">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="w-16 h-16 mb-4 border-2 border-primary">
                          <AvatarImage src={fb.avatar} data-ai-hint={fb.hint}/>
                          <AvatarFallback>{fb.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-bold text-lg">{fb.name}</h4>
                        <div className="flex my-2">
                           {Array(fb.rating).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)}
                           {Array(5-fb.rating).fill(0).map((_, i) => <Star key={i} className="w-5 h-5 text-muted-foreground/50" />)}
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
      </div>
    </section>
  );
}
