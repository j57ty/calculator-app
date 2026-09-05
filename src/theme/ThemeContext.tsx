import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types/calculator';
import { colors, ThemeColors } from './colors';

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@calculator_theme_preference';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: colors.dark,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          setThemeState(saved);
        }
      } catch {
        // Fallback to dark
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore
    }
  };

  const currentColors = colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors: currentColors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
