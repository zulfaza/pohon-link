'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context with default values to avoid the "must be used within a Provider" error
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light');
  // Set up theme when component mounts
  useEffect(() => {
    // Function to update the DOM based on theme
    const updateTheme = (newTheme: Theme) => {
      setTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    try {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem('theme') as Theme | null;

      if (savedTheme === 'dark' || savedTheme === 'light') {
        updateTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        updateTheme(prefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';

      // Update state and DOM
      setTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save to localStorage
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
