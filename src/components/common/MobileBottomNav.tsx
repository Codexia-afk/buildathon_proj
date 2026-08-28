import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, Users, BarChart3, ShieldCheck } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/assess', label: 'Workout Lab', icon: Activity, isPrimary: true },
    { path: '/scout', label: 'Scout Feed', icon: Users, hasLiveDot: true },
    { path: '/benchmarks', label: 'Standards', icon: BarChart3 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-card-border/80 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-brand-600 via-brand to-cyber shadow-glow-brand' 
                    : 'bg-gradient-to-tr from-brand via-brand-600 to-brand-700'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-brand' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-brand' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : 'text-slate-400'}`} />
                {item.hasLiveDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${
                isActive ? 'font-bold text-white' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
