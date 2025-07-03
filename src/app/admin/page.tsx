
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

// The main component for the RCON console UI
const RconConsoleView = () => {
  const [output, setOutput] = useState<string[]>(['Welcome to the RCON console.']);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Automatically scroll to the bottom of the console output
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    // Focus the input on initial load
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Re-focus the input after a command has been submitted.
    // This runs after the component re-renders, ensuring the input is not disabled.
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);


  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand || isSubmitting) return;

    setIsSubmitting(true);
    setOutput(prev => [...prev, `> ${trimmedCommand}`]);

    // Add to command history if it's new, and reset index
    if (!commandHistory.includes(trimmedCommand)) {
        const newHistory = [...commandHistory, trimmedCommand];
        setCommandHistory(newHistory);
        setHistoryIndex(newHistory.length);
    } else {
        // If command exists, just reset the index to the end
        setHistoryIndex(commandHistory.length);
    }

    try {
      const response = await fetch('/api/rcon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmedCommand }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }
      
      const responseText = result.response || '(No response from server)';
      setOutput(prev => [...prev, responseText]);

    } catch (error) {
      const errorMessage = (error as Error).message;
      setOutput(prev => [...prev, `Error: ${errorMessage}`]);
      toast({
        variant: 'destructive',
        title: 'Command Failed',
        description: errorMessage,
      });
    } finally {
      setCommand('');
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (commandHistory.length === 0) return;

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setCommand(commandHistory[newIndex] || '');
        } else {
            // When pressing down at the end of history, clear the input
            setHistoryIndex(commandHistory.length);
            setCommand('');
        }
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
                <CardTitle>RCON Console</CardTitle>
                <CardDescription>Execute commands on the server via RCON.</CardDescription>
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
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a command... (e.g., 'list')"
            disabled={isSubmitting}
            className="font-mono flex-grow"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
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


export default function AdminPage() {
  const { profile, isLoading } = useUserSession();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[50vh] w-full" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!profile) {
      return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <LogIn className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4">Authentication Required</CardTitle>
                <CardDescription>
                    Please sign in to access the admin console.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </CardContent>
        </Card>
      );
    }

    if (!profile.isAdmin) {
      return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                    <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
                <CardTitle className="mt-4">Access Denied</CardTitle>
                <CardDescription>
                    You do not have permission to view this page. Admin access is required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </CardContent>
        </Card>
      );
    }

    return <RconConsoleView />;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
