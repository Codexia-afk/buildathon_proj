import React, { useState } from 'react';
import { AthleteProfile } from '../types';
import { ProfileSetupModal } from '../components/athlete/ProfileSetupModal';
import { CameraWorkout } from '../components/athlete/CameraWorkout';
import { UserCheck, Shield, Sparkles } from 'lucide-react';

const DEFAULT_ATHLETE: AthleteProfile = {
  id: 'ath_current',
  fullName: 'Aarav Sharma',
  age: 17,
  gender: 'male',
  primarySport: 'Wrestling',
  secondarySport: 'Kabaddi',
  state: 'Haryana',
  district: 'Sonipat',
  schoolOrAcademy: 'Sonipat Sports Excellence Akhada',
  phone: '+91 98765 00000',
  createdAt: new Date().toISOString(),
};

export const AthletePage: React.FC = () => {
  const [athlete, setAthlete] = useState<AthleteProfile>(DEFAULT_ATHLETE);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const handleProfileComplete = (updated: AthleteProfile) => {
    setAthlete(updated);
    setIsSetupOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-card-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-brand/15 text-brand-400 border border-brand/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              AI Physical Assessment Lab
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
            Live Push-Up Biomechanics Test
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Ensure your upper body and arms are fully visible on camera. Our client-side AI will verify your 90° elbow depth and plank stability in real time.
          </p>
        </div>

        <button
          onClick={() => setIsSetupOpen(true)}
          className="px-4 py-2 rounded-xl bg-card border border-card-border hover:border-brand/40 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-brand" />
          <span>Switch / Edit Athlete Profile</span>
        </button>
      </div>

      {/* Camera Workout View */}
      <CameraWorkout
        athlete={athlete}
        onProfileEdit={() => setIsSetupOpen(true)}
      />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={isSetupOpen}
        onComplete={handleProfileComplete}
        initialProfile={athlete}
      />

    </div>
  );
};
