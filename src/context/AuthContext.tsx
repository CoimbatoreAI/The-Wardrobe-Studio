import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ needsVerification?: boolean; message?: string }>;
  acceptSession: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api<{ user: User }>('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const acceptSession = (token: string, u: User) => {
    setToken(token);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const d = await api<{ token: string; user: User }>('/auth/login', { body: { email, password } });
    acceptSession(d.token, d.user);
    return d.user;
  };

  const register: AuthContextType['register'] = async (data) => {
    const d = await api<any>('/auth/register', { body: data });
    if (d.token) acceptSession(d.token, d.user);
    return d;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, acceptSession, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
