
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Construction, ArrowLeft, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hashes a string using the SHA-256 algorithm.
async function sha256(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


// Helper component for the pattern lock UI
const PatternLock = ({ onComplete, resetKey }: { onComplete: (pattern: number[]) => void, resetKey: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dots, setDots] = useState<{ x: number, y: number, index: number }[]>([]);
  const [lines, setLines] = useState<{ start: { x: number, y: number }, end: { x: number, y: number } }[]>([]);

  useEffect(() => {
    // Reset state when resetKey changes
    setPattern([]);
    setIsDrawing(false);
    setLines([]);
    const canvas = canvasRef.current;
    if (canvas && dots.length > 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        draw(ctx);
      }
    }
  }, [resetKey]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Draw lines
    lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 4;
      ctx.stroke();
    });
    // Draw dots
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
      const isSelected = pattern.includes(dot.index);
      ctx.fillStyle = isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
      ctx.fill();
      if(isSelected) {
         ctx.beginPath();
         ctx.arc(dot.x, dot.y, 25, 0, Math.PI * 2);
         ctx.strokeStyle = 'hsl(var(--primary) / 0.3)';
         ctx.lineWidth = 2;
         ctx.stroke();
      }
    });
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
        const size = canvas.offsetWidth;
        canvas.width = size;
        canvas.height = size;

        const newDots = [];
        const padding = size * 0.2;
        const spacing = (size - padding * 2) / 2;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            newDots.push({
              x: padding + j * spacing,
              y: padding + i * spacing,
              index: i * 3 + j
            });
          }
        }
        setDots(newDots);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);

  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dots.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    draw(ctx);
  }, [lines, dots, pattern]);


  const getDotFromCoordinates = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    return dots.find(dot => Math.sqrt((dot.x - relativeX) ** 2 + (dot.y - relativeY) ** 2) < 25);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = 'touches' in e ? e.touches[0] : e;
    const dot = getDotFromCoordinates(coords.clientX, coords.clientY);
    if (dot) {
      setIsDrawing(true);
      setPattern([dot.index]);
      setLines([]);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = 'touches' in e ? e.touches[0] : e;
    const dot = getDotFromCoordinates(coords.clientX, coords.clientY);
    if (dot && !pattern.includes(dot.index)) {
      const lastDotIndex = pattern[pattern.length - 1];
      const lastDot = dots.find(d => d.index === lastDotIndex);
      if (lastDot) {
        setLines(prev => [...prev, { start: lastDot, end: dot }]);
        setPattern(prev => [...prev, dot.index]);
      }
    }
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onComplete(pattern);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[300px] aspect-square mx-auto cursor-pointer touch-none bg-muted rounded-lg"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};


export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [resetKey, setResetKey] = useState(0);

  const [view, setView] = useState<'login' | 'success' | 'error'>('login');
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const correctUsername = 'ADMINDELTA';
    // Password is 'adminpass'
    const correctPasswordHash = '99201e4760920414167502e604313f8983939632835154541755106228302063';
    // Pattern is ']' -> [2, 5, 8]
    const correctPatternHash = '86b63080c57c50614539564858d405333e69671194396b77207c4b694b2a818c';

    const passwordHash = await sha256(password);
    const patternHash = await sha256(JSON.stringify(pattern));

    if (
        username.toUpperCase() === correctUsername &&
        passwordHash === correctPasswordHash &&
        patternHash === correctPatternHash
    ) {
      setView('success');
      toast({ title: 'Access Granted', description: 'Welcome, Admin!' });
    } else {
      setView('error');
    }
  };
  
  const handlePatternComplete = (completedPattern: number[]) => {
    setPattern(completedPattern);
  };
  
  const handlePatternReset = () => {
    setPattern([]);
    setResetKey(prev => prev + 1);
  };
  
  const handleTryAgain = () => {
    handlePatternReset();
    setUsername('');
    setPassword('');
    setView('login');
  }

  if (view === 'success') {
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
                The admin dashboard is currently under construction. Please check back soon!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md text-center border-destructive">
            <CardHeader>
              <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                <ShieldAlert className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="mt-4 text-destructive">Access Denied</CardTitle>
              <CardDescription>
                The credentials you entered are incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
               <Button onClick={handleTryAgain} variant="default" className="w-full">
                  Try Again
               </Button>
               <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Please enter your administrative credentials to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Security Pattern</Label>
                <PatternLock onComplete={handlePatternComplete} resetKey={resetKey} />
              </div>
              <div className="flex justify-between items-center gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handlePatternReset}>Reset Pattern</Button>
                <Button type="submit">Sign In</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
