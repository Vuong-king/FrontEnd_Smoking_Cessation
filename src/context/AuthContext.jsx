// src/contexts/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleSuccessfulAuth = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        handleSuccessfulAuth(response.data.user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const resonse = await api.post('/auth/register', { email, password });

      if (resonse.data) {
        await login(email, password);
      } else {
        throw new Error('Register failed');
      }
    } catch (error) {
      console.log('Register error:', error);
      const message = error.resonse?.data?.message || error.message || 'Registration failed';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');

      await api.post('/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      navigate('/');
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null);
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      console.error('Forgot password error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUser,
        login,
        register,
        logout,
        forgotPassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loading,
        error,
        isAuthenticated: () => !!user,
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
