
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ShieldCheck, Upload, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'delta@admin') {
      setIsAuthenticated(true);
      setError('');
      toast({
        title: 'Access Granted',
        description: 'Welcome, Administrator.',
      });
    } else {
      setError('Incorrect password. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'The password you entered is incorrect.',
      });
    }
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>
                Please enter the administrative password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex justify-between items-center pt-2">
                   <Button variant="outline" asChild>
                     <Link href="/">
                       <ArrowLeft className="mr-2 h-4 w-4" />
                       Back to Home
                     </Link>
                   </Button>
                   <Button type="submit">
                     <ShieldCheck className="mr-2 h-4 w-4" />
                     Authenticate
                   </Button>
                </div>
              </form>
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
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground mt-2">Manage your gallery images.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="mt-4">Upload Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Add new images to the public gallery.</p>
                    <Button disabled>Upload</Button>
                </CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader>
                     <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit">
                        <Edit className="h-10 w-10 text-accent-foreground" />
                    </div>
                    <CardTitle className="mt-4">Edit Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Modify existing image tags or details.</p>
                    <Button variant="secondary" disabled>Edit</Button>
                </CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                        <Trash2 className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="mt-4">Delete Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Permanently remove images from the gallery.</p>
                    <Button variant="destructive" disabled>Delete</Button>
                </CardContent>
            </Card>
        </div>
        <p className="text-center text-muted-foreground mt-12 text-sm">*Note: Image management functionality is not yet implemented.</p>
      </main>
      <Footer />
    </div>
  );
}
