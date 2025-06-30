
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const credits = [
    {
        name: "iGalaxy",
        role: "Owner",
        avatar: "https://crafatar.com/avatars/414f549a-63b2-4299-8051-b8a75ad93a23?overlay"
    },
    {
        name: "notDELTA",
        role: "Co-Owner & Developer",
        avatar: "https://crafatar.com/avatars/f17255be-3773-4555-b463-1c7b399778c1?overlay"
    },
    {
        name: "Paradox",
        role: "Server Admin",
        avatar: "https://crafatar.com/avatars/61699b29-3a45-424a-9503-34ea2717013d?overlay"
    }
];

export default function CreditsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Award className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Credits</CardTitle>
            <CardDescription>
              A huge thank you to the team that makes McDelta SMP possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full pt-6">
                {credits.map((person) => (
                    <div key={person.name} className="flex flex-col items-center gap-2">
                        <Avatar className="w-24 h-24 border-2 border-primary">
                          <AvatarImage src={person.avatar} alt={`${person.name}'s avatar`} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h4 className="font-bold text-xl mt-2">{person.name}</h4>
                        <p className="text-sm text-muted-foreground">{person.role}</p>
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
