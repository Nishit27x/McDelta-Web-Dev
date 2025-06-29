import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import PlayerStatus from '@/components/landing/player-status';

export default function StatusPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow">
        <PlayerStatus />
      </main>
      <Footer />
    </div>
  );
}
