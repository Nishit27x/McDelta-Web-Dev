
"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'hsl(var(--accent))',stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'hsl(var(--primary))',stopOpacity:1}} />
            </linearGradient>
        </defs>
        <path d="M12 2L2 12l10 10 10-10L12 2z" fill="url(#grad1)" stroke="hsl(var(--accent-foreground))" />
    </svg>
);


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center space-x-2">
          <DiamondIcon className="h-8 w-8" />
          <span className="hidden font-bold sm:inline-block font-jokerman text-lg text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
            McDelta SMP
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Home</Link>
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Features</Link>
          <Link href="/gallery" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Gallery</Link>
          <Link href="/rules" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Rules</Link>
          <Link href="/status" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Player Status</Link>
          <Link href="/feedback" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Feedback</Link>
          <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground" suppressHydrationWarning>Admin</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <a href="https://discord.gg/kSE8qCUY" target="_blank" rel="noopener noreferrer">Join Now</a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium pt-10">
                <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <DiamondIcon className="h-6 w-6 text-accent" />
                  <span className="font-jokerman text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">McDelta SMP</span>
                </div>
                <Link href="/" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Home</Link>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Features</Link>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Gallery</Link>
                <Link href="/rules" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Rules</Link>
                <Link href="/status" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Player Status</Link>
                <Link href="/feedback" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Feedback</Link>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground" suppressHydrationWarning>Admin</Link>
                <a href="https://discord.gg/kSE8qCUY" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Join</a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
