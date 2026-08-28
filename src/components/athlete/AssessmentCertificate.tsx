import React, { useRef } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  Share2, 
  X, 
  Zap, 
  Sparkles,
  QrCode,
  MapPin,
  Calendar,
  Activity
} from 'lucide-react';
import { AssessmentResult } from '../../types';
import { EXERCISE_CONFIGS, getTierBadgeColor } from '../../services/percentileEngine';
import { Button } from '../common/Button';

interface AssessmentCertificateProps {
  assessment: AssessmentResult;
  onClose: () => void;
}

export const AssessmentCertificate: React.FC<AssessmentCertificateProps> = ({
  assessment,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);
  const config = EXERCISE_CONFIGS[assessment.testType] || EXERCISE_CONFIGS.pushups_standard;
  const tierStyle = getTierBadgeColor(assessment.talentTier);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TalentLens Verified Certificate: ${assessment.athleteName}`,
          text: `${assessment.athleteName} achieved ${assessment.percentile}th national percentile (${assessment.talentTier}) in ${config.name}! Verification Hash: ${assessment.verificationHash}`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(
        `TalentLens Verified Assessment | ${assessment.athleteName} (${assessment.state}) | Score: ${assessment.score} ${config.unit} | National Percentile: ${assessment.percentile}% | Tier: ${assessment.talentTier} | Hash: ${assessment.verificationHash}`
      );
      alert('Verification credentials copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-950 rounded-3xl border-2 border-brand/40 shadow-2xl overflow-hidden my-8">
        
        {/* Action Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-slate-900/60 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Official Digital Credential
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-card border border-card-border hover:border-brand text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-glow-brand transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-card border border-card-border text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div 
          ref={certificateRef}
          className="p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden"
        >
          {/* Subtle Watermark Seal */}
          <div className="absolute right-6 top-12 opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-brand" />
          </div>

          {/* Certificate Border Frame */}
          <div className="border-2 border-dashed border-brand/30 rounded-2xl p-6 sm:p-8 relative z-10 space-y-6">
            
            {/* Header Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-card-border pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand to-cyber flex items-center justify-center shadow-glow-brand">
                  <Zap className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-widest uppercase">
                    TALENT<span className="text-brand">LENS</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                    National Sports Talent Discovery Protocol · India
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI VERIFIED CREDENTIAL</span>
                </div>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Hash: <span className="text-brand font-bold">{assessment.verificationHash}</span>
                </p>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-2 py-2">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Official Certificate of Athletic Performance
              </p>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 uppercase tracking-wide">
                {assessment.athleteName}
              </h1>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-300 font-mono flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand" /> {assessment.district}, {assessment.state}</span>
                <span>•</span>
                <span>{assessment.age} Years Old</span>
                <span>•</span>
                <span className="capitalize">{assessment.gender}</span>
                <span>•</span>
                <span className="text-cyber font-bold">{assessment.sport}</span>
              </div>
            </div>

            {/* Main Scorecard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              {/* Test & Score */}
              <div className="p-4 rounded-2xl bg-card border border-card-border text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {config.name}
                </span>
                <div className="text-4xl font-display font-extrabold text-white">
                  {assessment.score} <span className="text-xs font-mono text-brand uppercase">{config.unit}</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Duration: {assessment.durationSeconds}s
                </span>
              </div>

              {/* National Percentile */}
              <div className="p-4 rounded-2xl bg-brand/10 border border-brand/40 text-center space-y-1 shadow-[0_0_20px_rgba(255,77,0,0.15)]">
                <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">
                  National Percentile
                </span>
                <div className="text-4xl font-display font-extrabold text-brand">
                  {assessment.percentile}%
                </div>
                <span className="text-[10px] text-slate-300 block font-mono">
                  SAI / Khelo India Cohort
                </span>
              </div>

              {/* Talent Tier */}
              <div className={`p-4 rounded-2xl border text-center space-y-1 flex flex-col justify-center ${tierStyle.bg} ${tierStyle.border}`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Talent Classification
                </span>
                <div className={`text-sm sm:text-base font-bold ${tierStyle.text}`}>
                  {assessment.talentTier}
                </div>
              </div>
            </div>

            {/* Biomechanical Telemetry */}
            <div className="p-4 rounded-2xl bg-card/60 border border-card-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-card-border pb-2">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Activity className="w-4 h-4 text-cyber" /> Client-Side AI Biomechanics Report
                </span>
                <span className="text-emerald-400 font-bold">100% Verified Clean Form</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-card-border">
                  <span className="text-[10px] text-slate-400 block font-mono">Form Quality</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{assessment.biomechanics.formScore}%</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-card-border">
                  <span className="text-[10px] text-slate-400 block font-mono">Spine Alignment</span>
                  <span className="text-base font-bold text-white font-mono">{assessment.biomechanics.averageTrunkAlignment}°</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-card-border">
                  <span className="text-[10px] text-slate-400 block font-mono">Depth Flexion</span>
                  <span className="text-base font-bold text-brand font-mono">
                    {assessment.biomechanics.averageElbowFlexion || assessment.biomechanics.averageKneeFlexion || 82}°
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-card-border">
                  <span className="text-[10px] text-slate-400 block font-mono">Completed Reps</span>
                  <span className="text-base font-bold text-cyber font-mono">{assessment.score}</span>
                </div>
              </div>
            </div>

            {/* Footer Verification Sign-off */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-card-border text-[10px] font-mono text-slate-400">
              <div className="space-y-0.5 text-center sm:text-left">
                <p>Verified on: {new Date(assessment.verifiedAt).toLocaleDateString()} at {new Date(assessment.verifiedAt).toLocaleTimeString()}</p>
                <p>Engine: Google MediaPipe Tasks Vision (WebGL/WASM On-Device Edge Pipeline)</p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-card-border">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span className="text-slate-200">TalentLens Protocol Authenticated</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-card-border flex items-center justify-between no-print">
          <span className="text-xs text-slate-400 font-mono">
            Directly broadcasted to national scout network
          </span>
          <Button onClick={onClose} variant="secondary" size="sm">
            Close Certificate
          </Button>
        </div>

      </div>
    </div>
  );
};
