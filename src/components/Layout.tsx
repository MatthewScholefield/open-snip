import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'auto'>('theme', 'auto');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const location = useLocation();

  const getEffectiveTheme = () => {
    if (theme === 'auto') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return theme;
  };

  const toggleTheme = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  React.useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme, prefersDarkMode]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-200 shadow-sm">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl font-bold">
            OpenSnip
          </Link>
        </div>
        
        <div className="navbar-center">
          <div className="tabs tabs-boxed">
            <Link 
              to="/" 
              className={`tab ${location.pathname === '/' ? 'tab-active' : ''}`}
            >
              Recent
            </Link>
            <Link 
              to="/create" 
              className={`tab ${location.pathname === '/create' ? 'tab-active' : ''}`}
            >
              Create
            </Link>
          </div>
        </div>

        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle" onClick={toggleTheme}>
            {theme === 'auto' ? '🔄' : theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
