
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

// The main component for the console UI
const ConsoleView = () => {
  const [output, setOutput] = useState<string[]>(['Attempting to connect to live console...']);
  const [command, setCommand] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected, error
  const ws = useRef<WebSocket | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Automatically scroll to the bottom of the console output
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const connect = async () => {
      try {
        const res = await fetch('/api/live-console');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to get connection credentials.');
        }
        const { token, socketUrl } = await res.json();

        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => {
          ws.current?.send(JSON.stringify({ event: 'auth', args: [token] }));
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
          
            switch (data.event) {
              case 'auth success':
                setConnectionStatus('connected');
                setOutput(prev => [...prev, '✔ Connection successful. Welcome to the live console.']);
                // Request initial logs
                ws.current?.send(JSON.stringify({ event: "send logs", args: [] }));
                break;
              case 'console output':
                setOutput(prev => [...prev, ...data.args]);
                break;
              case 'status':
                setOutput(prev => [...prev, `Server status changed to: ${data.args[0]}`]);
                break;
              case 'token expiring':
                setOutput(prev => [...prev, 'Connection token is expiring. Please refresh the page to reconnect.']);
                break;
              case 'token expired':
                setConnectionStatus('error');
                setOutput(prev => [...prev, 'Connection token expired. Please refresh the page.']);
                ws.current?.close();
                break;
              default:
                break;
            }
          } catch(e) {
             console.error("Failed to parse WebSocket message", e);
          }
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setConnectionStatus('error');
          setOutput(prev => [...prev, 'Error: Could not establish a live connection. The server might be offline or an API key is invalid.']);
          toast({ variant: 'destructive', title: 'Connection Error', description: 'Could not establish a live connection to the server.' });
        };

        ws.current.onclose = (event) => {
          // Don't show disconnected message if it was an error
          if (!event.wasClean && connectionStatus !== 'error') {
            setConnectionStatus('disconnected');
            setOutput(prev => [...prev, 'Connection closed.']);
          }
        };

      } catch (error) {
        setConnectionStatus('error');
        const errorMessage = (error as Error).message;
        setOutput(prev => [...prev, `Error: ${errorMessage}`]);
        toast({ variant: 'destructive', title: 'Connection Failed', description: errorMessage });
      }
    };

    connect();

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.onclose = null; // prevent onclose from running on manual close
        ws.current.close();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);


  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCommand = command.trim();
    if (!trimmedCommand || connectionStatus !== 'connected' || !ws.current) return;
    
    // Pterodactyl doesn't echo the command, so we do it manually.
    setOutput(prev => [...prev, `> ${trimmedCommand}`]);
    ws.current.send(JSON.stringify({ event: 'send command', args: [trimmedCommand] }));
    setCommand('');
  };
  
  const isSendingDisabled = connectionStatus !== 'connected';

  return (
    <Card className="w-full max-w-4xl h-[75vh] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full border-2 border-primary/20">
                    <Terminal className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>Live Server Console</CardTitle>
                    <CardDescription>Execute commands and view the live server log.</CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-2" title={`Status: ${connectionStatus}`}>
                <div className={cn('h-3 w-3 rounded-full', {
                    'bg-yellow-400 animate-pulse': connectionStatus === 'connecting',
                    'bg-online': connectionStatus === 'connected',
                    'bg-destructive': connectionStatus === 'error',
                    'bg-muted-foreground': connectionStatus === 'disconnected',
                })} />
                <span className="text-sm capitalize text-muted-foreground">{connectionStatus}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div ref={outputRef} className="flex-grow bg-muted rounded-md p-4 overflow-y-auto font-mono text-sm space-y-1 mb-4 h-full">
          {output.map((line, index) => (
            <p key={index} className={cn('whitespace-pre-wrap break-words',
              line.startsWith('>') ? 'text-primary' : (line.startsWith('Error:') || line.startsWith('Connection token expired') ? 'text-destructive' : 'text-muted-foreground')
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
            placeholder={isSendingDisabled ? "Waiting for connection..." : "Enter a command..."}
            disabled={isSendingDisabled}
            className="font-mono flex-grow"
            autoFocus
          />
          <Button type="submit" disabled={isSendingDisabled}>
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Send'}
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
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <ConsoleView />
      </main>
      <Footer />
    </div>
  );
}
