
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('sessionId');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        setSession(parsedSession);

        if (parsedSession.userId) {
          setUserId(parsedSession.userId);
        }
      }
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (sessionData) => {
    try {
      await AsyncStorage.setItem('sessionId', JSON.stringify(sessionData));
      setSession(sessionData);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('sessionId');
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
