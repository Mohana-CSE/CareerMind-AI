import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  FileText, 
  Target, 
  GitCompare, 
  Award, 
  Map, 
  Briefcase, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'target-role', label: 'Target Role', icon: Target },
    { id: 'skill-gap', label: 'Skill Gap', icon: GitCompare },
    { id: 'readiness', label: 'Readiness Score', icon: Award },
    { id: 'roadmap', label: 'Adaptive Roadmap', icon: Map },
    { id: 'jobs', label: 'Job Matches', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  CareerMind
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Skill Gap & Adaptive Roadmap</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-3 bg-slate-800/70 hover:bg-slate-800 cursor-pointer border border-slate-700/60 py-1 px-3 rounded-full transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs text-slate-300 font-medium max-w-[110px] truncate">
                  {user?.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">{user?.name}</span>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
