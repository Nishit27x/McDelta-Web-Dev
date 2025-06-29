'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { useToast } from '@/hooks/use-toast';
import { Power } from 'lucide-react';

const serverAdminSchema = z.object({
  adminSecret: z.string().min(1, 'Admin secret is required.'),
});

export default function ServerAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof serverAdminSchema>>({
    resolver: zodResolver(serverAdminSchema),
    defaultValues: {
      adminSecret: '',
    },
  });

  async function handleStartServer(values: z.infer<typeof serverAdminSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/start-server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminSecret: values.adminSecret }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start the server.');
      }

      toast({
        title: 'Server Command Sent!',
        description: result.message,
      });
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
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Server Administration</CardTitle>
            <CardDescription>
              Use this panel to manage the Minecraft server. Actions require an
              admin secret token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleStartServer)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="adminSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Secret Token</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your secret token"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Power className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Sending Command...' : 'Start Server'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
