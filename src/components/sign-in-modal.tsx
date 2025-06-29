'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase-client';
import { signInWithCustomToken } from 'firebase/auth';

const signInSchema = z.object({
  gamertag: z.string().min(3, 'Gamertag must be at least 3 characters.').max(20, 'Gamertag cannot be longer than 20 characters.'),
});

interface SignInModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SignInModal({ onSuccess, onCancel }: SignInModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      gamertag: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Authentication Unavailable',
            description: 'The server is not configured for authentication. Please contact an administrator.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
      // Step 1: Get custom token from our backend
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamertag: values.gamertag }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.error || 'Failed to start login process.');

      // Step 2: Sign in with the custom token on the client
      const userCredential = await signInWithCustomToken(auth, loginData.customToken);
      const idToken = await userCredential.user.getIdToken();

      // Step 3: Send the ID token to the server to create a session cookie
      const sessionResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken })
      });

      const sessionData = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionData.error || 'Failed to create a session.');

      toast({
        title: 'Welcome to McDelta!',
        description: `You are now signed in as ${values.gamertag}.`,
      });
      onSuccess();

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
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Please enter your Minecraft Gamertag. This will create a secure session for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gamertag"
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
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}