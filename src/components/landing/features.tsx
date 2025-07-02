import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LifestealIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.0001 5.3999C12.0001 5.3999 15.6001 2.3999 18.6001 4.5999C21.6001 6.7999 20.4001 11.1999 18.6001 13.5999C16.8001 15.9999 12.0001 20.3999 12.0001 20.3999" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 5.3999C12 5.3999 8.4 2.3999 5.4 4.5999C2.4 6.7999 3.6 11.1999 5.4 13.5999C7.2 15.9999 12 20.3999 12 20.3999" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 11L8 11" stroke="hsl(var(--destructive-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
);

const PvPIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M6 18L18 6" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 6L12.7279 7.27211C12.5539 7.44612 12.4669 7.53312 12.4219 7.6367C12.3769 7.74028 12.3769 7.85972 12.4219 7.9633C12.4669 8.06688 12.5539 8.15388 12.7279 8.32789L13.5 9" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 13.5L8.32789 11.2721C8.5019 11.1461 8.5889 11.0831 8.68248 11.0504C8.77606 11.0177 8.87785 11.0177 8.97143 11.0504C9.06501 11.0831 9.15201 11.1461 9.32602 11.2721L10 12" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 21L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 5L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const QuestsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M8 21H12C16.4183 21 18 19.4183 18 15V9C18 4.58172 16.4183 3 12 3H8C5.79086 3 4 4.79086 4 7V17C4 19.2091 5.79086 21 8 21Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9C16.8954 9 16 8.10457 16 7C16 5.89543 16.8954 5 18 5" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6L12 6" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10L12 10" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BuildsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M15 21H9C6.79086 21 5 19.2091 5 17V7C5 4.79086 6.79086 3 9 3H15C17.2091 3 19 4.79086 19 7V17C19 19.2091 17.2091 21 15 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 16V13C9 12.4477 9.44772 12 10 12H14C14.5523 12 15 12.4477 15 13V16" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12V9H15" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9H10" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const EconomyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 7V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 21V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.54 5.24a13.89 13.89 0 0 0-3.6-1.45 13.34 13.34 0 0 0-3.8-0.54h-0.2a13.34 13.34 0 0 0-3.8 0.54 13.89 13.89 0 0 0-3.6 1.45 13.5 13.5 0 0 0-2.6 3.65 13.3 13.3 0 0 0-0.6 4.3v0.2a13.3 13.3 0 0 0 0.6 4.3 13.5 13.5 0 0 0 2.6 3.65 13.89 13.89 0 0 0 3.6 1.45 13.34 13.34 0 0 0 3.8 0.54h0.2a13.34 13.34 0 0 0 3.8-0.54 13.89 13.89 0 0 0 3.6-1.45 13.5 13.5 0 0 0 2.6-3.65 13.3 13.3 0 0 0 0.6-4.3v-0.2a13.3 13.3 0 0 0-0.6-4.3 13.5 13.5 0 0 0-2.6-3.65ZM8.64 14.64a1.8 1.8 0 1 1 1.8-1.8 1.8 1.8 0 0 1-1.8 1.8Zm6.72 0a1.8 1.8 0 1 1 1.8-1.8 1.8 1.8 0 0 1-1.8 1.8Z"/>
    </svg>
);

const TwentyFourSevenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6V12L16 14" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const features = [
  {
    icon: <LifestealIcon />,
    title: 'Lifesteal Mechanics',
    description: 'Eliminate other players to steal their hearts. But be careful, you can lose hearts too!',
  },
  {
    icon: <PvPIcon />,
    title: 'PvP Events',
    description: 'Participate in regular PvP tournaments and events to win exclusive rewards and glory.',
  },
  {
    icon: <QuestsIcon />,
    title: 'Side Quests',
    description: 'Embark on unique quests to uncover the lore of the server and earn powerful items.',
  },
  {
    icon: <BuildsIcon />,
    title: 'Custom Builds',
    description: 'Explore breathtaking custom-built spawns, dungeons, and arenas crafted by our team.',
  },
  {
    icon: <DiscordIcon />,
    title: 'Active Discord',
    description: 'Join our vibrant Discord community to chat, trade, and team up with other players.',
  },
  {
    icon: <EconomyIcon />,
    title: 'Player-driven Economy',
    description: 'Engage in a dynamic economy where players control the market through shops and trades.',
  },
  {
    icon: <TwentyFourSevenIcon />,
    title: '24/7 Online',
    description: 'Our server is always online, so you can join the action anytime.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Server Features</h2>
          <p className="text-lg text-muted-foreground mt-4">What makes McDelta SMP unique.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader className="items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/30">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
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
