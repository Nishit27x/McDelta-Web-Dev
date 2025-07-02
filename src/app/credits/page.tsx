import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const credits = [
    {
        name: "LegendHacker27",
        avatar: "https://crafatar.com/avatars/690a424c-2a66-4f51-872f-5f89a2e6e87b?overlay"
    },
    {
        name: "Tobbler_",
        avatar: "https://crafatar.com/avatars/f84c6a79-0a4e-45e0-879b-cd49ebd4c4e2?overlay"
    },
    {
        name: "VaibhavOp345",
        avatar: "https://crafatar.com/avatars/690a424c-2a66-4f51-872f-5f89a2e6e87b?overlay"
    },
    {
        name: "Mrkiller0033",
        avatar: "https://crafatar.com/avatars/690a424c-2a66-4f51-872f-5f89a2e6e87b?overlay"
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
                    <div key={person.name} className="flex flex-col items-center gap-2">
                        <Crown className="w-10 h-10 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                        <Avatar className="w-24 h-24 border-2 border-primary">
                          <AvatarImage src={person.avatar} alt={`${person.name}'s avatar`} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
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
