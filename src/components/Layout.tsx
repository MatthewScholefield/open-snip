import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};