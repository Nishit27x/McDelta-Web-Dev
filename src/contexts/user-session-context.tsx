'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SignInModal from '@/components/sign-in-modal';
import { Skeleton } from '@/components/ui/skeleton';

interface UserSession {
  gamertag: string;
  avatar: string;
  ip: string;
  createdAt: string;
  lastSeen: string;
}

interface UserSessionContextType {
  session: UserSession | null;
  isLoading: boolean;
  refetch: () => void;
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
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/session');
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setShowSignInModal(false);
      } else if (response.status === 404) {
        setShowSignInModal(true);
      } else {
        console.error('Failed to fetch user session');
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  
  const handleSignInSuccess = (newSession: UserSession) => {
    setSession(newSession);
    setShowSignInModal(false);
    setIsLoading(false);
  };

  if (isLoading) {
      return (
          <div className="w-full h-dvh flex items-center justify-center">
              <Skeleton className="w-48 h-12" />
          </div>
      )
  }

  return (
    <UserSessionContext.Provider value={{ session, isLoading, refetch: fetchSession }}>
      {showSignInModal ? (
        <SignInModal onSuccess={handleSignInSuccess} />
      ) : (
        children
      )}
    </UserSessionContext.Provider>
  );
}
