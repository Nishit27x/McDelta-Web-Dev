
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/header';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Upload, Edit, Trash2, ShieldAlert, Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserSession, AuthWrapper } from '@/contexts/user-session-context';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SignInModal from '@/components/sign-in-modal';


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
    defaultValues: {
      tag: '',
      alt: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (file: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      fieldChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
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
        if (!response.ok) {
          throw new Error(result.error || 'Failed to upload image.');
        }

        toast({
          title: 'Success!',
          description: 'Image uploaded to the gallery.',
        });
        form.reset();
        setPreview(null);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: (error as Error).message,
        });
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
            id="imageFile"
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => handleFileChange(e, (file) => form.setValue('imageFile', file))}
            />
            {preview && (
                <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border">
                    <img src={preview} alt="Image preview" className="w-full h-full object-cover" />
                </div>
            )}
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

function AdminDashboard() {
  const { user, profile } = useUserSession();
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Case 1: User is not logged in at all.
  if (!user) {
    return (
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="mt-4">Admin Sign In</CardTitle>
            <CardDescription>
              Please sign in with your admin gamertag to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => setShowSignInModal(true)} className="w-full">
              Sign In
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
        {showSignInModal && (
          <SignInModal
            onSuccess={() => setShowSignInModal(false)}
            onCancel={() => setShowSignInModal(false)}
          />
        )}
      </main>
    );
  }

  // Case 2: User is logged in, but their profile doesn't have admin rights.
  if (!profile?.isAdmin) {
    return (
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle className="mt-4">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page. Please contact an
              administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Case 3: User is an admin. Show the dashboard.
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
              <div className="bg-primary/10 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-primary" />
              </div>
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
                <CardHeader>
                     <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit">
                        <Edit className="h-10 w-10 text-accent-foreground" />
                    </div>
                    <CardTitle className="mt-4">Edit Images</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">Modify existing image tags or details.</p>
                    <Button variant="secondary" disabled>Edit (Coming Soon)</Button>
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
                    <Button variant="destructive" disabled>Delete (Coming Soon)</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}


export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
        <AuthWrapper>
            <AdminDashboard />
        </AuthWrapper>
      <Footer />
    </div>
  );
}
