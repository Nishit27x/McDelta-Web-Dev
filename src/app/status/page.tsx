
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import PlayerStatus from '@/components/landing/player-status';
import ServerStatusCards from '@/components/server-status-cards';

export default function StatusPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Server Status</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Check the server's current status and see who's online.
          </p>
        </div>
        <ServerStatusCards />
        <div className="mt-16">
            <PlayerStatus />
        </div>
      </main>
      <Footer />
    </div>
  );
}
