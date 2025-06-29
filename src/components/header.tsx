"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

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


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <DiamondIcon className="h-6 w-6 text-accent" />
          <span className="hidden font-bold sm:inline-block font-jokerman">
            McDelta SMP
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="/#gallery" className="text-muted-foreground transition-colors hover:text-foreground">Gallery</Link>
          <Link href="/rules" className="text-muted-foreground transition-colors hover:text-foreground">Rules</Link>
          <Link href="/#feedback" className="text-muted-foreground transition-colors hover:text-foreground">Feedback</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/#join">Join Now</Link>
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
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <DiamondIcon className="h-6 w-6 text-accent" />
                  <span className="font-jokerman">McDelta SMP</span>
                </Link>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground">Features</Link>
                <Link href="/#gallery" className="text-muted-foreground hover:text-foreground">Gallery</Link>
                <Link href="/rules" className="text-muted-foreground hover:text-foreground">Rules</Link>
                <Link href="/#feedback" className="text-muted-foreground hover:text-foreground">Feedback</Link>
                <Link href="/#join" className="text-muted-foreground hover:text-foreground">Join</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
