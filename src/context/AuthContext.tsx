// src/context/AuthContext.tsx
// Context d'authentification pour OctoBets (mock pour l'instant)

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  octoCoins: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  joinedAt: string;
  stats: {
    totalBets: number;
    wonBets: number;
    lostBets: number;
    winRate: number;
    bestWin: number;
    currentStreak: number;
    bestStreak: number;
  };
  badges: string[];
  rank: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  authModalView: 'login' | 'register' | 'forgot';
  openAuthModal: (view?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithDiscord: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCoins: (amount: number) => void;
}

// Mock user data
const mockUser: User = {
  id: 'user_123',
  username: 'OctoPlayer',
  email: 'player@octogoal.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=OctoPlayer',
  octoCoins: 1250,
  level: 7,
  xp: 2340,
  xpToNextLevel: 3000,
  joinedAt: '2024-01-15',
  stats: {
    totalBets: 47,
    wonBets: 28,
    lostBets: 19,
    winRate: 59.6,
    bestWin: 450,
    currentStreak: 3,
    bestStreak: 8
  },
  badges: ['early_adopter', 'first_win', 'streak_5', 'high_roller'],
  rank: 42
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = useCallback((view: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalView(view);
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // Mock login
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser(mockUser);
    setIsLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  // Mock Discord login
  const loginWithDiscord = useCallback(async () => {
    setIsLoading(true);
    // Simulate Discord OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUser({
      ...mockUser,
      username: 'DiscordUser',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Discord'
    });
    setIsLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  // Mock register
  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser({
      ...mockUser,
      username,
      email,
      octoCoins: 500, // Bonus inscription
      level: 1,
      xp: 0,
      stats: {
        totalBets: 0,
        wonBets: 0,
        lostBets: 0,
        winRate: 0,
        bestWin: 0,
        currentStreak: 0,
        bestStreak: 0
      },
      badges: ['early_adopter'],
      rank: 999
    });
    setIsLoading(false);
    closeAuthModal();
  }, [closeAuthModal]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateCoins = useCallback((amount: number) => {
    setUser(prev => prev ? { ...prev, octoCoins: prev.octoCoins + amount } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        showAuthModal,
        authModalView,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithDiscord,
        register,
        logout,
        updateCoins
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
