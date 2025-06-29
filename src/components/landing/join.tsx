'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Signal, ServerOff } from "lucide-react";
import DiscordIcon from "../icons/discord-icon";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface ServerStatus {
  online: number;
  max: number;
  players: string[];
  error?: string;
}

export default function Join() {
  const { toast } = useToast();
  const ipAddress = 'paid-1.guardxhosting.in';
  const port = '25501';


  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mc-status');
        const data = await res.json();
        // The API returns a JSON response for both success and error cases,
        // so we can just set the status with the data we receive.
        setStatus(data);
      } catch (error) {
        // This will catch network errors or if res.json() fails.
        console.error("Failed to fetch server status:", error);
        setStatus({ online: 0, max: 0, players: [], error: "Could not retrieve server status." });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const copyIpToClipboard = () => {
    navigator.clipboard.writeText(ipAddress);
    toast({
      title: "Copied to clipboard!",
      description: `Server IP: ${ipAddress}`,
    });
  };

  const copyPortToClipboard = () => {
    navigator.clipboard.writeText(port);
    toast({
      title: "Copied to clipboard!",
      description: `Server Port: ${port}`,
    });
  };

  return (
    <section id="join" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Join the Server</h2>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ready to start your adventure? Copy the IP below or join our Discord to get started!
        </p>
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <Card className="bg-background/50 shadow-inner-lg">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="font-mono text-lg tracking-widest">IP: {ipAddress}</span>
                <Button variant="ghost" size="icon" onClick={copyIpToClipboard} aria-label="Copy server IP" suppressHydrationWarning>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
               <div className="flex items-center justify-between gap-4 w-full">
                <span className="font-mono text-lg tracking-widest">Port: {port}</span>
                <Button variant="ghost" size="icon" onClick={copyPortToClipboard} aria-label="Copy server port" suppressHydrationWarning>
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button asChild size="lg" className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white" suppressHydrationWarning>
            <a href="https://discord.gg/kSE8qCUY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <DiscordIcon className="w-6 h-6" />
              Join our Discord
            </a>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/status">
                    <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Users className="w-8 h-8 text-primary" />
                            <div>
                                <p className="font-bold text-2xl">
                                  {loading ? '...' : `${status?.online ?? 0} / ${status?.max ?? 0}`}
                                </p>
                                <p className="text-sm text-muted-foreground">Players Online</p>
                            </div>
                        </CardContent>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {loading ? (
                    <p>Loading players...</p>
                  ) : (status?.players && status.players.length > 0) ? (
                    <div>
                      <p className="font-bold mb-2">Players:</p>
                      <ul className="list-disc list-inside">
                        {status.players.map(p => <li key={p}>{p}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <p>No players online.</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    {loading || (status && !status.error) ? <Signal className="w-8 h-8 text-online" /> : <ServerOff className="w-8 h-8 text-destructive" />}
                    <div>
                        <p className="font-bold text-2xl">
                          {loading ? 'Pinging...' : status?.error ? <span className="text-destructive">Offline</span> : <span className="text-online">Online</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">Server Status</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
