'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setUser({
              _id: decoded.id,
              username: decoded.username || '',
              role: decoded.role || 'USER',
            });
          } catch (error) {
            console.error('Invalid token, clearing...', error);
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser({
        _id: decoded.id,
        username: decoded.username || '',
        role: decoded.role || 'USER',
      });

      // Redirect based on role
      switch (decoded.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'SUPERADMIN':
          router.push('/superadmin');
          break;
        default:
          router.push('/user');
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
