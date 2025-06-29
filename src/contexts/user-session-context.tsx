'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/session');
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Network error while fetching user session:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <UserSessionContext.Provider value={{ session, isLoading, refetch: fetchSession }}>
      {children}
    </UserSessionContext.Provider>
  );
}
