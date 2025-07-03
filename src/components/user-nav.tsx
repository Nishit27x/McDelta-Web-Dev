
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUserSession } from '@/contexts/user-session-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import SignInModal from '@/components/sign-in-modal';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserNav() {
  const { profile, logout, isLoading } = useUserSession();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
    });
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-24 rounded-md" />;
  }

  if (!profile) {
    return (
      <>
        <Button onClick={() => setShowSignInModal(true)} variant="outline">Sign In</Button>
        {showSignInModal && (
          <SignInModal 
            onSuccess={() => setShowSignInModal(false)}
            onCancel={() => setShowSignInModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile.avatar} alt={profile.gamertag} />
            <AvatarFallback>{profile.gamertag.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.gamertag}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.isAdmin ? 'Administrator' : 'Player'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profile.isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Console</span>
              </Link>
            </DropdownMenuItem>
          )}
           <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Profile (soon)</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
