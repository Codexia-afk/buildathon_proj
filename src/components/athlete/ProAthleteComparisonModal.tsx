import React, { useState } from 'react';
import { AssessmentResult, ProAthleteBenchmark } from '../../types';
import { PRO_ATHLETES_DATASET, getProForSport, getProTargetScore, EXERCISE_CONFIGS } from '../../services/percentileEngine';
import { X, Award, Zap, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface ProAthleteComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentResult;
}

export const ProAthleteComparisonModal: React.FC<ProAthleteComparisonModalProps> = ({
  isOpen,
  onClose,
  assessment,
}) => {
  const [selectedPro, setSelectedPro] = useState<ProAthleteBenchmark>(() =>
    getProForSport(assessment.sport)
  );
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const proTarget = getProTargetScore(selectedPro, assessment.testType);
  const matchPct = Math.min(120, Math.round((assessment.score / Math.max(1, proTarget)) * 100));
  const gapToPro = Math.max(0, proTarget - assessment.score);
  const cfg = EXERCISE_CONFIGS[assessment.testType];

  const handleShare = () => {
    const text = `🏅 TalentLens Pro Athlete Benchmark:\nAthlete: ${assessment.athleteName} (${assessment.sport})\nScore: ${assessment.score} ${cfg.unit}\n⭐ Matched Champion: ${selectedPro.name} (${selectedPro.title})\nPro Benchmark: ${proTarget} ${cfg.unit}\nMatch Level: ${matchPct}% of Pro Standard!\nVerified via TalentLens Edge AI.`;
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-card border border-card-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-card-border">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-brand tracking-wider px-2 py-0.5 rounded bg-brand/10 border border-brand/20">
                PRO ATHLETE COMPARISON
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Head-to-Head vs Champions
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Champion Selector Carousel */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
            COMPARE AGAINST TOP-CLASS CHAMPIONS:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PRO_ATHLETES_DATASET.map((pro) => {
              const isSelected = pro.name === selectedPro.name;
              return (
                <button
                  key={pro.name}
                  onClick={() => setSelectedPro(pro)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-brand text-white border-brand shadow-[0_0_15px_rgba(255,77,0,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span>{pro.iconEmoji}</span>
                  <span>{pro.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Champion Showcase Dossier Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-card-border space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-3xl shrink-0">
              {selectedPro.iconEmoji}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white truncate">{selectedPro.name}</h3>
                <span className="text-xs font-mono font-bold text-brand-400 bg-brand/10 px-2 py-0.5 rounded border border-brand/20">
                  {selectedPro.sport}
                </span>
              </div>
              <p className="text-xs font-semibold text-cyber-400">{selectedPro.title}</p>
              <p className="text-xs text-slate-400">{selectedPro.achievement}</p>
            </div>
          </div>

          {/* Physical Archetype */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono uppercase font-bold text-brand-400 block mb-1">
              PHYSICAL ARCHETYPE
            </span>
            <p className="text-xs font-semibold text-slate-200">{selectedPro.physicalArchetype}</p>
          </div>

          {/* Head-to-Head Score Comparison Matrix */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-slate-400 pb-2 border-b border-slate-800">
              <span>EXERCISE METRIC</span>
              <div className="flex items-center gap-8">
                <span className="text-brand-400">YOU</span>
                <span className="text-cyber-400">{selectedPro.name.split(' ')[0].toUpperCase()}</span>
              </div>
            </div>

            {/* Active Drill */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{cfg.name}</span>
                <div className="flex items-center gap-8 font-mono font-bold">
                  <span className="text-brand-400 w-12 text-right">{assessment.score} {cfg.unit}</span>
                  <span className="text-cyber-400 w-12 text-right">{proTarget} {cfg.unit}</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-brand h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, matchPct)}%` }}
                />
              </div>
            </div>

            {/* Form Score */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-300">Form Precision</span>
              <div className="flex items-center gap-8 font-mono font-bold">
                <span className="text-emerald-400 w-12 text-right">{assessment.biomechanics.formScore}%</span>
                <span className="text-cyber-400 w-12 text-right">{selectedPro.formPrecisionScore}%</span>
              </div>
            </div>
          </div>

          {/* Metric Match Dial & Milestone Gap */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-4 rounded-2xl bg-card border border-card-border flex flex-col items-center justify-center w-full sm:w-36 shrink-0">
              <span className={`text-3xl font-black ${matchPct >= 90 ? 'text-emerald-400' : 'text-brand'}`}>
                {matchPct}%
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mt-0.5">
                PRO MATCH
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cyber-500/10 border border-cyber-500/30 space-y-1 flex-1 w-full">
              <span className="text-[10px] font-mono uppercase font-bold text-cyber-400 block">
                MILESTONE GAP TO CHAMPION:
              </span>
              {gapToPro === 0 ? (
                <p className="text-xs font-bold text-emerald-400">
                  🏆 Olympic Level Match Achieved! You matched {selectedPro.name}'s benchmark!
                </p>
              ) : (
                <p className="text-xs font-bold text-white">
                  +{gapToPro} {cfg.unit} needed to match {selectedPro.name}'s benchmark.
                </p>
              )}
              <p className="text-[11px] text-slate-400">
                Focus Area: <span className="text-slate-200">{selectedPro.focusArea}</span>
              </p>
            </div>
          </div>

          {/* Champion Advice Quote */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-cyber-400">
                💡 CHAMPION COACHING ADVICE
              </span>
              <span className="text-[10px] text-slate-500">— {selectedPro.name}</span>
            </div>
            <p className="text-xs italic text-slate-300">
              "{selectedPro.proAdviceQuote}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            onClick={handleShare}
            className="w-full justify-center flex items-center gap-2"
          >
            {isCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{isCopied ? 'Comparison Copied to Clipboard!' : 'Share Pro Comparison'}</span>
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Done
          </Button>
        </div>

      </div>
    </div>
  );
};
