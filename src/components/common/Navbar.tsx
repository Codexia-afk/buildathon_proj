import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, Users, BarChart3, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';
import { isFirebaseConfigured } from '../../services/firebase';
import { resetDemoData } from '../../services/dataService';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [resetToast, setResetToast] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/assess', label: 'Athlete Assessment', icon: Activity, highlight: true },
    { path: '/scout', label: 'Scout Discovery Feed', icon: Users, liveBadge: true },
    { path: '/benchmarks', label: 'National Standards', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-card-border/80 bg-background/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand to-cyber flex items-center justify-center shadow-glow-brand transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 text-white fill-current" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-display font-bold tracking-wider text-white uppercase group-hover:text-brand-400 transition-colors">
                  Talent<span className="text-brand">Lens</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase bg-cyber/20 text-cyber border border-cyber/40 rounded tracking-widest">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-1">
                India Sports Talent Protocol
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-card text-white border border-brand/40 shadow-[0_0_15px_rgba(255,77,0,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-card/60 border border-transparent'
                  }`}
                >
                  {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-slate-400'}`} />}
                  <span>{link.label}</span>
                  {link.liveBadge && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions & Live Backend Status */}
          <div className="flex items-center gap-3">
            {/* Realtime Backend Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-card-border text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-cyber animate-pulse'}`} />
              <span className="text-slate-400">
                {isFirebaseConfigured ? 'Firestore Live' : 'Reactive Local Mesh'}
              </span>
            </div>

            {/* Reset / Seed Button */}
            <button
              onClick={handleReset}
              title="Reset sample scout assessments"
              className="p-2 rounded-xl bg-card border border-card-border text-slate-400 hover:text-white hover:border-slate-600 transition-colors relative"
            >
              <RotateCcw className="w-4 h-4" />
              {resetToast && (
                <span className="absolute right-0 top-12 whitespace-nowrap bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sample data restored
                </span>
              )}
            </button>

            {/* Quick CTA */}
            <Link
              to="/assess"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand to-brand-600 hover:from-brand-500 hover:to-brand text-white font-bold text-xs uppercase tracking-wider shadow-glow-brand transition-all active:scale-95"
            >
              <Activity className="w-4 h-4" />
              <span>Test Camera</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
