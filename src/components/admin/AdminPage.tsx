import React from 'react';
import { useContent } from '../../context/ContentContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useContent();

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
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};
