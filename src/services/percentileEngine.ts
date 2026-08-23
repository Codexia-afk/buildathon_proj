import benchmarkDataRaw from '../data/benchmarks.json';
import { BenchmarkDistribution, Gender, TalentTier } from '../types';

const benchmarkData = benchmarkDataRaw as BenchmarkDistribution;

export interface PercentileResult {
  percentile: number; // e.g. 88.4
  percentileRounded: number; // e.g. 88
  talentTier: TalentTier;
  bracketLabel: string;
  expectedMedian: number;
  eliteThreshold: number; // 90th percentile mark
  nationalRecord: number;
  repsToNextTier: number;
  cohortComparisonText: string;
}

export function calculatePercentile(
  reps: number,
  age: number,
  gender: Gender
): PercentileResult {
  const safeGender = gender === 'female' ? 'female' : 'male';
  
  // Locate age bracket
  const bracket = benchmarkData.brackets.find(
    (b) => age >= b.minAge && age <= b.maxAge
  ) || benchmarkData.brackets[benchmarkData.brackets.length - 1];

  const stats = bracket[safeGender];
  
  // Percentile anchors
  const points = [
    { p: 0, reps: 0 },
    { p: 10, reps: stats.p10 },
    { p: 25, reps: stats.p25 },
    { p: 50, reps: stats.p50 },
    { p: 75, reps: stats.p75 },
    { p: 90, reps: stats.p90 },
    { p: 95, reps: stats.p95 },
    { p: 99, reps: stats.p99 },
    { p: 100, reps: stats.nationalRecord },
  ];

  let rawPercentile = 0;

  if (reps <= 0) {
    rawPercentile = 1.0;
  } else if (reps >= stats.nationalRecord) {
    rawPercentile = 99.9;
  } else {
    // Piecewise linear interpolation between percentile anchors
    for (let i = 0; i < points.length - 1; i++) {
      const lower = points[i];
      const upper = points[i + 1];

      if (reps >= lower.reps && reps <= upper.reps) {
        const ratio = (reps - lower.reps) / Math.max(1, upper.reps - lower.reps);
        rawPercentile = lower.p + ratio * (upper.p - lower.p);
        break;
      }
    }
  }

  // Bound percentile
  const clampedPercentile = Math.max(1, Math.min(99.9, Number(rawPercentile.toFixed(1))));
  const rounded = Math.round(clampedPercentile);

  // Determine Talent Tier
  let talentTier: TalentTier = 'Developing Talent (Base Tier)';
  let repsToNextTier = Math.max(1, stats.p25 - reps);

  if (clampedPercentile >= 95) {
    talentTier = 'National Elite Prospect (Top 5%)';
    repsToNextTier = Math.max(0, stats.p99 - reps);
  } else if (clampedPercentile >= 85) {
    talentTier = 'State Level Contender (Top 15%)';
    repsToNextTier = Math.max(1, stats.p95 - reps);
  } else if (clampedPercentile >= 70) {
    talentTier = 'District High Performer (Top 30%)';
    repsToNextTier = Math.max(1, stats.p90 - reps);
  } else if (clampedPercentile >= 45) {
    talentTier = 'Active Club Athlete (Top 50%)';
    repsToNextTier = Math.max(1, stats.p75 - reps);
  }

  const genderLabel = safeGender === 'male' ? 'Male' : 'Female';
  const cohortComparisonText = `Outperforms ${rounded}% of ${genderLabel} athletes across India in the ${bracket.label} division`;

  return {
    percentile: clampedPercentile,
    percentileRounded: rounded,
    talentTier,
    bracketLabel: bracket.label,
    expectedMedian: stats.p50,
    eliteThreshold: stats.p90,
    nationalRecord: stats.nationalRecord,
    repsToNextTier,
    cohortComparisonText,
  };
}

export function getTierBadgeColor(tier: TalentTier): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (tier) {
    case 'National Elite Prospect (Top 5%)':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      };
    case 'State Level Contender (Top 15%)':
      return {
        bg: 'bg-brand-500/15',
        text: 'text-brand-400',
        border: 'border-brand-500/40',
        glow: 'shadow-[0_0_15px_rgba(255,77,0,0.3)]',
      };
    case 'District High Performer (Top 30%)':
      return {
        bg: 'bg-cyber-500/15',
        text: 'text-cyber-400',
        border: 'border-cyber-500/40',
        glow: 'shadow-[0_0_15px_rgba(0,240,255,0.25)]',
      };
    case 'Active Club Athlete (Top 50%)':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
      };
    default:
      return {
        bg: 'bg-slate-500/15',
        text: 'text-slate-300',
        border: 'border-slate-600/40',
        glow: 'shadow-none',
      };
  }
}
