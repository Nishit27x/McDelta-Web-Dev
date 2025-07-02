
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import BuyMeACoffeeButton from '@/components/buy-me-a-coffee-button';
import { UserSessionProvider } from '@/contexts/user-session-context';

export const metadata: Metadata = {
  title: 'McDelta SMP',
  description: 'Welcome to the McDelta Lifesteal SMP Server!',
  icons: {
    icon: [],
    shortcut: [],
    apple: [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jokerman&family=Poppins:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <UserSessionProvider>
            {children}
        </UserSessionProvider>
        <Toaster />
        <BuyMeACoffeeButton />
      </body>
    </html>
  );
}
