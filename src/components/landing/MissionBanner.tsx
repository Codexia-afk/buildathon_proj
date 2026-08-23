import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Shield, ArrowRight, Activity, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

export const MissionBanner: React.FC = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-brand-900/40 via-card to-slate-900 border-2 border-brand/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
        
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand" /> Grassroots Sports Revolution
            </span>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase leading-tight">
              Bridging the Talent Gap Across Bharat
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              India has millions of naturally gifted athletes in rural villages and small towns who never get spotted by scouts simply because physical trials only happen in tier-1 metro stadiums. TalentLens turns every smartphone into a certified SAI-grade fitness trial testing ground.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-card-border">
                <span className="text-2xl font-display font-bold text-white">28+</span>
                <p className="text-[10px] text-slate-400 uppercase font-mono">States & UTs Covered</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-card-border">
                <span className="text-2xl font-display font-bold text-cyber">100%</span>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Private In-Browser AI</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-card-border">
                <span className="text-2xl font-display font-bold text-emerald-400">0s</span>
                <p className="text-[10px] text-slate-400 uppercase font-mono">Scout Sync Latency</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            <Link to="/assess">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Activity className="w-5 h-5" />}
              >
                Start Camera Assessment
              </Button>
            </Link>

            <Link to="/benchmarks">
              <Button
                variant="outline"
                size="md"
                className="w-full"
              >
                Inspect National Percentiles
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
