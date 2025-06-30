
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export default function PlayerStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [totalOnline, setTotalOnline] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mc-status');
        const data: ServerStatus = await res.json();
        if (data && data.players) {
          setOnlinePlayers(data.players.sort((a, b) => a.name.localeCompare(b.name)));
          setTotalOnline(data.online);
        } else {
          setOnlinePlayers([]);
          setTotalOnline(0);
        }
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setOnlinePlayers([]);
        setTotalOnline(0);
      } finally {
          setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);


  const filteredPlayers = useMemo(() => {
    if (!searchTerm) {
      return onlinePlayers;
    }
    return onlinePlayers.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [onlinePlayers, searchTerm]);

  return (
    <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-6 h-6" />
          <span>Search Online Players ({totalOnline})</span>
        </CardTitle>
        <div className="relative mt-4">
          <Input
            type="text"
            placeholder="Enter a player's gamertag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading player data...</p>
        ) : (
            <div className="max-h-96 overflow-y-auto pr-2 -mr-4">
            {filteredPlayers.length > 0 ? (
                <ul className="space-y-3">
                {filteredPlayers.map((player) => {
                    return (
                    <li key={player.id} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarImage src={`https://crafatar.com/avatars/${player.id}?overlay`} alt={`${player.name}'s skin`} />
                                <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <span
                            className={`h-3 w-3 rounded-full bg-online`}
                        ></span>
                        <span className={`text-sm font-semibold text-online`}>
                            Online
                        </span>
                        </div>
                    </li>
                    );
                })}
                </ul>
            ) : (
              onlinePlayers.length === 0 && !searchTerm ? (
                <p className="text-center text-muted-foreground py-8">No players are currently online.</p>
              ) : (
                <p className="text-center text-muted-foreground py-8">No players found matching your search.</p>
              )
            )}
            </div>
        )}
        <p className="text-xs text-muted-foreground mt-4 text-center">* Only currently online players are shown.</p>
      </CardContent>
    </Card>
  );
}
