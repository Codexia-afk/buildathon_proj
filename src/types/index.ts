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

export interface PushUpBiomechanics {
  averageElbowFlexion: number; // e.g. 78 degrees at bottom
  averageTrunkAlignment: number; // e.g. 172 degrees (back straightness)
  formScore: number; // 0-100%
  incompletedReps: number;
  cadenceRepsPerMin: number;
  peakSpeedSec: number;
}

export interface AssessmentResult {
  id: string;
  athleteId: string;
  athleteName: string;
  age: number;
  gender: Gender;
  state: string;
  district: string;
  sport: SportType;
  testType: 'pushups_standard';
  repsCount: number;
  durationSeconds: number;
  percentile: number; // 0-100
  talentTier: TalentTier;
  biomechanics: PushUpBiomechanics;
  verificationHash: string;
  verifiedAt: string;
  videoPreviewUrl?: string;
  status: 'verified' | 'flagged' | 'under_review';
  scoutNotes?: string[];
  shortlistedBy?: string[]; // array of scout IDs
}

export interface PercentileBracket {
  ageRange: [number, number]; // e.g. [14, 17]
  gender: Gender;
  p10: number;
  p25: number;
  p50: number; // median
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface BenchmarkDistribution {
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

export interface ScoutFilterState {
  searchQuery: string;
  sport: string;
  state: string;
  minAge: number;
  maxAge: number;
  minPercentile: number;
  tier: string;
  sortBy: 'percentile_desc' | 'percentile_asc' | 'reps_desc' | 'date_desc';
  onlyShortlisted: boolean;
}
