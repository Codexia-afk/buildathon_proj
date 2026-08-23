import React from 'react';
import { ShieldCheck, Zap, Award, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-card-border bg-slate-950/90 text-slate-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand" />
              <span className="text-lg font-display font-bold uppercase tracking-wider text-white">
                Talent<span className="text-brand">Lens</span> India
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Democratizing sports talent discovery across India. Bringing Olympic-grade computer vision biometric assessment directly to grassroots athletes in every district and village via any standard mobile or laptop camera.
            </p>
            <div className="flex items-center gap-4 pt-2 text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> SAI Khelo India Aligned
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyber" /> Client-Side AI (Privacy First)
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/assess" className="hover:text-white transition-colors">Athlete Camera Assessment</Link>
              </li>
              <li>
                <Link to="/scout" className="hover:text-white transition-colors">Scout & Coach Dashboard</Link>
              </li>
              <li>
                <Link to="/benchmarks" className="hover:text-white transition-colors">Push-Up Percentile Standards</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
              Roadmap (V2)
            </h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>• Multi-Angle Video Tamper Verification</li>
              <li>• Regional Voice Guidance (Hindi, Tamil, Marathi)</li>
              <li>• Vertical Jump & Shuttle Run Tests</li>
              <li>• Offline Mesh SMS Sync</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-card-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} TalentLens. Built for Indian grassroots sports revolution.</p>
          <div className="flex items-center gap-2">
            <span>Powered by MediaPipe & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
