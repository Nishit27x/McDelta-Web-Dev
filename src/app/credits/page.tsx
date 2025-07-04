
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
        realName: "Nishit P.",
        role: "lead",
        crownClass: "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]",
        nameClass: "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.7)]",
    },
    {
        name: "Tobbler_",
        realName: "IdealCartoon",
        role: "admin",
        crownClass: "text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.7)]",
        nameClass: "text-lime-400 drop-shadow-[0_0_5px_rgba(163,230,53,0.7)]",
    },
    {
        name: "VaibhavOp345",
        realName: "Vaibhav",
        role: "admin",
        crownClass: "text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]",
        nameClass: "text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.7)]",
    },
    {
        name: "Mrkiller0033",
        realName: "Siddharth A.",
        role: "admin",
        crownClass: "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.7)]",
        nameClass: "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.7)]",
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full pt-6">
                {credits.map((person) => (
                    <div key={person.name} className="flex flex-col items-center gap-2 text-center">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center">
                            <Crown className={cn("w-16 h-16 sm:w-20 sm:h-20", person.crownClass)} />
                        </div>
                        <h4 className={cn("font-headline font-bold text-xl md:text-2xl break-words", person.nameClass)}>{person.name}</h4>
                        {person.realName && (
                            <p className="font-semibold text-base md:text-lg text-foreground/90 drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]">
                                ({person.realName})
                            </p>
                        )}
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
