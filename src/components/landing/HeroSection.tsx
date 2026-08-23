import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Zap, ShieldCheck, ArrowRight, Play, Sparkles, Trophy, Award } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-brand/10 to-cyber/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Eyebrow Tag */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand/40 shadow-glow-brand backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brand animate-spin" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              Democratizing Indian Sports Scouting with Edge AI
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white uppercase leading-[0.95]">
            Discover Talent,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-amber-300">
              Wherever It's Hiding.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Record physical fitness tests with any smartphone or webcam. Real-time client-side AI pose estimation scores biomechanics, benchmarks national percentiles, and streams verified results live to sports scouts across India.
          </p>

          {/* TWO PRIMARY DUAL ENTRY POINTS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 max-w-xl mx-auto">
            
            {/* Athlete Entry Point */}
            <Link to="/assess" className="w-full sm:w-1/2">
              <Button
                variant="primary"
                size="xl"
                className="w-full h-16 group"
                leftIcon={<Activity className="w-5 h-5 transition-transform group-hover:scale-110" />}
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              >
                I'm an Athlete
              </Button>
            </Link>

            {/* Coach/Scout Entry Point */}
            <Link to="/scout" className="w-full sm:w-1/2">
              <Button
                variant="secondary"
                size="xl"
                className="w-full h-16 group"
                leftIcon={<Users className="w-5 h-5 text-slate-950 transition-transform group-hover:scale-110" />}
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              >
                I'm a Coach / Scout
              </Button>
            </Link>

          </div>

          <p className="text-xs font-mono text-slate-400 pt-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            No special sensors or hardware required • 100% In-browser edge compute
          </p>
        </div>

        {/* Live Sports Preview Card Visual */}
        <div className="mt-14 max-w-5xl mx-auto relative rounded-3xl border-2 border-card-border bg-slate-950 p-2 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          
          <div className="aspect-video sm:aspect-[21/9] w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Top HUD Mock */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  MediaPipe Pose Landmark Tracking: ACTIVE
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Joint Angle: 84° (Target Reached ✓)
              </span>
            </div>

            {/* Center Dynamic Graphic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto z-10">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-card-border backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 uppercase">AI Reps Counted</span>
                <div className="text-4xl font-display font-extrabold text-white mt-1">
                  42 <span className="text-sm font-sans text-brand font-bold">REPS</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-brand/40 shadow-glow-brand backdrop-blur-md">
                <span className="text-[10px] font-mono text-brand-300 uppercase">National Benchmark</span>
                <div className="text-4xl font-display font-extrabold text-white mt-1">
                  96.5 <span className="text-sm font-sans text-brand font-bold">%ile</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-card-border backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Talent Rating</span>
                <div className="text-base font-bold text-amber-400 mt-2">
                  National Elite Prospect
                </div>
              </div>
            </div>

            {/* Bottom Stream Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10 pt-2 border-t border-slate-800">
              <span>Athlete: Vikas Phogat (17y, Haryana)</span>
              <span className="text-cyber">Live Synced to Scout Dashboard 🟢</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
