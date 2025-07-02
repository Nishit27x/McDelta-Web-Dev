
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import PlayerStatus from '@/components/landing/player-status';
import ServerStatusCards from '@/components/server-status-cards';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Power } from 'lucide-react';

interface Player {
  name: string;
  id: string;
}

interface ServerStatus {
  online: number;
  max: number;
  players: Player[];
  error?: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      // Don't setLoading(true) on interval to avoid flicker
      try {
        const res = await fetch('/api/mc-status', { cache: 'no-store' }); // Ensure no caching
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setStatus({ online: 0, max: 0, players: [], error: "Could not retrieve status." });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  const isServerOnline = status !== null && !status.error;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Server Status</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Check the server's current status and see who's online.
          </p>
        </div>
        
        <ServerStatusCards status={status} loading={loading} />

        <div className="max-w-2xl mx-auto mt-8 text-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                    className="w-full md:w-auto"
                    variant={isServerOnline ? 'secondary' : 'default'}
                    disabled={loading || isServerOnline}
                >
                    <Power className="mr-2 h-4 w-4" />
                    {loading ? 'Checking Status...' : isServerOnline ? 'Server is Online' : 'Request Start Server'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Out of Service</AlertDialogTitle>
                     <AlertDialogDescription>
                         This feature is currently out of service. Please contact an admin on Discord if the server is offline and needs a restart.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogAction>Got it</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>

        <div className="mt-12">
            <PlayerStatus />
        </div>
      </main>
      <Footer />
    </div>
  );
}
