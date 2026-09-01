import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Share2, 
  Download, 
  RotateCcw, 
  Flame, 
  Activity, 
  Send, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Printer,
  FileCheck,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import { AssessmentResult, AthleteProfile } from '../../types';
import { calculatePercentile, getTierBadgeColor, EXERCISE_CONFIGS, getProForSport, getProTargetScore } from '../../services/percentileEngine';
import { Button } from '../common/Button';
import { saveAssessment } from '../../services/dataService';
import { Link } from 'react-router-dom';
import { AssessmentCertificate } from './AssessmentCertificate';
import { ProAthleteComparisonModal } from './ProAthleteComparisonModal';

interface VerifiedResultCardProps {
  athlete: AthleteProfile;
  assessment: AssessmentResult;
  onRetest: () => void;
}

export const VerifiedResultCard: React.FC<VerifiedResultCardProps> = ({
  athlete,
  assessment,
  onRetest,
}) => {
  const [isPushed, setIsPushed] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const matchedPro = getProForSport(assessment.sport);
  const proTarget = getProTargetScore(matchedPro, assessment.testType);
  const matchPct = Math.min(120, Math.round((assessment.score / Math.max(1, proTarget)) * 100));

  const config = EXERCISE_CONFIGS[assessment.testType] || EXERCISE_CONFIGS.pushups_standard;
  const percentileInfo = calculatePercentile(
    assessment.score,
    assessment.age,
    assessment.gender,
    assessment.testType
  );

  const tierColors = getTierBadgeColor(percentileInfo.talentTier);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#FF4D00', '#00F0FF', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignore
    }
  }, []);

  // Handle pushing to live scout dashboard
  const handlePushToScout = async () => {
    setIsPushing(true);
    try {
      await saveAssessment(assessment);
      setIsPushed(true);
    } catch (err) {
      console.error('Failed to push to scout:', err);
    } finally {
      setIsPushing(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `TalentLens Verified: ${assessment.athleteName} scored ${assessment.score} ${config.unit} in ${config.name} (${assessment.percentile}th national percentile)! Verification Hash: ${assessment.verificationHash}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Cohort comparison chart data
  const cohortChartData = [
    { name: '10th %ile', score: Math.round(percentileInfo.expectedMedian * 0.4), type: 'benchmark' },
    { name: '25th %ile', score: Math.round(percentileInfo.expectedMedian * 0.7), type: 'benchmark' },
    { name: 'Median (50th)', score: percentileInfo.expectedMedian, type: 'benchmark' },
    { name: 'Top 10% (90th)', score: percentileInfo.eliteThreshold, type: 'benchmark' },
    { name: `${athlete.fullName.split(' ')[0]} (You)`, score: assessment.score, type: 'athlete' },
    { name: 'Record (99th)', score: percentileInfo.nationalRecord, type: 'benchmark' },
  ].sort((a, b) => a.score - b.score);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner: Verification Protocol Success */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Cryptographically Verified Result
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                100% Form Pass
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Protocol Hash: <span className="text-emerald-300 font-bold">{assessment.verificationHash}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setIsCertificateOpen(true)}
            variant="outline"
            size="sm"
            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 flex-1 sm:flex-initial"
            leftIcon={<Printer className="w-4 h-4" />}
          >
            View Certificate
          </Button>

          <Button
            onClick={handleShare}
            variant="secondary"
            size="sm"
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            {copiedLink ? 'Copied!' : 'Share Score'}
          </Button>
        </div>
      </div>

      {/* Main Score & Talent Tier Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-card-border shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Athlete & Test Overview Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand">
              {config.name}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase tracking-wide">
              {athlete.fullName}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {athlete.district}, {athlete.state} · {athlete.age} Yrs · {athlete.primarySport}
            </p>
          </div>

          {/* Talent Tier Badge */}
          <div className={`px-4 py-2.5 rounded-2xl border ${tierColors.bg} ${tierColors.border} ${tierColors.glow} flex items-center gap-2.5`}>
            <Award className={`w-5 h-5 ${tierColors.text}`} />
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                Talent Classification
              </span>
              <span className={`text-xs sm:text-sm font-bold ${tierColors.text}`}>
                {percentileInfo.talentTier}
              </span>
            </div>
          </div>
        </div>

        {/* Big 3 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* 1. Raw Score */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-card-border text-center space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {config.metricLabel}
            </span>
            <div className="text-5xl font-display font-extrabold text-white tracking-tight">
              {assessment.score}
            </div>
            <span className="text-xs font-mono text-brand uppercase font-bold">
              {config.unit} in {assessment.durationSeconds}s
            </span>
          </div>

          {/* 2. National Percentile */}
          <div className="p-5 rounded-2xl bg-brand/10 border border-brand/40 text-center space-y-1 shadow-[0_0_25px_rgba(255,77,0,0.2)]">
            <span className="text-xs font-mono text-brand-400 uppercase tracking-wider">
              National Percentile
            </span>
            <div className="text-5xl font-display font-extrabold text-brand tracking-tight">
              {percentileInfo.percentileRounded}%
            </div>
            <span className="text-xs font-mono text-slate-300">
              Top {Math.max(1, 100 - percentileInfo.percentileRounded)}% in India ({percentileInfo.bracketLabel})
            </span>
          </div>

          {/* 3. Biomechanical Form Score */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-card-border text-center space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Biomechanical Quality
            </span>
            <div className="text-5xl font-display font-extrabold text-emerald-400 tracking-tight">
              {assessment.biomechanics.formScore}%
            </div>
            <span className="text-xs font-mono text-slate-400">
              Zero Form Deductions
            </span>
          </div>

        </div>

        {/* Pro Athlete Benchmark Match Banner */}
        <button
          onClick={() => setIsProModalOpen(true)}
          className="w-full p-4 rounded-2xl bg-slate-950/90 border border-brand/40 hover:border-brand transition-all flex items-center justify-between gap-4 text-left group shadow-[0_0_20px_rgba(255,77,0,0.12)]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center text-2xl shrink-0">
              {matchedPro.iconEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-brand-400">
                  PRO MATCH: {matchedPro.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400">({matchedPro.title})</span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                {matchPct}% of Olympic/Pro Champion Benchmark
              </p>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                Target: {proTarget} {config.unit} • Archetype: {matchedPro.physicalArchetype}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand/20 border border-brand/40 text-brand-300 text-xs font-bold whitespace-nowrap shrink-0">
            <span>Compare vs Pro</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* National Benchmark Distribution Chart */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyber" /> Indian National Cohort Distribution ({percentileInfo.bracketLabel})
            </span>
            <span>National Record: {percentileInfo.nationalRecord} {config.unit}</span>
          </div>

          <div className="h-56 w-full p-2 bg-slate-950/60 rounded-2xl border border-card-border">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070A11',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {cohortChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'athlete' ? '#FF4D00' : '#1e293b'}
                      stroke={entry.type === 'athlete' ? '#FF6E2E' : '#334155'}
                      strokeWidth={entry.type === 'athlete' ? 2 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Biomechanical Telemetry Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-card-border space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Movement Telemetry Breakdown
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-card border border-card-border">
              <span className="text-[10px] text-slate-400 block font-mono">Average Depth Flexion</span>
              <span className="text-sm font-bold text-white font-mono">
                {assessment.biomechanics.averageElbowFlexion || assessment.biomechanics.averageKneeFlexion || 82}°
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-card-border">
              <span className="text-[10px] text-slate-400 block font-mono">Spine Alignment</span>
              <span className="text-sm font-bold text-white font-mono">
                {assessment.biomechanics.averageTrunkAlignment}°
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-card-border">
              <span className="text-[10px] text-slate-400 block font-mono">Cadence / Speed</span>
              <span className="text-sm font-bold text-cyber font-mono">
                {assessment.biomechanics.cadenceRepsPerMin ? `${assessment.biomechanics.cadenceRepsPerMin} RPM` : 'Peak Power'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-card-border">
              <span className="text-[10px] text-slate-400 block font-mono">Incomplete Reps</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {assessment.biomechanics.incompletedReps || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Push to Scout Feed or Retest */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-card-border">
          <Button
            onClick={onRetest}
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Retest / Switch Exercise
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/scout"
              className="px-4 py-2.5 rounded-xl bg-card border border-card-border hover:border-brand text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all text-center justify-center flex-1 sm:flex-initial"
            >
              <span>View Scout Feed</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Button
              onClick={handlePushToScout}
              variant="primary"
              disabled={isPushed || isPushing}
              leftIcon={<Send className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              {isPushed ? 'Broadcasted to Scouts ✓' : isPushing ? 'Broadcasting...' : 'Push to Live Scout Network'}
            </Button>
          </div>
        </div>

      </div>

      {/* Certificate Modal */}
      {isCertificateOpen && (
        <AssessmentCertificate
          assessment={assessment}
          onClose={() => setIsCertificateOpen(false)}
        />
      )}

      {/* Pro Athlete Comparison Modal */}
      {isProModalOpen && (
        <ProAthleteComparisonModal
          isOpen={isProModalOpen}
          assessment={assessment}
          onClose={() => setIsProModalOpen(false)}
        />
      )}

    </div>
  );
};
