import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

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
