import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const credits = [
    {
        name: "LegendHacker27",
        role: "lead",
        crownClass: "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]",
    },
    {
        name: "Tobbler_",
        role: "admin",
        crownClass: "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]",
    },
    {
        name: "VaibhavOp345",
        role: "admin",
        crownClass: "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]",
    },
    {
        name: "Mrkiller0033",
        role: "admin",
        crownClass: "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.7)]",
    }
];

export default function CreditsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-4xl text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Users className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Administrative Body</CardTitle>
            <CardDescription>
              The core team responsible for the McDelta SMP.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full pt-6">
                {credits.map((person) => (
                    <div key={person.name} className="flex flex-col items-center gap-4">
                        <div className="h-24 w-24 flex items-center justify-center">
                            <Crown className={cn("w-20 h-20", person.crownClass)} />
                        </div>
                        <h4 className="font-headline font-bold text-2xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-cyan-400 drop-shadow-sm">{person.name}</h4>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
