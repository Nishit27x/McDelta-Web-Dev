
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Terminal, ShieldAlert, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSession } from '@/contexts/user-session-context';
import { Skeleton } from '@/components/ui/skeleton';
import SignInModal from '@/components/sign-in-modal';

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
      if (responseText) {
        const responseLines = responseText.split('\n').filter((line: string) => line.trim() !== '');
        if(responseLines.length > 0) {
            setOutput(prev => [...prev, ...responseLines]);
        }
      } else {
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
            <CardDescription>Execute commands directly on the server. Only admins have access.</CardDescription>
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

// A component to show while checking authentication
const LoadingState = () => (
    <Card className="w-full max-w-4xl h-[75vh] flex flex-col">
        <CardHeader>
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2 mt-4">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-[400px]" />
             </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-full w-full" />
        </CardContent>
    </Card>
);

// A component to show for non-admins or logged out users
const AccessDenied = ({ onSignIn }: { onSignIn: () => void }) => (
    <Card className="w-full max-w-md text-center">
        <CardHeader>
             <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="mt-4">Access Denied</CardTitle>
            <CardDescription>
                You must be signed in as an administrator to access the server console.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <Button onClick={onSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
            </Button>
            <Button asChild variant="link">
              <Link href="/">
                Go back to homepage
              </Link>
            </Button>
        </CardContent>
    </Card>
);


export default function AdminPage() {
  const { profile, isLoading } = useUserSession();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (!profile || !profile.isAdmin) {
      return <AccessDenied onSignIn={() => setShowSignInModal(true)} />;
    }

    return <ConsoleView />;
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        {renderContent()}
      </main>
      {showSignInModal && (
        <SignInModal 
          onSuccess={() => setShowSignInModal(false)}
          onCancel={() => setShowSignInModal(false)}
        />
      )}
      <Footer />
    </div>
  );
}
