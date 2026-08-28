import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Award, 
  Bookmark, 
  BookmarkCheck, 
  Send, 
  Calendar, 
  Phone, 
  Activity, 
  ShieldCheck, 
  Plus, 
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { AssessmentResult, AthleteProfile } from '../../types';
import { getTierBadgeColor, EXERCISE_CONFIGS } from '../../services/percentileEngine';
import { getAthleteDetails, addScoutNote, toggleScoutShortlist } from '../../services/dataService';
import { PerformanceChart } from './PerformanceChart';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AssessmentCertificate } from '../athlete/AssessmentCertificate';

interface AthleteDetailModalProps {
  assessment: AssessmentResult | null;
  isOpen: boolean;
  onClose: () => void;
  onShortlistChange?: () => void;
}

export const AthleteDetailModal: React.FC<AthleteDetailModalProps> = ({
  assessment,
  isOpen,
  onClose,
  onShortlistChange,
}) => {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  useEffect(() => {
    if (assessment) {
      setIsShortlisted((assessment.shortlistedBy || []).includes('scout_default'));
      
      getAthleteDetails(assessment.athleteId).then((res) => {
        setProfile(res.profile);
        setHistory(res.history);
      });
    }
  }, [assessment]);

  if (!assessment) return null;

  const config = EXERCISE_CONFIGS[assessment.testType] || EXERCISE_CONFIGS.pushups_standard;
  const tierColors = getTierBadgeColor(assessment.talentTier);

  const handleToggleShortlist = async () => {
    const updated = await toggleScoutShortlist(assessment.id);
    setIsShortlisted(updated);
    if (onShortlistChange) onShortlistChange();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    await addScoutNote(assessment.id, noteText.trim());
    
    // Optimistic UI update
    if (!assessment.scoutNotes) assessment.scoutNotes = [];
    assessment.scoutNotes.push(noteText.trim());
    setNoteText('');
    setIsAddingNote(false);
  };

  const handleSendTrialInvite = () => {
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="4xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {assessment.athleteName}
              </h3>
              <p className="text-xs text-slate-400">
                {assessment.sport} • {assessment.state} ({assessment.district})
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-8">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Standing Tier */}
            <div className={`p-4 rounded-2xl border ${tierColors.bg} ${tierColors.border} ${tierColors.glow} flex flex-col justify-between`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  National Tier
                </span>
                <span className={`text-sm font-bold ${tierColors.text} mt-1 block`}>
                  {assessment.talentTier}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-4xl font-display font-bold text-white">
                  {Math.round(assessment.percentile)}
                </span>
                <span className="text-sm font-bold text-brand">%ile</span>
              </div>
            </div>

            {/* Test Performance */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-card-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Latest Assessment
                </span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {config.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-4xl font-display font-bold text-white">
                  {assessment.score}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  {config.unit} IN {assessment.durationSeconds}s
                </span>
              </div>
            </div>

            {/* Biomechanical Form */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-card-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Form & Precision
                </span>
                <span className="text-sm font-bold text-emerald-400 mt-1 block">
                  AI Form Integrity
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-4xl font-display font-bold text-emerald-400">
                  {assessment.biomechanics.formScore}%
                </span>
                <span className="text-xs font-mono text-slate-400">Lockout Quality</span>
              </div>
            </div>

          </div>

          {/* Biometrics & Bio Grid */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-card-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Age / Gender:</span>
              <span className="font-semibold text-white capitalize">{assessment.age} yrs • {assessment.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Location:</span>
              <span className="font-semibold text-white">{assessment.district}, {assessment.state}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Cadence / Speed:</span>
              <span className="font-semibold text-white font-mono">
                {assessment.biomechanics.cadenceRepsPerMin ? `${assessment.biomechanics.cadenceRepsPerMin} RPM` : `${assessment.biomechanics.peakSpeedSec || 1.2}s/rep`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Avg Depth Flexion:</span>
              <span className="font-semibold text-brand font-mono">
                {assessment.biomechanics.averageElbowFlexion || assessment.biomechanics.averageKneeFlexion || 82}°
              </span>
            </div>
          </div>

          {/* Historical Growth Progression Line Chart */}
          <div className="p-5 rounded-2xl bg-card border border-card-border">
            <PerformanceChart history={history} />
          </div>

          {/* Action Row: Certificate, Shortlist, Trial Invite */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-card-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCertificateOpen(true)}
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4 text-brand" />}
              >
                View / Print Certificate
              </Button>

              <button
                onClick={handleToggleShortlist}
                className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  isShortlisted
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-card border-card-border text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-amber-400' : ''}`} />
                <span>{isShortlisted ? 'Shortlisted' : 'Bookmark Candidate'}</span>
              </button>
            </div>

            <Button
              onClick={handleSendTrialInvite}
              variant="primary"
              size="sm"
              disabled={inviteSent}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {inviteSent ? 'Trial Invitation Sent ✓' : 'Invite for State Trials'}
            </Button>
          </div>

          {/* Scout Review Notes & Action Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyber" /> Scout Evaluation Notes
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {(assessment.scoutNotes || []).length} Notes Saved
              </span>
            </div>

            {/* Note form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add scout observation (e.g. explosive concentric phase, recommend for state camp)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-xs text-white placeholder-slate-500 focus:border-brand"
              />
              <Button type="submit" size="sm" disabled={isAddingNote || !noteText.trim()} leftIcon={<Plus className="w-4 h-4" />}>
                Add Note
              </Button>
            </form>

            {/* Notes List */}
            {assessment.scoutNotes && assessment.scoutNotes.length > 0 ? (
              <div className="space-y-2">
                {assessment.scoutNotes.map((note, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-card-border text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-brand font-bold font-mono">#{i + 1}</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No notes added yet by scouting team.</p>
            )}
          </div>

        </div>
      </Modal>

      {isCertificateOpen && (
        <AssessmentCertificate
          assessment={assessment}
          onClose={() => setIsCertificateOpen(false)}
        />
      )}
    </>
  );
};
