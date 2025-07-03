'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SignInModal from '@/components/sign-in-modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserSession } from '@/contexts/user-session-context';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserNav() {
  const { isLoading, profile, logout } = useUserSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLoginSuccess = () => {
    setShowSignInModal(false);
    setShowAccessDialog(true);
  };
  
  const handleAccessPanel = () => {
    setShowAccessDialog(false);
    router.push('/admin');
  };

  const handleLogout = async () => {
    await logout();
    toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
    });
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-36 rounded-md" />;
  }

  // If a user is already signed in AND is an admin, give them direct access and a sign out button.
  if (profile && profile.isAdmin) {
    return (
        <div className="flex items-center gap-2">
            <Button onClick={() => router.push('/admin')} className="font-bold border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:text-purple-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-400/40 transition-all">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
            </Button>
            <Button onClick={handleLogout} variant="outline" size="icon" aria-label="Sign Out">
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
  }
  
  // If any other user is logged in (non-admin), or no one is logged in, show the admin login button.
  return (
    <>
      <Button 
        onClick={() => setShowSignInModal(true)} 
        variant="outline"
        className="font-bold border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-400/40 transition-all"
      >
        ADMIN
      </Button>

      {showSignInModal && (
        <SignInModal 
          onSuccess={handleLoginSuccess}
          onCancel={() => setShowSignInModal(false)}
        />
      )}

      <AlertDialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Granted</AlertDialogTitle>
            <AlertDialogDescription>
              You may now proceed to the administrative panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAccessPanel}>
              Access Admin Panel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
