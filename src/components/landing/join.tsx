'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Signal } from "lucide-react";
import DiscordIcon from "../icons/discord-icon";

export default function Join() {
  const { toast } = useToast();
  const serverIp = 'play.mcdelta.smp';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverIp);
    toast({
      title: "Copied to clipboard!",
      description: `Server IP: ${serverIp}`,
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
            <CardContent className="p-4 flex items-center gap-4">
              <span className="font-mono text-lg tracking-widest">{serverIp}</span>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy server IP">
                <Copy className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
          <Button asChild size="lg" className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white">
            <a href="https://discord.gg/kSE8qCUY" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <DiscordIcon className="w-6 h-6" />
              Join our Discord
            </a>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-bold text-2xl">69 / 100</p>
                        <p className="text-sm text-muted-foreground">Players Online</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <Signal className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-bold text-2xl">99.9%</p>
                        <p className="text-sm text-muted-foreground">Server Uptime</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}
