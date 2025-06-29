import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import Gallery from '@/components/landing/gallery';

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
