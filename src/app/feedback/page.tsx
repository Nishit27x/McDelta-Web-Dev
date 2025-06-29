import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import Feedback from '@/components/landing/feedback';

export default function FeedbackPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow">
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}
