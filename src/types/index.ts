export type Gender = 'male' | 'female' | 'other';

export type SportType = 
  | 'Athletics (Sprint/Jump)'
  | 'Football'
  | 'Kabaddi'
  | 'Cricket'
  | 'Wrestling'
  | 'Boxing'
  | 'Badminton'
  | 'Hockey'
  | 'Basketball'
  | 'Weightlifting'
  | 'Multi-Sport / General';

export type TestType = 
  | 'pushups_standard'
  | 'squats_standard'
  | 'plank_hold'
  | 'vertical_jump';

export type TalentTier = 
  | 'National Elite Prospect (Top 5%)'
  | 'State Level Contender (Top 15%)'
  | 'District High Performer (Top 30%)'
  | 'Active Club Athlete (Top 50%)'
  | 'Developing Talent (Base Tier)';

export interface AthleteProfile {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  primarySport: SportType;
  secondarySport?: string;
  state: string;
  district: string;
  heightCm?: number;
  weightKg?: number;
  schoolOrAcademy?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ExerciseBiomechanics {
  // Push-up / Squat metrics
  averageElbowFlexion?: number; // degrees
  averageKneeFlexion?: number;  // degrees (for squats)
  averageTrunkAlignment: number; // degrees (back straightness)
  formScore: number; // 0-100%
  incompletedReps: number;
  cadenceRepsPerMin?: number;
  peakSpeedSec?: number;
  
  // Plank Hold metrics
  holdDurationSeconds?: number;
  stabilityScore?: number; // 0-100%

  // Vertical Jump metrics
  jumpHeightCm?: number;
  flightTimeSec?: number;
  takeoffVelocityMs?: number;
}

export type PushUpBiomechanics = ExerciseBiomechanics;

export interface AssessmentResult {
  id: string;
  athleteId: string;
  athleteName: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  sport: SportType;
  testType: TestType;
  score: number; // reps count or seconds or cm jump height
  repsCount?: number;
  durationSeconds: number;
  percentile: number; // 0-100
  talentTier: TalentTier;
  biomechanics: ExerciseBiomechanics;
  verificationHash: string;
  verifiedAt: string;
  videoPreviewUrl?: string;
  status: 'verified' | 'flagged' | 'under_review';
  scoutNotes?: string[];
  shortlistedBy?: string[]; // array of scout IDs
}

export interface BenchmarkDistribution {
  testId: TestType;
  testName: string;
  unit: string;
  description: string;
  brackets: {
    bracketId: string;
    label: string;
    minAge: number;
    maxAge: number;
    male: {
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
      p95: number;
      p99: number;
      nationalRecord: number;
    };
    female: {
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
      p95: number;
      p99: number;
      nationalRecord: number;
    };
  }[];
}

export interface MultiTestBenchmarks {
  tests: Record<TestType, BenchmarkDistribution>;
}

export interface ScoutFilterState {
  searchQuery: string;
  testType: string;
  sport: string;
  state: string;
  minAge: number;
  maxAge: number;
  minPercentile: number;
  tier: string;
  sortBy: 'percentile_desc' | 'percentile_asc' | 'score_desc' | 'date_desc';
  onlyShortlisted: boolean;
}

export interface ExerciseConfig {
  id: TestType;
  name: string;
  shortName: string;
  category: 'Upper Body' | 'Lower Body' | 'Core' | 'Power';
  iconName: string;
  metricLabel: string;
  unit: string;
  description: string;
  standardDurationSec?: number;
  instructions: string[];
}
