import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import api from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  googleId?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.user);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', {
        emailOrPhone,
        password
      });

      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Login successful!');
    } catch {
      toast.error('Login failed');
      throw new Error('Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      toast.success('Registration successful!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};