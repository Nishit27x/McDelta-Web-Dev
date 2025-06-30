import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const credits = [
    {
        name: "LegendHacker27",
        avatar: "https://crafatar.com/avatars/f8cdb682-1457-4252-a430-5b8a61388914?overlay" // Herobrine
    },
    {
        name: "Tobbler_",
        avatar: "https://crafatar.com/avatars/00bb0364-c48f-4217-a9a3-7c369e431f79?overlay" // Zuri
    },
    {
        name: "VaibhavOp345",
        avatar: "https://crafatar.com/avatars/8667ba71-b85a-4004-af54-457a9734eed7?overlay" // Steve
    },
    {
        name: "Mrkiller0033",
        avatar: "https://crafatar.com/avatars/6ab43178-89fd-4903-9993-1383aaaa5853?overlay" // Alex
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
                        <Avatar className="w-24 h-24 border-2 border-primary">
                          <AvatarImage src={person.avatar} alt={`${person.name}'s avatar`} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-bold text-xl mt-2">{person.name}</h4>
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
