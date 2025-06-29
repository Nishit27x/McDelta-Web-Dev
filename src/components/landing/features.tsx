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
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.41669 18.25C5.41669 18.25 5.08335 16.9167 4.91669 16.4167C4.91669 16.4167 2.91669 16.0833 2.91669 14.25C2.91669 12.4167 4.33335 11.5 4.33335 11.5C4.33335 11.5 3.91669 10.5 3.83335 9.75C3.75002 9 4.33335 8.08333 4.33335 8.08333C4.33335 8.08333 4.08335 6.41667 5.58335 5.5C7.08335 4.58333 8.41669 5.25 8.41669 5.25L9.66669 7.08333C9.66669 7.08333 11.3334 6.58333 13.0834 7.08333L14.4167 5.25C14.4167 5.25 15.75 4.58333 17.25 5.5C18.75 6.41667 18.5 8.08333 18.5 8.08333C18.5 8.08333 19.0834 9 19 9.75C18.9167 10.5 18.5 11.5 18.5 11.5C18.5 11.5 19.9167 12.4167 19.9167 14.25C19.9167 16.0833 17.9167 16.4167 17.9167 16.4167C17.75 16.9167 17.4167 18.25 17.4167 18.25C17.4167 18.25 16.5 19.5 12 19.5C7.50002 19.5 5.41669 18.25 5.41669 18.25Z" stroke="#5865F2" fill="#5865F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.75 12.8333C10.5833 13.6667 11.5833 14.0833 12.4167 13.6667C13.25 13.25 13.6667 12.25 13.6667 11.4167C13.6667 10.5833 13.25 9.58333 12.4167 9.16667C11.5833 8.75 10.5833 9.16667 9.75 10C8.91669 10.8333 8.91669 12 9.75 12.8333Z" fill="hsl(var(--card-foreground))"/>
    <path d="M14.5833 10C15.4167 10.8333 15.4167 12 14.5833 12.8333C13.75 13.6667 12.75 14.0833 11.9167 13.6667" stroke="hsl(var(--card-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
