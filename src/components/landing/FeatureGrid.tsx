import React from 'react';
import { 
  Camera, 
  BarChart3, 
  Radio, 
  Award, 
  ShieldCheck, 
  Smartphone,
  Cpu,
  TrendingUp,
  Search
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      title: 'In-Browser MediaPipe Pose AI',
      description: 'Zero video uploaded to servers. 33 body keypoints tracked locally at 30+ FPS directly in the browser via WebAssembly and WebGL.',
      tag: 'Edge Compute',
      color: 'border-brand/40 text-brand bg-brand/10',
    },
    {
      icon: ShieldCheck,
      title: 'Biomechanical Angle Counting',
      description: 'Strict 90° elbow flexion and neutral plank angle checks verify genuine repetitions and prevent rep padding or cheating.',
      tag: 'Verified Protocol',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      icon: BarChart3,
      title: 'Indian National Percentiles',
      description: 'Instant mathematical interpolation against Khelo India / SAI physical benchmark data across age (10-30+) and gender cohorts.',
      tag: 'Standardized',
      color: 'border-cyber/40 text-cyber bg-cyber/10',
    },
    {
      icon: Radio,
      title: 'Live Scout Discovery Stream',
      description: 'Real-time Firestore sync pushes athlete assessments straight to scout dashboards across India without page refreshes.',
      tag: 'Realtime WebSocket',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      icon: Smartphone,
      title: 'Zero Hardware Barrier',
      description: 'Runs on any basic Android smartphone, budget laptop, or tablet. Empowering athletes in remote villages without sports testing labs.',
      tag: 'Grassroots Reach',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Growth Trajectory Analytics',
      description: 'Scouts track historical progression, cadence, and form evolution across multi-month training blocks with Recharts analytics.',
      tag: 'Coach Tools',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-brand font-bold">
          The Two-Sided Platform Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
          Empowering Athletes • Empowering Scouts
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          From rural akharas to elite state academies, TalentLens replaces expensive physical testing equipment with intelligent computer vision.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-card border border-card-border hover:border-slate-600 transition-all duration-200 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-card-border text-slate-400">
                    {f.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{f.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
