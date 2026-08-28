import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kisan_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('kisan_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('kisan_token', token);
    } else {
      localStorage.removeItem('kisan_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kisan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kisan_user');
    }
  }, [user]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { identifier, password });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const switchDemoRole = async (targetRole) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/switch-demo-role', { role: targetRole });
      if (res.success) {
        setUser(res.user);
        setToken(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('kisan_user');
    localStorage.removeItem('kisan_token');
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await api.put('/auth/profile', updateData);
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isBuyer: user?.role === 'buyer',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
