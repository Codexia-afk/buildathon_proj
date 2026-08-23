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
  CheckCircle2
} from 'lucide-react';
import { AssessmentResult, AthleteProfile } from '../../types';
import { getTierBadgeColor } from '../../services/percentileEngine';
import { getAthleteDetails, addScoutNote, toggleScoutShortlist } from '../../services/dataService';
import { PerformanceChart } from './PerformanceChart';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

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
                Push-Up Fatigue Test
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-3">
              <span className="text-4xl font-display font-bold text-white">
                {assessment.repsCount}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">REPS IN {assessment.durationSeconds}s</span>
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
            <span className="text-slate-400 block">Cadence / Pace:</span>
            <span className="font-semibold text-white">{assessment.biomechanics.cadenceRepsPerMin} RPM</span>
          </div>
          <div>
            <span className="text-slate-400 block">Avg Elbow Flexion:</span>
            <span className="font-semibold text-brand font-mono">{assessment.biomechanics.averageElbowFlexion}° (90° standard)</span>
          </div>
        </div>

        {/* Historical Growth Progression Line Chart */}
        <div className="p-5 rounded-2xl bg-card border border-card-border">
          <PerformanceChart history={history} />
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

          {/* Notes list */}
          <div className="space-y-2">
            {(assessment.scoutNotes || []).length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-900/40 border border-card-border">
                No notes logged yet. Use the form below to save private coach observations.
              </p>
            ) : (
              assessment.scoutNotes?.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-card-border text-xs text-slate-200 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber mt-1.5 shrink-0" />
                  <p className="flex-1">{note}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add observation (e.g. 'Strong core control, candidate for U-18 district camp')..."
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-card-border text-white text-xs focus:border-brand focus:ring-1 focus:ring-brand placeholder-slate-500"
            />
            <Button
              type="submit"
              size="sm"
              isLoading={isAddingNote}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Note
            </Button>
          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-card-border">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleToggleShortlist}
              variant={isShortlisted ? 'secondary' : 'outline'}
              size="md"
              leftIcon={
                isShortlisted ? (
                  <BookmarkCheck className="w-4 h-4 text-slate-950" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )
              }
            >
              {isShortlisted ? 'Shortlisted ✓' : 'Save to Shortlist'}
            </Button>

            <Button
              onClick={handleSendTrialInvite}
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
            >
              {inviteSent ? 'Invite Sent to Athlete ✓' : 'Invite to Academy Trials'}
            </Button>
          </div>

          <Button onClick={onClose} variant="ghost" size="md">
            Close View
          </Button>
        </div>

      </div>
    </Modal>
  );
};
