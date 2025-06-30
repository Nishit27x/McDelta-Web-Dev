
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import DiscordIcon from "../icons/discord-icon";
import ServerStatusCards from "../server-status-cards";

export default function Join() {
  const { toast } = useToast();
  const ipAddress = 'paid-1.guardxhosting.in';
  const port = '25501';


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
        <div className="mt-12">
            <ServerStatusCards />
        </div>
      </div>
    </section>
  );
}
