import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DonorAvailability } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  quickLoginAs: (role: 'donor' | 'admin' | 'requester') => Promise<void>;
  updateDonorAvailability: (availability: DonorAvailability) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bloodconnect_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('bloodconnect_token');
      if (storedToken) {
        try {
          const res = await api.getCurrentUser();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid', err);
          localStorage.removeItem('bloodconnect_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('bloodconnect_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; role?: string; phone?: string }) => {
    const res = await api.registerUser(data);
    localStorage.setItem('bloodconnect_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('bloodconnect_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.getCurrentUser();
      setUser(res.user);
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const quickLoginAs = async (role: 'donor' | 'admin' | 'requester') => {
    if (role === 'admin') {
      await login('admin@bloodconnect.org', 'admin123');
    } else if (role === 'donor') {
      await login('rahul.sharma@example.com', 'donor123');
    } else {
      await login('priya.verma@example.com', 'request123');
    }
  };

  const updateDonorAvailability = async (availability: DonorAvailability) => {
    if (!user || !user.donorProfileId) return;
    await api.updateDonor(user.donorProfileId, { availability });
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        quickLoginAs,
        updateDonorAvailability,
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
