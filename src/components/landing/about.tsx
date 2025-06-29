import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">About McDelta SMP</h2>
            <p className="text-lg text-muted-foreground">
              McDelta SMP is not just another Minecraft server. We are a community-driven Lifesteal SMP where strategy, skill, and alliances determine your fate. Our server is built on providing a challenging yet fair gameplay experience.
            </p>
            <p className="text-lg text-muted-foreground">
              With custom features, regular events, and an active player base, there's always something new to discover. Whether you're a seasoned PvP veteran or a master builder, you'll find your place in the world of McDelta.
            </p>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden group shadow-lg">
            <Image
              src="https://placehold.co/1280x720.png"
              alt="Server Trailer Thumbnail"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="minecraft cinematic"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button variant="ghost" size="icon" className="w-20 h-20 text-white hover:bg-white/20 transition-colors">
                <PlayCircle className="w-16 h-16" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">
              Watch Our Server Trailer!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
