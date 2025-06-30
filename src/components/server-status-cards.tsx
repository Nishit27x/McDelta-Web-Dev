
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Signal, ServerOff, Power } from "lucide-react";

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

export default function ServerStatusCards() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mc-status');
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
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const isServerOnline = status !== null && !status.error;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50 h-full">
              <Link href="/status" className="block h-full">
                  <CardContent className="p-4 flex items-center gap-4">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                          <p className="font-bold text-2xl">
                            {loading ? '...' : `${status?.online ?? 0} / ${status?.max ?? 0}`}
                          </p>
                          <p className="text-sm text-muted-foreground">Players Online</p>
                      </div>
                  </CardContent>
              </Link>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            {loading ? (
              <p>Loading players...</p>
            ) : (status?.players && status.players.length > 0) ? (
              <div>
                <p className="font-bold mb-2">Players:</p>
                <ul className="list-disc list-inside">
                  {status.players.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
              </div>
            ) : (
              <p>No players online.</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Card className="h-full">
          <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-4">
                  {loading ? (
                      <Signal className="w-8 h-8 text-muted-foreground animate-pulse" />
                  ) : isServerOnline ? (
                      <Signal className="w-8 h-8 text-online" />
                  ) : (
                      <ServerOff className="w-8 h-8 text-destructive" />
                  )}
                  <div>
                      <p className="font-bold text-2xl">
                        {loading ? 'Pinging...' : isServerOnline ? <span className="text-online">Online</span> : <span className="text-destructive">Offline</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">Server Status</p>
                  </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full mt-4" disabled={loading}>
                        <Power className="mr-2 h-4 w-4" />
                         {loading ? 'Checking Status...' : 'Request Start Server'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                       {isServerOnline ? (
                         <>
                            <AlertDialogTitle>Server is already online</AlertDialogTitle>
                            <AlertDialogDescription>
                                You can now join the server.
                            </AlertDialogDescription>
                         </>
                       ) : (
                         <>
                            <AlertDialogTitle>Out of Service</AlertDialogTitle>
                            <AlertDialogDescription>
                                This feature is currently out of service, will be back soon.
                            </AlertDialogDescription>
                         </>
                       )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Got it</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </CardContent>
      </Card>
    </div>
  );
}
