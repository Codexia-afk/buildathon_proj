import React, { useEffect, useState, useRef } from 'react';
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
  TrendingUp
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
import { calculatePercentile, getTierBadgeColor } from '../../services/percentileEngine';
import { Button } from '../common/Button';
import { saveAssessment } from '../../services/dataService';
import { Link } from 'react-router-dom';

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
  const cardRef = useRef<HTMLDivElement>(null);

  const percentileInfo = calculatePercentile(
    assessment.repsCount,
    assessment.age,
    assessment.gender
  );

  const tierColors = getTierBadgeColor(percentileInfo.talentTier);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
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
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Cohort comparison chart data
  const cohortChartData = [
    { name: '10th %ile', reps: Math.round(percentileInfo.expectedMedian * 0.4), type: 'benchmark' },
    { name: '25th %ile', reps: Math.round(percentileInfo.expectedMedian * 0.7), type: 'benchmark' },
    { name: 'Median (50th)', reps: percentileInfo.expectedMedian, type: 'benchmark' },
    { name: 'Top 10% (90th)', reps: percentileInfo.eliteThreshold, type: 'benchmark' },
    { name: `${athlete.fullName.split(' ')[0]} (Score)`, reps: assessment.repsCount, type: 'athlete' },
    { name: 'Record (99th)', reps: percentileInfo.nationalRecord, type: 'benchmark' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Certificate / Verified Card Container */}
      <div 
        ref={cardRef}
        className="relative bg-gradient-to-b from-card to-slate-950 border-2 border-card-border rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden"
      >
        {/* Glow Accent Ambient Highlights */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-brand-600 flex items-center justify-center shadow-glow-brand">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Biometric Verified
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs font-mono text-slate-400">
                  {new Date(assessment.verifiedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide uppercase">
                TalentLens Verified Assessment
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-mono text-slate-500 block uppercase">Protocol Hash</span>
            <span className="font-mono text-xs text-cyber bg-slate-900 px-2.5 py-1 rounded-lg border border-card-border">
              {assessment.verificationHash}
            </span>
          </div>
        </div>

        {/* Athlete Info & Main Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8 items-center">
          
          {/* Athlete Profile Highlight */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Athlete</span>
              <h3 className="text-2xl font-bold text-white mt-0.5">{athlete.fullName}</h3>
              <p className="text-sm text-slate-300">
                {athlete.age} yrs • {athlete.gender === 'female' ? 'Female' : 'Male'} • {athlete.state} ({athlete.district})
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-card-border/60">
                <span>Primary Sport:</span>
                <span className="font-semibold text-white">{athlete.primarySport}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-card-border/60">
                <span>Cohort Division:</span>
                <span className="font-semibold text-white">{percentileInfo.bracketLabel}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Academy / School:</span>
                <span className="font-semibold text-slate-300">{athlete.schoolOrAcademy || 'Grassroots Athlete'}</span>
              </div>
            </div>

            {/* Talent Tier Badge */}
            <div className={`p-3 rounded-2xl border ${tierColors.bg} ${tierColors.border} ${tierColors.glow}`}>
              <div className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${tierColors.text}`} />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                    Talent Rating Tier
                  </span>
                  <span className={`text-xs font-bold ${tierColors.text}`}>
                    {percentileInfo.talentTier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Percentile & Score Dial */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BIG PERCENTILE CARD */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-brand/40 shadow-glow-brand flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="w-28 h-28 text-brand" />
              </div>
              
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-300 font-bold">
                  National Standing
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-6xl sm:text-7xl font-display font-extrabold text-white tracking-tight">
                    {percentileInfo.percentileRounded}
                  </span>
                  <span className="text-2xl font-display font-bold text-brand">%ile</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed font-medium">
                {percentileInfo.cohortComparisonText}
              </p>
            </div>

            {/* REPS & BIOMECHANICS SUMMARY */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-card-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyber font-bold">
                  Test Performance
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-6xl sm:text-7xl font-display font-extrabold text-white tracking-tight">
                    {assessment.repsCount}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">
                    CLEAN REPS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-card-border text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <span className="text-sm font-mono font-bold text-white">{assessment.durationSeconds}s</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Cadence</span>
                  <span className="text-sm font-mono font-bold text-white">{assessment.biomechanics.cadenceRepsPerMin} RPM</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Form Score</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{assessment.biomechanics.formScore}%</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Cohort Comparison Bar Chart */}
        <div className="mt-8 pt-6 border-t border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyber" /> National Benchmark Distribution
              </h4>
              <p className="text-xs text-slate-400">
                Comparing against standard push-up rep brackets for {percentileInfo.bracketLabel} ({athlete.gender})
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-slate-700 inline-block" /> National Average
              </span>
              <span className="flex items-center gap-1 text-brand-300 font-bold">
                <span className="w-2.5 h-2.5 rounded bg-brand inline-block" /> Athlete Score
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <ReferenceLine y={percentileInfo.eliteThreshold} stroke="#00F0FF" strokeDasharray="3 3" label={{ value: 'Elite (90th)', fill: '#00F0FF', fontSize: 10 }} />
                <Bar dataKey="reps" radius={[6, 6, 0, 0]}>
                  {cohortChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'athlete' ? '#FF4D00' : '#334155'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Action Footer & Direct Push to Scout Feed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-card-border shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePushToScout}
            disabled={isPushed}
            isLoading={isPushing}
            variant="primary"
            size="lg"
            leftIcon={isPushed ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <Send className="w-5 h-5" />}
          >
            {isPushed ? '✓ Broadcasted to Scout Dashboard Live' : 'Push to Live Scout Network'}
          </Button>

          <Button
            onClick={onRetest}
            variant="outline"
            size="lg"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Retest
          </Button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            onClick={handleShare}
            variant="ghost"
            size="md"
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            {copiedLink ? 'Link Copied!' : 'Share'}
          </Button>

          <Link to="/scout">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View on Scout Dashboard
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
