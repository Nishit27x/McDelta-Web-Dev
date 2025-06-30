
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Signal, ServerOff, Timer } from "lucide-react";

interface ServerStatus {
  online: number;
  max: number;
  players: string[];
  error?: string;
}

interface UptimeStatus {
  uptime: number;
  state: string;
  error?: string;
}

const formatUptime = (ms: number) => {
    if (ms <= 0) return 'Offline';
    const totalSeconds = Math.floor(ms / 1000);
    if (totalSeconds < 60) return '< 1m';

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.join(' ');
};

export default function ServerStatusCards() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [uptimeStatus, setUptimeStatus] = useState<UptimeStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statusRes, uptimeRes] = await Promise.all([
          fetch('/api/mc-status'),
          fetch('/api/mc-uptime')
        ]);
        
        const statusData = await statusRes.json();
        const uptimeData = await uptimeRes.json();

        setStatus(statusData);
        setUptimeStatus(uptimeData);
      } catch (error) {
        console.error("Failed to fetch server data:", error);
        setStatus({ online: 0, max: 0, players: [], error: "Could not retrieve status." });
        setUptimeStatus({ uptime: 0, state: 'offline', error: "Could not retrieve uptime." });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/status">
              <Card className="cursor-pointer transition-colors hover:bg-muted/50 h-full">
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

      <Card className="h-full">
          <CardContent className="p-4 flex items-center gap-4">
              {loading || (uptimeStatus && uptimeStatus.state === 'running') ? <Signal className="w-8 h-8 text-online" /> : <ServerOff className="w-8 h-8 text-destructive" />}
              <div>
                  <p className="font-bold text-2xl">
                    {loading ? 'Pinging...' : uptimeStatus?.state === 'running' ? <span className="text-online">Online</span> : <span className="text-destructive">Offline</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">Server Status</p>
              </div>
          </CardContent>
      </Card>
      
      <Card className="h-full">
          <CardContent className="p-4 flex items-center gap-4">
              <Timer className="w-8 h-8 text-accent" />
              <div>
                  <p className="font-bold text-2xl">
                    {loading ? '...' : (uptimeStatus && uptimeStatus.state === 'running' ? formatUptime(uptimeStatus.uptime) : 'Offline')}
                  </p>
                  <p className="text-sm text-muted-foreground">Server Uptime</p>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
