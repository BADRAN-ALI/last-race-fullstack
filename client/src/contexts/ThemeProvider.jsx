




import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext.js';


function initialTheme() {
  try {
    return localStorage.getItem('lr-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    try {
      localStorage.setItem('lr-theme', theme);
    } catch {
      void 0;
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`lr-app lr-theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}
