'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

// Mock data for all players who have ever joined.
// In a real application, you would fetch this from a database.
const allTimePlayers = [
    'Steve', 'Alex', 'NoobSlayer69', 'CreeperLover', 'DiamondMiner_42', 
    'Herobrine', 'Notch', 'Jeb_', 'Dinnerbone', 'Grumm'
];

interface ServerStatus {
  online: number;
  max: number;
  players: string[];
  error?: string;
}

export default function PlayerStatus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/mc-status');
        const data: ServerStatus = await res.json();
        if (data && data.players) {
          setOnlinePlayers(data.players);
        }
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        setOnlinePlayers([]);
      } finally {
          setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const uniquePlayers = useMemo(() => {
    // Combine all-time players with currently online players and remove duplicates.
    const allPlayers = [...new Set([...allTimePlayers, ...onlinePlayers])];
    return allPlayers.sort((a, b) => a.localeCompare(b));
  }, [onlinePlayers]);


  const filteredPlayers = useMemo(() => {
    return uniquePlayers.filter((player) =>
      player.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniquePlayers, searchTerm]);

  return (
    <section id="player-status" className="py-16 md:py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Player Status</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Search for players and see who is currently online.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6" />
              <span>Search Players</span>
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
                        const isOnline = onlinePlayers.includes(player);
                        return (
                        <li key={player} className="flex items-center justify-between p-3 rounded-md bg-background/50">
                            <span className="font-medium">{player}</span>
                            <div className="flex items-center gap-2">
                            <span
                                className={`h-3 w-3 rounded-full ${isOnline ? 'bg-online' : 'bg-muted-foreground/50'}`}
                            ></span>
                            <span className={`text-sm font-semibold ${isOnline ? 'text-online' : 'text-muted-foreground'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                            </div>
                        </li>
                        );
                    })}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No players found matching your search.</p>
                )}
                </div>
            )}
            <p className="text-xs text-muted-foreground mt-4 text-center">* Player list includes mock data. A database is needed for a full player history.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
