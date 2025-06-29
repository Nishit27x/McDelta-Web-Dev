
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Upload, Edit, Trash2, ShieldAlert, Loader2, LogIn, KeyRound, Lock, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


// --- Backend-Connected Image Upload Form ---
// This component remains unchanged and relies on a secure Firebase session for uploads.
const imageUploadSchema = z.object({
  tag: z.string().min(1, 'Tag is required.'),
  alt: z.string().min(1, 'Description/Alt text is required.'),
  imageFile: z.instanceof(File).refine((file) => file.size > 0, 'An image is required.'),
});

function ImageUploadForm() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof imageUploadSchema>>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: { tag: '', alt: '' },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (file: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      fieldChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof imageUploadSchema>) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(values.imageFile);
    reader.onload = async () => {
      const base64Image = reader.result as string;
      try {
        const response = await fetch('/api/gallery/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, image: base64Image }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to upload image. Are you signed in as an admin?');
        toast({ title: 'Success!', description: 'Image uploaded to the gallery.' });
        form.reset();
        setPreview(null);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Upload Failed', description: (error as Error).message });
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
        toast({ variant: 'destructive', title: 'Error reading file' });
        setIsUploading(false);
    };
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="imageFile">Image File</Label>
            <Input
            id="imageFile" type="file" accept="image/png, image/jpeg, image/gif"
            onChange={(e) => handleFileChange(e, (file) => form.setValue('imageFile', file))} />
            {preview && <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border"><img src={preview} alt="Image preview" className="w-full h-full object-cover" /></div>}
            {form.formState.errors.imageFile && <p className="text-sm text-destructive">{form.formState.errors.imageFile.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Input id="tag" placeholder="e.g., Player Build" {...form.register('tag')} />
            {form.formState.errors.tag && <p className="text-sm text-destructive">{form.formState.errors.tag.message}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="alt">Description / Alt Text</Label>
            <Textarea id="alt" placeholder="A brief description of the image" {...form.register('alt')} />
            {form.formState.errors.alt && <p className="text-sm text-destructive">{form.formState.errors.alt.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload to Gallery'}
        </Button>
    </form>
  );
}


// --- PatternLock Component ---
function PatternLock({ onPatternComplete, onClear }: { onPatternComplete: (pattern: number[]) => void; onClear: () => void; }) {
  const [path, setPath] = useState<number[]>([]);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getDotCenter = useCallback((index: number) => {
    if (containerRef.current && dotRefs.current[index]) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const dotRect = dotRefs.current[index]!.getBoundingClientRect();
      return {
        x: dotRect.left - containerRect.left + dotRect.width / 2,
        y: dotRect.top - containerRect.top + dotRect.height / 2,
      };
    }
    return { x: 0, y: 0 };
  }, []);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    onClear();
    setPath([index]);
    setLines([]);
    setIsDrawing(true);
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const currentPos = 'touches' in e ? { x: e.touches[0].clientX - containerRect.left, y: e.touches[0].clientY - containerRect.top } : { x: e.clientX - containerRect.left, y: e.clientY - containerRect.top };
    setMousePos(currentPos);

    dotRefs.current.forEach((dot, index) => {
      if (dot && !path.includes(index)) {
        const { x, y } = getDotCenter(index);
        const distance = Math.sqrt(Math.pow(currentPos.x - x, 2) + Math.pow(currentPos.y - y, 2));
        if (distance < 15) {
          setPath(prevPath => [...prevPath, index]);
        }
      }
    });
  };

  const handleInteractionEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onPatternComplete(path);
  };

  useEffect(() => {
    const newLines = [];
    for (let i = 0; i < path.length - 1; i++) {
      const start = getDotCenter(path[i]);
      const end = getDotCenter(path[i + 1]);
      newLines.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y });
    }
    setLines(newLines);
  }, [path, getDotCenter]);

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-3 gap-6 p-4 bg-muted/30 rounded-lg cursor-pointer touch-none"
      onMouseMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd} onMouseLeave={handleInteractionEnd}
      onTouchMove={handleInteractionMove} onTouchEnd={handleInteractionEnd}
    >
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {lines.map((line, i) => (
          <line key={i} {...line} stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
        ))}
        {isDrawing && path.length > 0 && (
          <line
            x1={getDotCenter(path[path.length - 1]).x} y1={getDotCenter(path[path.length - 1]).y}
            x2={mousePos.x} y2={mousePos.y}
            stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,5"
          />
        )}
      </svg>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          ref={el => dotRefs.current[i] = el}
          className="relative flex items-center justify-center w-8 h-8"
          onMouseDown={(e) => handleInteractionStart(e, i)}
          onTouchStart={(e) => handleInteractionStart(e, i)}
        >
          <div className={cn("absolute w-6 h-6 bg-border rounded-full transition-colors", { "bg-primary/50": path.includes(i) })}></div>
          <div className={cn("absolute w-3 h-3 bg-foreground/50 rounded-full transition-colors", { "bg-primary": path.includes(i) })}></div>
        </div>
      ))}
    </div>
  );
}


