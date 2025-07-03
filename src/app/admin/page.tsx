
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShieldAlert, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSession, AuthWrapper } from '@/contexts/user-session-context';
import SignInModal from '@/components/sign-in-modal';
import { Skeleton } from '@/components/ui/skeleton';

// The main component for the console UI
const ConsoleView = () => {
  const [output, setOutput] = useState<string[]>(['Welcome to the McDelta SMP RCON console. Type a command to begin.']);
  const [command, setCommand] = useState('');
  const [isSending, setIsSending] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Automatically scroll to the bottom of the console output
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand || isSending) return;

    setIsSending(true);
    setOutput(prev => [...prev, `> ${trimmedCommand}`]);
    setCommand('');

    try {
      const res = await fetch('/api/rcon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmedCommand }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      
      const responseText = data.response;
      // Handle responses with text content
      if (responseText) {
        const responseLines = responseText.split('\n').filter((line: string) => line.trim() !== '');
        if(responseLines.length > 0) {
            setOutput(prev => [...prev, ...responseLines]);
        }
      } else {
        // Handle successful commands that return no text
        setOutput(prev => [...prev, 'Command executed successfully.']);
      }

    } catch (error) {
      const errorMessage = (error as Error).message;
      setOutput(prev => [...prev, `Error: ${errorMessage}`]);
      toast({
        variant: 'destructive',
        title: 'RCON Error',
        description: errorMessage,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl h-[75vh] flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full border-2 border-primary/20">
            <Terminal className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Server Console</CardTitle>
            <CardDescription>Execute commands directly on the server. Use with caution.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div ref={outputRef} className="flex-grow bg-muted rounded-md p-4 overflow-y-auto font-mono text-sm space-y-1 mb-4 h-full">
          {output.map((line, index) => (
            <p key={index} className={cn('whitespace-pre-wrap break-words',
              line.startsWith('>') ? 'text-primary' : (line.startsWith('Error:') ? 'text-destructive' : 'text-muted-foreground')
            )}>
              {line.replace(/§[0-9a-fk-or]/g, '')}
            </p>
          ))}
        </div>
        <form onSubmit={handleSendCommand} className="flex gap-2">
          <Input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter a command (e.g., 'list')"
            disabled={isSending}
            className="font-mono flex-grow"
            autoFocus
          />
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardContent>
       <CardFooter className="flex justify-end pt-4">
          <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
          </Button>
      </CardFooter>
    </Card>
  );
};

// This component handles the logic for displaying content based on auth state.
function AdminPageContent() {
    const { profile, isLoading } = useUserSession();
    const [showSignIn, setShowSignIn] = useState(false);

    useEffect(() => {
        // If the user is not logged in after the initial check, prompt them to sign in.
        if (!isLoading && !profile) {
            setShowSignIn(true);
        }
    }, [isLoading, profile]);

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl h-[75vh] p-4">
                <Skeleton className="h-full w-full" />
            </div>
        );
    }
    
    // If user is not an admin (or not logged in), show an access denied message.
    if (!profile?.isAdmin) {
        return (
            <>
                <Card className="w-full max-w-md text-center border-destructive">
                    <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="mt-4 text-destructive">Admin Access Required</CardTitle>
                    <CardDescription>
                        You do not have permission to view this page. Please sign in with an admin account.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button onClick={() => setShowSignIn(true)} variant="default" className="w-full">
                            Sign In
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                {showSignIn && <SignInModal onSuccess={() => window.location.reload()} onCancel={() => setShowSignIn(false)} />}
            </>
        );
    }
    
    // If the user is an admin, show the console.
    return <ConsoleView />;
}


export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <AuthWrapper>
            <AdminPageContent />
        </AuthWrapper>
      </main>
      <Footer />
    </div>
  );
}
