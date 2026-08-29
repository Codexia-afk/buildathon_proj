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

import { SportType, SportTrainingProfile } from '../types';

export const SPORT_TRAINING_DATABASE: Record<string, SportTrainingProfile> = {
  'Cricket': {
    sport: 'Cricket',
    iconEmoji: '🏏',
    tagline: 'Fast Bowling Stride Force, Anti-Rotational Core & Batting Drive',
    primaryQuality: 'Rotational Trunk Stability & Explosive Ground Reaction',
    recommendedDrills: [
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Explosive run-up plant & jump takeoff velocity for fast bowlers & batting stride extension',
        biomechanicalFocus: 'Hang-time & maximal vertical elastic rebound',
        gymTargetScore: 'Target: >55 cm (Elite Fast Bowler)',
        importanceTier: 'Primary Bowling Power Test'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Anti-rotational core stabilization to protect lumbar spine during high-impact delivery stride',
        biomechanicalFocus: 'Neutral spine alignment without hip rotation',
        gymTargetScore: 'Target: >150 sec (Lumbar Protection)',
        importanceTier: 'Core Injury-Shielding Drill'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Lower-body power drive for wicket-keeping crouch, running between wickets & batting stance',
        biomechanicalFocus: 'Parallel knee depth with upright chest',
        gymTargetScore: 'Target: >45 reps / min',
        importanceTier: 'Leg Endurance & Wicket Stance'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Pectoral, triceps and shoulder girdle endurance for fast outfield boundary throwing',
        biomechanicalFocus: '90° elbow flexion with locked core',
        gymTargetScore: 'Target: >40 reps',
        importanceTier: 'Throwing Arm Conditioning'
      }
    ],
    gymCoachingTip: 'Fast bowlers experience 8-10x bodyweight on delivery stride. Keep your plank straight to eliminate spine energy leaks.'
  },
  'Wrestling': {
    sport: 'Wrestling',
    iconEmoji: '🤼',
    tagline: 'Mat Hand-Fighting, Takedown Explosiveness & Core Gut-Wrench Defense',
    primaryQuality: 'Isometric Core Bracing & Explosive Leg Attack Drive',
    recommendedDrills: [
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Ironclad isometric core bracing to defend against gut-wrench rolls & maintain mat parterre posture',
        biomechanicalFocus: 'Maximal abdominal tension & straight hip line',
        gymTargetScore: 'Target: >180 sec (National Akhada Standard)',
        importanceTier: 'Mat Defense & Bridge Anchor'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Deep hip flexion power for low-level single/double-leg attack shots & sprawl recoveries',
        biomechanicalFocus: 'Deep sub-90° knee angle with explosive hip extension',
        gymTargetScore: 'Target: >55 reps',
        importanceTier: 'Takedown Shot Engine'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Upper body explosive pushing power for hand-fighting, collar ties & snapping down opponents',
        biomechanicalFocus: 'Strict arm lockout to simulate underhook breaks',
        gymTargetScore: 'Target: >50 reps',
        importanceTier: 'Hand-Fighting & Chest Power'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Instantaneous rate of force development for explosive re-attacks and mat lifting power',
        biomechanicalFocus: 'Maximum takeoff acceleration',
        gymTargetScore: 'Target: >58 cm',
        importanceTier: 'Explosive Lift Power'
      }
    ],
    gymCoachingTip: 'Focus on crisp arm lockout during push-ups to simulate breaking opponents\' underhooks on the mat.'
  },
  'Football': {
    sport: 'Football',
    iconEmoji: '⚽',
    tagline: 'Sprint Acceleration, Aerial Header Duels & 90-Min Physical Resilience',
    primaryQuality: 'Explosive Aerial Hang-Time & Lower-Body Deceleration',
    recommendedDrills: [
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Crucial for aerial header duels, set pieces & explosive first-step sprint acceleration',
        biomechanicalFocus: 'Triple-extension takeoff and hang-time',
        gymTargetScore: 'Target: >60 cm (Wing/Forward Standard)',
        importanceTier: 'Aerial Combat & Sprint Speed'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Builds hamstring/quadriceps strength for rapid deceleration, cutting & shot power',
        biomechanicalFocus: 'Controlled eccentric descent with explosive upward drive',
        gymTargetScore: 'Target: >50 reps',
        importanceTier: 'Cutting & Knee Stability'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Shielding torso stability during shoulder-to-shoulder physical challenges on the pitch',
        biomechanicalFocus: 'Rock-solid core under fatigue',
        gymTargetScore: 'Target: >140 sec',
        importanceTier: 'Physical Shielding Strength'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Upper body balance and arm pump propulsion during high-speed breakaways',
        biomechanicalFocus: '90° elbow depth with steady rhythm',
        gymTargetScore: 'Target: >35 reps',
        importanceTier: 'Sprint Arm Pump Drive'
      }
    ],
    gymCoachingTip: 'Maximize knee flexion in squats to strengthen knee stabilizing ligaments (ACL/MCL) against sudden turf cuts.'
  },
  'Kabaddi': {
    sport: 'Kabaddi',
    iconEmoji: '🤾',
    tagline: 'Raider Toe-Touch Spring, Corner Ankle Holds & Multi-Defender Resistance',
    primaryQuality: 'Explosive Lateral Spring & Kinetic Chain Defense',
    recommendedDrills: [
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Rapid level change for defender tackle dives and raider sudden bonus-line lunges',
        biomechanicalFocus: 'Deep knee bend and instant rebound',
        gymTargetScore: 'Target: >55 reps',
        importanceTier: 'Bonus Line Lunge Engine'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Explosive leaping over defender chain tackles (frog jump / lion jump evasions)',
        biomechanicalFocus: 'Max vertical apex height',
        gymTargetScore: 'Target: >62 cm (Pro Kabaddi Raider Standard)',
        importanceTier: 'Chain Evasion Leaping'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Maintaining cantilever core tension when resisting multi-defender chain tackle pulls',
        biomechanicalFocus: 'Anti-piking rigid spine alignment',
        gymTargetScore: 'Target: >160 sec',
        importanceTier: 'Midline Drag Resistance'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Upper body hand thrust for hand touches and defender pushing duels',
        biomechanicalFocus: 'Explosive chest push-off',
        gymTargetScore: 'Target: >45 reps',
        importanceTier: 'Raider Hand-Touch Power'
      }
    ],
    gymCoachingTip: 'Train full-depth squats to ensure rapid hip rebound when executing sudden escapes back across the midline.'
  },
  'Badminton': {
    sport: 'Badminton',
    iconEmoji: '🏸',
    tagline: 'Jump Smash Apex Power, Court Lunge Recovery & Rotational Stability',
    primaryQuality: 'Peak Vertical Hang-Time & Rapid Footwork Recovery',
    recommendedDrills: [
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Dominating the rear-court with steep jump smashes and high contact point apex reach',
        biomechanicalFocus: 'Flight hang-time for kinetic wind-up',
        gymTargetScore: 'Target: >62 cm (Top 5% National Shuttler)',
        importanceTier: 'Rear-Court Jump Smash'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Extreme single-leg deceleration in front-court lunges and rapid base recovery',
        biomechanicalFocus: 'Deep hip mobility and ankle dorsiflexion',
        gymTargetScore: 'Target: >48 reps',
        importanceTier: 'Front-Court Lunge Recovery'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Core anti-rotation to stabilize torso during high-velocity overhead slice/smash rotations',
        biomechanicalFocus: 'Solid torso bracing without spine twisting',
        gymTargetScore: 'Target: >130 sec',
        importanceTier: 'Overhead Smash Stability'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Shoulder girdle stability to prevent rotator cuff overuse injuries during match play',
        biomechanicalFocus: 'Controlled tempo with full range',
        gymTargetScore: 'Target: >35 reps',
        importanceTier: 'Rotator Cuff Injury Shield'
      }
    ],
    gymCoachingTip: 'Aim for maximum hang-time in vertical jumps to give your racket kinetic chain full wind-up time at the apex.'
  },
  'Boxing': {
    sport: 'Boxing',
    iconEmoji: '🥊',
    tagline: 'Kinetic Chain Punch Drive, Torso Shielding & 12-Round Shoulder Stamina',
    primaryQuality: 'Upper Body Muscular Endurance & Trunk Shock Absorption',
    recommendedDrills: [
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'High-cadence punch extension speed and shoulder endurance for continuous combinations',
        biomechanicalFocus: 'Rapid cadence (>45 RPM) with full lockout',
        gymTargetScore: 'Target: >55 reps / min',
        importanceTier: 'Combination Punch Speed'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Leg drive generating 60%+ of knockout power kinetic chain from canvas to fist',
        biomechanicalFocus: 'Explosive upward leg drive',
        gymTargetScore: 'Target: >50 reps',
        importanceTier: 'Kinetic Punch Power Drive'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Absorbing heavy body shots and maintaining tight guard under championship fatigue',
        biomechanicalFocus: 'Tight abdominal brace throughout',
        gymTargetScore: 'Target: >170 sec',
        importanceTier: 'Body Punch Shock Absorber'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Spring-loaded footwork for in-and-out slipping, pivots & rapid angle changes',
        biomechanicalFocus: 'Elastic ankle and calf spring',
        gymTargetScore: 'Target: >54 cm',
        importanceTier: 'Ring Footwork Spring'
      }
    ],
    gymCoachingTip: 'Maintain high cadence (45+ RPM) in push-ups to build the fast-twitch endurance needed in championship rounds.'
  },
  'Athletics (Sprint/Jump)': {
    sport: 'Athletics (Sprint/Jump)',
    iconEmoji: '🏃',
    tagline: 'Ground Reaction Force, Triple-Extension & Stride Frequency',
    primaryQuality: 'Rate of Force Development & Explosive Elasticity',
    recommendedDrills: [
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Direct indicator of ground reaction force (F = m·a) and sprint takeoff velocity',
        biomechanicalFocus: 'Explosive triple extension (hip-knee-ankle)',
        gymTargetScore: 'Target: >65 cm (Elite Sprinter/Jumper)',
        importanceTier: 'Ground Reaction Velocity'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Maximum hip and knee extension power for sprint starting blocks & drive phase',
        biomechanicalFocus: 'Parallel depth with maximal ascent velocity',
        gymTargetScore: 'Target: >55 reps',
        importanceTier: 'Drive Phase Acceleration'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Eliminating torso energy leaks during maximum velocity upright sprinting',
        biomechanicalFocus: 'Rigid neutral torso alignment',
        gymTargetScore: 'Target: >160 sec',
        importanceTier: 'Sprint Posture Integrity'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Arm drive momentum and upper-body counter-rotational balance during strides',
        biomechanicalFocus: 'Symmetric arm lockout',
        gymTargetScore: 'Target: >45 reps',
        importanceTier: 'Arm Drive Counterbalance'
      }
    ],
    gymCoachingTip: 'Vertical jump hang-time directly correlates with sub-11s 100m sprint stride length and frequency.'
  },
  'Weightlifting': {
    sport: 'Weightlifting',
    iconEmoji: '🏋️',
    tagline: 'Olympic Squat Depth, Triple Extension & Rigid Spinal Lockout',
    primaryQuality: 'Deep Hip Mobility & Maximum Isometric Core Bracing',
    recommendedDrills: [
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Ass-to-grass (ATG) sub-80° knee flexion mobility for snatch and clean catch positions',
        biomechanicalFocus: 'Full deep knee flexion with vertical spine',
        gymTargetScore: 'Target: >60 reps (Perfect Deep Form)',
        importanceTier: 'Olympic Clean Catch Foundation'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Bracing intra-abdominal pressure and neutral spine alignment under heavy overhead loads',
        biomechanicalFocus: 'Zero spinal flexion/extension variance',
        gymTargetScore: 'Target: >200 sec (Spine Shield)',
        importanceTier: 'Intra-Abdominal Pressure Brace'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Peak triple-extension (hip-knee-ankle) power during second pull of the snatch/clean',
        biomechanicalFocus: 'Explosive takeoff acceleration',
        gymTargetScore: 'Target: >60 cm',
        importanceTier: 'Second-Pull Power Metric'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Upper body overhead pressing foundation and elbow lockout integrity',
        biomechanicalFocus: 'Complete 180° arm lockout',
        gymTargetScore: 'Target: >45 reps',
        importanceTier: 'Overhead Lockout Integrity'
      }
    ],
    gymCoachingTip: 'Descend below parallel on squats with vertical chest alignment to master the Olympic catch.'
  },
  'Hockey': {
    sport: 'Hockey',
    iconEmoji: '🏑',
    tagline: 'Low-Crouch Drag-Flick Power, Acceleration & Lateral Core Force',
    primaryQuality: 'Sustained Low-Stance Endurance & Rotational Power',
    recommendedDrills: [
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Maintaining prolonged semi-crouched dribbling and drag-flick posture without fatigue',
        biomechanicalFocus: 'Sustained quad & hip endurance',
        gymTargetScore: 'Target: >50 reps',
        importanceTier: 'Low-Stance Stick Play'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Transferring rotational torque from torso into high-speed drag flick shots',
        biomechanicalFocus: 'Spine stabilization during torque',
        gymTargetScore: 'Target: >140 sec',
        importanceTier: 'Drag-Flick Torque Transfer'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Explosive counter-attack sprint acceleration from dead stops on turf',
        biomechanicalFocus: 'Quick ground push-off',
        gymTargetScore: 'Target: >56 cm',
        importanceTier: 'Turf Breakaway Acceleration'
      },
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Forearm, wrist and tricep control for aerial passing and stick handling',
        biomechanicalFocus: 'Consistent 90° depth',
        gymTargetScore: 'Target: >38 reps',
        importanceTier: 'Stick Control & Push Passing'
      }
    ],
    gymCoachingTip: 'Squat endurance prevents lower back fatigue during continuous low-center-of-gravity stick play.'
  },
  'Multi-Sport / General': {
    sport: 'Multi-Sport / General',
    iconEmoji: '🏅',
    tagline: 'All-Round Olympic Tri-Power, Joint Integrity & Kinetic Balance',
    primaryQuality: 'Full-Spectrum Biomechanical Balance',
    recommendedDrills: [
      {
        exerciseType: 'pushups_standard',
        roleRationale: 'Upper body push strength & endurance',
        biomechanicalFocus: '90° elbow depth, straight spine',
        gymTargetScore: 'Target: >40 reps',
        importanceTier: 'Upper Body Base'
      },
      {
        exerciseType: 'squats_standard',
        roleRationale: 'Lower body functional mobility & leg power',
        biomechanicalFocus: 'Parallel knee depth (>90°)',
        gymTargetScore: 'Target: >45 reps',
        importanceTier: 'Lower Body Base'
      },
      {
        exerciseType: 'plank_hold',
        roleRationale: 'Core spine stabilization & endurance',
        biomechanicalFocus: 'Neutral spine alignment',
        gymTargetScore: 'Target: >120 sec',
        importanceTier: 'Core Posture Anchor'
      },
      {
        exerciseType: 'vertical_jump',
        roleRationale: 'Explosive lower body force & hang-time',
        biomechanicalFocus: 'Countermovement takeoff',
        gymTargetScore: 'Target: >50 cm',
        importanceTier: 'Explosive Power Metric'
      }
    ],
    gymCoachingTip: 'A balanced athletic foundation is the cornerstone of lifelong injury prevention and elite sports transition.'
  }
};

export function getSportProfile(sportName: string): SportTrainingProfile {
  return SPORT_TRAINING_DATABASE[sportName] || SPORT_TRAINING_DATABASE['Multi-Sport / General'];
}

