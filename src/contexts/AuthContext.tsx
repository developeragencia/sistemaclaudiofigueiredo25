import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('@secure-bridge:token');
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      api.get('/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      localStorage.setItem('@secure-bridge:token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      navigate('/dashboard');
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Email ou senha inválidos');
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('@secure-bridge:token');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
    navigate('/');
    toast.success('Logout realizado com sucesso!');
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
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
