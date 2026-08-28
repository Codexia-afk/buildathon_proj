import benchmarkDataRaw from '../data/benchmarks.json';
import { BenchmarkDistribution, Gender, TalentTier, TestType, ExerciseConfig } from '../types';

export const EXERCISE_CONFIGS: Record<TestType, ExerciseConfig> = {
  pushups_standard: {
    id: 'pushups_standard',
    name: 'Standard Push-Ups',
    shortName: 'Push-Ups',
    category: 'Upper Body',
    iconName: 'Activity',
    metricLabel: 'Reps Completed',
    unit: 'reps',
    description: 'Measures upper body muscular endurance and core stability.',
    standardDurationSec: 60,
    instructions: [
      'Position camera sideways with full body in view.',
      'Maintain a rigid straight plank line (155°-185°).',
      'Lower chest until elbows bend to 90° or deeper.',
      'Push up to full arm lockout (>155°) to count each rep.'
    ]
  },
  squats_standard: {
    id: 'squats_standard',
    name: 'Deep Bodyweight Squats',
    shortName: 'Squats',
    category: 'Lower Body',
    iconName: 'Flame',
    metricLabel: 'Reps Completed',
    unit: 'reps',
    description: 'Assesses lower body quadriceps, hamstring, and glute power.',
    standardDurationSec: 60,
    instructions: [
      'Stand facing 45° or side to the camera.',
      'Feet shoulder-width apart, arms held forward or crossed.',
      'Descend until hip crease is below knee level (knee angle <= 90°).',
      'Stand fully upright with hips extended (>160°) for clean count.'
    ]
  },
  plank_hold: {
    id: 'plank_hold',
    name: 'Forearm Plank Hold',
    shortName: 'Plank',
    category: 'Core',
    iconName: 'ShieldCheck',
    metricLabel: 'Hold Duration',
    unit: 'sec',
    description: 'Measures deep core isometric endurance and spinal stability.',
    standardDurationSec: 120,
    instructions: [
      'Assume a solid forearm plank position with body in profile.',
      'Keep shoulders, hips, and ankles in a straight line.',
      'Avoid sagging hips (<145°) or lifting hips high (>200°).',
      'Hold the posture as long as possible until failure.'
    ]
  },
  vertical_jump: {
    id: 'vertical_jump',
    name: 'Vertical Jump Power',
    shortName: 'Vert Jump',
    category: 'Power',
    iconName: 'Zap',
    metricLabel: 'Max Jump Height',
    unit: 'cm',
    description: 'Evaluates explosive leg power and fast-twitch muscle recruitment.',
    standardDurationSec: 30,
    instructions: [
      'Stand 6-8 feet away in clear camera view.',
      'Assume standing position, perform countermovement dip.',
      'Explode upwards with maximum power.',
      'AI calculates flight hang time and vertical jump height in cm.'
    ]
  }
};

export interface PercentileResult {
  testId: TestType;
  testName: string;
  unit: string;
  score: number;
  percentile: number; // e.g. 88.4
  percentileRounded: number; // e.g. 88
  talentTier: TalentTier;
  bracketLabel: string;
  expectedMedian: number;
  eliteThreshold: number; // 90th percentile mark
  nationalRecord: number;
  scoreToNextTier: number;
  cohortComparisonText: string;
}

export function calculatePercentile(
  score: number,
  age: number,
  gender: Gender,
  testType: TestType = 'pushups_standard'
): PercentileResult {
  const safeGender = gender === 'female' ? 'female' : 'male';
  const testDist = (benchmarkDataRaw.tests as Record<string, BenchmarkDistribution>)[testType] || benchmarkDataRaw.tests.pushups_standard;
  const config = EXERCISE_CONFIGS[testType] || EXERCISE_CONFIGS.pushups_standard;
  
  // Locate age bracket
  const bracket = testDist.brackets.find(
    (b) => age >= b.minAge && age <= b.maxAge
  ) || testDist.brackets[testDist.brackets.length - 1];

  const stats = bracket[safeGender];
  
  // Percentile anchors
  const points = [
    { p: 0, val: 0 },
    { p: 10, val: stats.p10 },
    { p: 25, val: stats.p25 },
    { p: 50, val: stats.p50 },
    { p: 75, val: stats.p75 },
    { p: 90, val: stats.p90 },
    { p: 95, val: stats.p95 },
    { p: 99, val: stats.p99 },
    { p: 100, val: stats.nationalRecord },
  ];

  let rawPercentile = 0;

  if (score <= 0) {
    rawPercentile = 1.0;
  } else if (score >= stats.nationalRecord) {
    rawPercentile = 99.9;
  } else {
    // Piecewise linear interpolation between percentile anchors
    for (let i = 0; i < points.length - 1; i++) {
      const lower = points[i];
      const upper = points[i + 1];

      if (score >= lower.val && score <= upper.val) {
        const ratio = (score - lower.val) / Math.max(0.1, upper.val - lower.val);
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
  let scoreToNextTier = Math.max(1, Math.round(stats.p25 - score));

  if (clampedPercentile >= 95) {
    talentTier = 'National Elite Prospect (Top 5%)';
    scoreToNextTier = Math.max(0, Math.round(stats.p99 - score));
  } else if (clampedPercentile >= 85) {
    talentTier = 'State Level Contender (Top 15%)';
    scoreToNextTier = Math.max(1, Math.round(stats.p95 - score));
  } else if (clampedPercentile >= 70) {
    talentTier = 'District High Performer (Top 30%)';
    scoreToNextTier = Math.max(1, Math.round(stats.p90 - score));
  } else if (clampedPercentile >= 45) {
    talentTier = 'Active Club Athlete (Top 50%)';
    scoreToNextTier = Math.max(1, Math.round(stats.p75 - score));
  }

  const genderLabel = safeGender === 'male' ? 'Male' : 'Female';
  const cohortComparisonText = `Outperforms ${rounded}% of ${genderLabel} athletes across India in the ${bracket.label} division (${config.name})`;

  return {
    testId: testType,
    testName: config.name,
    unit: config.unit,
    score,
    percentile: clampedPercentile,
    percentileRounded: rounded,
    talentTier,
    bracketLabel: bracket.label,
    expectedMedian: stats.p50,
    eliteThreshold: stats.p90,
    nationalRecord: stats.nationalRecord,
    scoreToNextTier,
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
