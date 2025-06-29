'use client';

import Link from 'next/link';
import { Youtube } from 'lucide-react';
import DiscordIcon from '../icons/discord-icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <DiamondIcon className="h-6 w-6 text-accent" />
            <span className="font-bold font-jokerman">McDelta SMP</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link>
            <Link href="/#features" className="text-muted-foreground hover:text-accent transition-colors">Features</Link>
            <Link href="/#gallery" className="text-muted-foreground hover:text-accent transition-colors">Gallery</Link>
            <Link href="/rules" className="text-muted-foreground hover:text-accent transition-colors">Rules</Link>
            <Link href="/#feedback" className="text-muted-foreground hover:text-accent transition-colors">Feedback</Link>
            <Link href="/#join" className="text-muted-foreground hover:text-accent transition-colors">Join</Link>
          </nav>
          <div className="flex items-center space-x-4 justify-center md:justify-end">
            <a href="https://discord.gg/kSE8qCUY" aria-label="Discord" className="text-muted-foreground hover:text-accent transition-colors"><DiscordIcon className="w-6 h-6" /></a>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button aria-label="YouTube" className="text-muted-foreground hover:text-accent transition-colors">
                  <Youtube className="w-6 h-6" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Coming Soon!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Our YouTube channel is under construction. Keep Supporting!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} McDelta SMP. All Rights Reserved.</p>
          <p className="mt-1">Not an official Minecraft product. Not approved by or associated with Mojang.</p>
        </div>
      </div>
    </footer>
  );
}
