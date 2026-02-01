import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance,Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: 'light' | 'dark';
  fontSize: number;
  toggleTheme: (mode: ThemeMode) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  currentTheme: 'light',
  fontSize: 18,
  toggleTheme: async () => {},
  setFontSize: async () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [fontSize, setFontSize] = useState<number>(Platform.OS === 'android' ? 14 : 18);

  // Load all preferences on startup
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [savedTheme, savedFontSize] = await Promise.all([
          AsyncStorage.getItem('appTheme'),
          AsyncStorage.getItem('appFontSize')
        ]);

        // Set theme mode
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
        }

        // Set font size
        if (savedFontSize) {
          const size = parseInt(savedFontSize, 10);
          if (!isNaN(size) && size >= 14 && size <= 24) {
            setFontSize(size);
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  const toggleTheme = async (mode: ThemeMode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('appTheme', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleSetFontSize = async (size: number) => {
    try {
      if (size >= 14 && size <= 24) { // Enforce size limits
        setFontSize(size);
        await AsyncStorage.setItem('appFontSize', size.toString());
      }
    } catch (error) {
      console.error('Error saving font size preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      themeMode,
      currentTheme: themeMode === 'system' ? Appearance.getColorScheme() || 'light' : themeMode,
      fontSize,
      toggleTheme,
      setFontSize: handleSetFontSize,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);