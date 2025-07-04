import Header from '@/components/header';
import Hero from '@/components/landing/hero';
import About from '@/components/landing/about';
import Features from '@/components/landing/features';
import Join from '@/components/landing/join';
import Footer from '@/components/landing/footer';
import Feedback from '@/components/landing/feedback';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Features />
        <Feedback />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
