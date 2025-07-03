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
import { useUserSession } from '@/contexts/user-session-context';

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
  const { logout } = useUserSession();

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
      if (!sessionResponse.ok) throw new Error((await sessionResponse.json()).error || 'Failed to create a session.');

      // Step 4: Verify if the newly logged-in user is an admin
      const profileResponse = await fetch('/api/user/session');
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) throw new Error(profileData.error || 'Could not verify admin status.');

      // Step 5: Check admin flag and proceed or deny access
      if (profileData.isAdmin) {
          onSuccess();
      } else {
          await logout(); // Log out the non-admin user immediately
          throw new Error('Access Denied. You do not have admin privileges.');
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
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
          <DialogTitle>Admin Sign In</DialogTitle>
          <DialogDescription>
            Please enter your Minecraft Gamertag to access the admin panel.
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
                    <Input placeholder="e.g., LegendHacker27" {...field} />
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
                {isSubmitting ? 'Verifying...' : 'Sign In'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
