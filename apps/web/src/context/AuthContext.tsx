'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '../lib/api';
import { AuthUser, UserRole } from '@makaura/shared';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async (): Promise<AuthUser | null> => {
    try {
      const response = await apiRequest<{ data: AuthUser }>('/auth/me');
      if (response && response.data) {
        setUser(response.data);
        return response.data;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await apiRequest<{
        data: { user: AuthUser; accessToken: string };
      }>('/auth/login', {
        method: 'POST',
        data: { email, password },
      });

      const loggedInUser = response.data.user;
      if (response.data.accessToken && typeof window !== 'undefined') {
        sessionStorage.setItem('makaura_access_token', response.data.accessToken);
      }

      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout notification error', e);
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('makaura_access_token');
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
