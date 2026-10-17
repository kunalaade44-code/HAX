import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pip-theme') || 'day';
  });

  const [chaosMode, setChaosMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pip-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (chaosMode) {
      document.body.classList.add('chaos-mode-active');
    } else {
      document.body.classList.remove('chaos-mode-active');
    }
  }, [chaosMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const toggleChaosMode = () => {
    setChaosMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, chaosMode, toggleChaosMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
