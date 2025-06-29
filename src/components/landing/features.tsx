import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Swords, ScrollText, Blocks, MessageCircle, Star } from 'lucide-react';

const features = [
  {
    icon: <HeartPulse className="w-8 h-8 text-destructive" />,
    title: 'Lifesteal Mechanics',
    description: 'Eliminate other players to steal their hearts. But be careful, you can lose hearts too!',
  },
  {
    icon: <Swords className="w-8 h-8 text-accent" />,
    title: 'PvP Events',
    description: 'Participate in regular PvP tournaments and events to win exclusive rewards and glory.',
  },
  {
    icon: <ScrollText className="w-8 h-8 text-accent" />,
    title: 'Side Quests',
    description: 'Embark on unique quests to uncover the lore of the server and earn powerful items.',
  },
  {
    icon: <Blocks className="w-8 h-8 text-accent" />,
    title: 'Custom Builds',
    description: 'Explore breathtaking custom-built spawns, dungeons, and arenas crafted by our team.',
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-accent" />,
    title: 'Active Discord',
    description: 'Join our vibrant Discord community to chat, trade, and team up with other players.',
  },
  {
    icon: <Star className="w-8 h-8 text-accent" />,
    title: 'Player-driven Economy',
    description: 'Engage in a dynamic economy where players control the market through shops and trades.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Server Features</h2>
          <p className="text-lg text-muted-foreground mt-2">What makes McDelta SMP unique.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="items-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