// --- Admin Login Flow ---
function AdminAuthFlow() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pattern, setPattern] = useState<number[]>([]);
  const [patternKey, setPatternKey] = useState(() => Date.now());
  const [error, setError] = useState('');

  const correctPattern = [0, 2, 8, 6];

  const handlePatternComplete = (completedPath: number[]) => {
    setPattern(completedPath);
  };
  
  const clearPattern = () => {
      setPattern([]);
  }

  const handleResetPattern = () => {
    setPattern([]);
    setPatternKey(Date.now());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isUsernameCorrect = username === 'ADMINDELTA';
    const isPasswordCorrect = password === 'delta@admin';
    const isPatternCorrect = JSON.stringify(pattern) === JSON.stringify(correctPattern);

    if (isUsernameCorrect && isPasswordCorrect && isPatternCorrect) {
      setIsAuthenticated(true);
    } else {
        let errorMsg = 'Invalid credentials. ';
        if (!isUsernameCorrect) errorMsg += 'Check username. ';
        if (!isPasswordCorrect) errorMsg += 'Check password. ';
        if (!isPatternCorrect) errorMsg += 'Check pattern. ';
      setError(errorMsg.trim());
      handleResetPattern();
    }
  };

  if (isAuthenticated) {
    return (
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">Manage your gallery images.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full"><Upload className="h-6 w-6 text-primary" /></div>
                <div>
                  <CardTitle>Upload New Image</CardTitle>
                  <CardDescription>Add a new image to the public gallery.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ImageUploadForm />
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="text-center">
              <CardHeader><div className="mx-auto bg-accent/20 p-4 rounded-full w-fit"><Edit className="h-10 w-10 text-accent-foreground" /></div><CardTitle className="mt-4">Edit Images</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">Modify tags or details.</p><Button variant="secondary" disabled>Edit (Coming Soon)</Button></CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader><div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit"><Trash2 className="h-10 w-10 text-destructive" /></div><CardTitle className="mt-4">Delete Images</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground mb-4">Permanently remove images.</p><Button variant="destructive" disabled>Delete (Coming Soon)</Button></CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit"><ShieldAlert className="h-10 w-10 text-primary" /></div>
          <CardTitle className="mt-4">Administrative Access</CardTitle>
          <CardDescription>Enter your credentials to manage the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username"><KeyRound className="inline-block mr-2 h-4 w-4" />Username</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password"><Lock className="inline-block mr-2 h-4 w-4" />Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <Label><Shuffle className="inline-block mr-2 h-4 w-4" />Security Pattern</Label>
                 <Button type="button" variant="ghost" size="sm" onClick={handleResetPattern}>
                    Reset
                 </Button>
              </div>
              <PatternLock key={patternKey} onPatternComplete={handlePatternComplete} onClear={clearPattern} />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            {error ? (
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            ) : (
                <Button type="submit" className="w-full"><LogIn className="mr-2 h-4 w-4" />Authenticate</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

// --- Main Page Component ---
export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <AdminAuthFlow />
      <Footer />
    </div>
  );
}
