import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isLoggingIn = useRef(false);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Only fetch user if we don't already have user data and we're not in the middle of logging in
      if (!user && !isLoggingIn.current) {
        fetchUser();
      } else if (user) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    isLoggingIn.current = true;
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success && response.data.token && response.data.user) {
        const { token: newToken, user: userData } = response.data;
        
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userData);
        setLoading(false); // Set loading to false immediately after login
        isLoggingIn.current = false;
        
        return { success: true };
      } else {
        setLoading(false);
        isLoggingIn.current = false;
        return {
          success: false,
          message: 'Invalid response from server'
        };
      }
    } catch (error) {
      setLoading(false);
      isLoggingIn.current = false;
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    isLoggingIn.current = true;
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(newUser);
      setLoading(false); // Set loading to false immediately after registration
      isLoggingIn.current = false;
      
      return { success: true };
    } catch (error) {
      setLoading(false);
      isLoggingIn.current = false;
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAlumni: user?.role === 'alumni',
    isStudent: user?.role === 'student'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

