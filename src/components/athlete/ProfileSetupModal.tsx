import React, { useState } from 'react';
import { User, MapPin, Award, ArrowRight, Shield } from 'lucide-react';
import { AthleteProfile, Gender, SportType } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

const INDIAN_STATES = [
  'Haryana', 'Kerala', 'Punjab', 'Maharashtra', 'Odisha', 'Manipur',
  'Tamil Nadu', 'Karnataka', 'Assam', 'Telangana', 'Uttar Pradesh',
  'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'West Bengal', 'Jharkhand',
  'Andhra Pradesh', 'Delhi (NCR)', 'Uttarakhand', 'Himachal Pradesh',
  'Goa', 'Chhattisgarh', 'Bihar', 'Tripura', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Arunachal Pradesh', 'Jammu & Kashmir', 'Ladakh'
];

const SPORTS_LIST: SportType[] = [
  'Athletics (Sprint/Jump)',
  'Football',
  'Kabaddi',
  'Cricket',
  'Wrestling',
  'Boxing',
  'Badminton',
  'Hockey',
  'Basketball',
  'Weightlifting',
  'Multi-Sport / General'
];

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: (profile: AthleteProfile) => void;
  initialProfile?: Partial<AthleteProfile>;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
}) => {
  const [fullName, setFullName] = useState(initialProfile?.fullName || 'Aarav Sharma');
  const [age, setAge] = useState<number>(initialProfile?.age || 17);
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'male');
  const [primarySport, setPrimarySport] = useState<SportType>(initialProfile?.primarySport || 'Wrestling');
  const [state, setState] = useState(initialProfile?.state || 'Haryana');
  const [district, setDistrict] = useState(initialProfile?.district || 'Sonipat');
  const [schoolOrAcademy, setSchoolOrAcademy] = useState(initialProfile?.schoolOrAcademy || 'Govt Sports High School');
  const [phone, setPhone] = useState(initialProfile?.phone || '+91 98765 00000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const profile: AthleteProfile = {
      id: initialProfile?.id || `ath_${Date.now()}`,
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      primarySport,
      state,
      district: district.trim() || 'District Center',
      schoolOrAcademy: schoolOrAcademy.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    };

    onComplete(profile);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand" />
          <span>Athlete Profile Setup</span>
        </div>
      }
      subtitle="Your age and gender determine national benchmark percentiles"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Full Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Athlete Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand focus:ring-1 focus:ring-brand text-white placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contact Phone / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand focus:ring-1 focus:ring-brand text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Age (Years) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={10}
                max={60}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-24 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white font-mono text-center font-bold text-base"
              />
              <div className="flex gap-1.5 flex-wrap">
                {[14, 16, 18, 21].map((presetAge) => (
                  <button
                    key={presetAge}
                    type="button"
                    onClick={() => setAge(presetAge)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-colors ${
                      age === presetAge
                        ? 'bg-brand/20 border-brand text-brand-300'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {presetAge}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Gender Cohort *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                    gender === g
                      ? 'bg-brand text-white border-brand shadow-glow-brand'
                      : 'bg-slate-900/60 border-card-border text-slate-400 hover:text-white'
                  }`}
                >
                  {g === 'male' ? 'Male / Boys' : 'Female / Girls'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary Sport */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Primary Sport Discipline *
          </label>
          <select
            value={primarySport}
            onChange={(e) => setPrimarySport(e.target.value as SportType)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white text-sm"
          >
            {SPORTS_LIST.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>

        {/* State & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              State / UT *
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white text-sm"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              District / Town *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Rohtak, Kolhapur, Imphal"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white placeholder-slate-500 text-sm"
            />
          </div>
        </div>

        {/* School / Club Academy */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            School, Akhada or Training Academy (Optional)
          </label>
          <input
            type="text"
            value={schoolOrAcademy}
            onChange={(e) => setSchoolOrAcademy(e.target.value)}
            placeholder="e.g. SAI Center, District Sports Club, Kendriya Vidyalaya"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white placeholder-slate-500 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Launch AI Camera Assessment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
