import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <Construction className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Work in Progress</CardTitle>
            <CardDescription>
              Our new feedback system is currently under construction. Please check back soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              In the meantime, feel free to share your thoughts on our{' '}
              <a href="https://discord.gg/kSE8qCUY" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Discord server
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
