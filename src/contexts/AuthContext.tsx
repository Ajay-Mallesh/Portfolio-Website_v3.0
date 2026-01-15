import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as bcrypt from 'bcryptjs';

interface AuthContextProps {
  user: any;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

interface AdminUser {
  id: number;
  email: string;
  role: string;
  password_hash: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if admin is already logged in (stored in localStorage)
        const storedAdmin = localStorage.getItem('admin_user');
        if (storedAdmin) {
          const admin = JSON.parse(storedAdmin);
          console.log('Restoring admin from localStorage:', admin);
          setUser(admin);
          setRole(admin.role);
        }
      } catch (error) {
        console.error('Error getting stored auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Query admin table for user with matching email
      const { data: adminUsers, error: queryError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email);

      if (queryError || !adminUsers || adminUsers.length === 0) {
        setLoading(false);
        return { error: 'Invalid email or password' };
      }

      const adminUser = adminUsers[0] as AdminUser;

      // Verify password using bcrypt comparison
      const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);

      if (!passwordMatch) {
        setLoading(false);
        return { error: 'Invalid email or password' };
      }

      // Login successful - store user info
      const userData = {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      };

      localStorage.setItem('admin_user', JSON.stringify(userData));
      setUser(userData);
      setRole(adminUser.role);
      console.log('Login successful! Role set to:', adminUser.role);
      setLoading(false);

      return { error: null };
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error);
      return { error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('admin_user');
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  const value: AuthContextProps = {
    user,
    role,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

