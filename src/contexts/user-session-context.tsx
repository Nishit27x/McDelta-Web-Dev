'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  gamertag: string;
  avatar: string;
  createdAt: string;
  uid: string;
  isAdmin?: boolean;
}

interface UserSessionContextType {
  user: User | null; // The raw Firebase Auth user
  profile: UserProfile | null; // Your app-specific user profile
  isLoading: boolean;
  logout: () => Promise<void>;
}

const UserSessionContext = createContext<UserSessionContextType | null>(null);

export function useUserSession() {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error('useUserSession must be used within a UserSessionProvider');
  }
  return context;
}

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until auth state is known

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/session');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setProfile(null);
    }
  }, []);

  const logout = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      await auth.signOut();
    } catch (error) {
      console.error('Failed to log out', error);
    } finally {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setIsLoading(true);
      setUser(authUser);
      if (authUser) {
        await fetchUserProfile();
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);
  
  // This handles session sync across tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && auth?.currentUser) {
        auth.currentUser?.getIdToken(true); // Force token refresh
        fetchUserProfile();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchUserProfile]);


  return (
    <UserSessionContext.Provider value={{ user, profile, isLoading, logout }}>
      {children}
    </UserSessionContext.Provider>
  );
}

// A wrapper to show a loading skeleton while the session is being determined.
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUserSession();

  if (isLoading) {
    return (
       <div className="container mx-auto px-4 py-16">
         <div className="space-y-4 pt-4">
             <Skeleton className="h-28 w-full rounded-xl" />
             <Skeleton className="h-28 w-full rounded-xl" />
             <Skeleton className="h-28 w-full rounded-xl" />
         </div>
       </div>
    )
  }

  return <>{children}</>;
}
