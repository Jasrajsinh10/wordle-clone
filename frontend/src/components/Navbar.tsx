'use client';

import { BarChart3, Settings, HelpCircle, LogIn, User } from 'lucide-react';

interface NavbarProps {
  onOpenStats: () => void;
  onOpenAuth: () => void;
  user: any;
  onLogout: () => void;
}

export const Navbar = ({ onOpenStats, onOpenAuth, user, onLogout }: NavbarProps) => {
  return (
    <nav className="border-b border-brand-gray h-16 flex items-center justify-between px-4 sticky top-0 bg-brand-dark/80 backdrop-blur-md z-50">
      <div className="flex gap-2">
        <HelpCircle className="w-6 h-6 text-brand-gray cursor-pointer hover:text-white transition-colors" />
        <Settings className="w-6 h-6 text-brand-gray cursor-pointer hover:text-white transition-colors" />
      </div>
      
      <h1 className="text-3xl font-black tracking-widest uppercase">Wordle</h1>

      <div className="flex gap-3">
        <BarChart3 
          className="w-6 h-6 text-brand-gray cursor-pointer hover:text-white transition-colors" 
          onClick={onOpenStats}
        />
        {user ? (
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-brand-green" />
            <button 
              onClick={onLogout}
              className="text-xs uppercase font-bold text-brand-gray hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <LogIn 
            className="w-6 h-6 text-brand-gray cursor-pointer hover:text-white transition-colors" 
            onClick={onOpenAuth}
          />
        )}
      </div>
    </nav>
  );
};

