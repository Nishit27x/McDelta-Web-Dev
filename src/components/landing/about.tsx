import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">About McDelta SMP</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              McDelta SMP is not just another Minecraft server. We are a community-driven Lifesteal SMP where strategy, skill, and alliances determine your fate. Our server is built on providing a challenging yet fair gameplay experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With custom features, regular events, and an active player base, there's always something new to discover. Whether you're a seasoned PvP veteran or a master builder, you'll find your place in the world of McDelta.
            </p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden group shadow-2xl shadow-primary/20 transition-all duration-300 ease-in-out hover:shadow-primary/40 hover:shadow-2xl hover:scale-105">
            <Image
              src="https://placehold.co/1280x720.png"
              alt="Server Trailer Thumbnail"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint="minecraft cinematic"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-black/60">
              <Button variant="ghost" size="icon" className="w-24 h-24 text-white hover:bg-primary/80 transition-colors">
                <PlayCircle className="w-20 h-20" />
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
