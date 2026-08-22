import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('xelonUser'));
  } catch (_error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('xelonToken')));

  const persistSession = useCallback((session) => {
    localStorage.setItem('xelonToken', session.token);
    localStorage.setItem('xelonUser', JSON.stringify(session.user));
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (payload) => {
      const session = await authService.login(payload);
      persistSession(session);
      return session.user;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const session = await authService.register(payload);
      persistSession(session);
      return session.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('xelonToken');
    localStorage.removeItem('xelonUser');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('xelonToken');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getMe();
      localStorage.setItem('xelonUser', JSON.stringify(profile));
      setUser(profile);
    } catch (_error) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile
    }),
    [loading, login, logout, refreshProfile, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
