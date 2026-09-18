import React, { useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useContent();

  const handleBackToSite = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleLoginSuccess = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/admin/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!isAuthenticated) {
        if (path === '/admin' || path === '/admin/dashboard') {
          window.history.replaceState(null, '', '/admin/login');
        }
      } else {
        if (path === '/admin/login' || path === '/admin') {
          window.history.replaceState(null, '', '/admin/dashboard');
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 font-mono">
          Verifying ELEVATE Admin Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onBackToSite={handleBackToSite} onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onBackToSite={handleBackToSite} />;
};
