'use client';

// context/AuthContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef
} from 'react';
import { usePathname } from 'next/navigation';
import api from '@/utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);
  const pathname = usePathname();

  // Define public routes where auth should not be checked
  const publicRoutes = ['/login', '/register'];

  const checkAuth = useCallback(async () => {
    // Don't run on public routes
    if (publicRoutes.includes(pathname) || hasCheckedAuth.current) return;

    hasCheckedAuth.current = true;
    setLoading(true);

    try {
      const { data } = await api.get('/auth/profile');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = useCallback(async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
  }, []);

// context/AuthContext.js

const login = useCallback(async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
}, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setUser(null);
  }, []);

  const contextValue = {
    user,
    loading,
    register,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
