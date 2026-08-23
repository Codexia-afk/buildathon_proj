import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Flame, 
  Award, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Bookmark, 
  Play, 
  Send,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { AssessmentResult, ScoutFilterState } from '../../types';
import { 
  subscribeToAssessments, 
  toggleScoutShortlist, 
  saveAssessment 
} from '../../services/dataService';
import { FilterBar } from './FilterBar';
import { AthleteTable } from './AthleteTable';
import { AthleteDetailModal } from './AthleteDetailModal';
import { ShortlistDrawer } from './ShortlistDrawer';
import { Button } from '../common/Button';
import { isFirebaseConfigured } from '../../services/firebase';

export const ScoutDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [isSimulatingIncoming, setIsSimulatingIncoming] = useState(false);

  // Filter & Search State
  const [filters, setFilters] = useState<ScoutFilterState>({
    searchQuery: '',
    sport: '',
    state: '',
    minAge: 10,
    maxAge: 40,
    minPercentile: 0,
    tier: '',
    sortBy: 'percentile_desc',
    onlyShortlisted: false,
  });

  // Subscribe to real-time stream
  useEffect(() => {
    let initialLoad = true;
    const unsubscribe = subscribeToAssessments((updatedList) => {
      if (!initialLoad) {
        // Detect newly inserted items to trigger highlight animation
        const currentIds = new Set(assessments.map((a) => a.id));
        const newlyAdded = updatedList.filter((a) => !currentIds.has(a.id)).map((a) => a.id);
        if (newlyAdded.length > 0) {
          setNewIds((prev) => new Set([...prev, ...newlyAdded]));
          // Clear highlight after 5 seconds
          setTimeout(() => {
            setNewIds((prev) => {
              const copy = new Set(prev);
              newlyAdded.forEach((id) => copy.delete(id));
              return copy;
            });
          }, 5000);
        }
      }
      initialLoad = false;
      setAssessments(updatedList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Filter & Sort Logic
  const filteredAssessments = useMemo(() => {
    let list = [...assessments];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.athleteName.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q) ||
          a.verificationHash.toLowerCase().includes(q)
      );
    }

    // Sport
    if (filters.sport) {
      list = list.filter((a) => a.sport.toLowerCase() === filters.sport.toLowerCase());
    }

    // State
    if (filters.state) {
      list = list.filter((a) => a.state.toLowerCase() === filters.state.toLowerCase());
    }

    // Min Percentile
    if (filters.minPercentile > 0) {
      list = list.filter((a) => a.percentile >= filters.minPercentile);
    }

    // Only Shortlisted
    if (filters.onlyShortlisted) {
      list = list.filter((a) => (a.shortlistedBy || []).includes('scout_default'));
    }

    // Sorting
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'percentile_desc':
          return b.percentile - a.percentile;
        case 'percentile_asc':
          return a.percentile - b.percentile;
        case 'reps_desc':
          return b.repsCount - a.repsCount;
        case 'date_desc':
        default:
          return new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime();
      }
    });

    return list;
  }, [assessments, filters]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = assessments.length;
    const eliteCount = assessments.filter((a) => a.percentile >= 90).length;
    
    // Most active state
    const stateCounts: Record<string, number> = {};
    assessments.forEach((a) => {
      stateCounts[a.state] = (stateCounts[a.state] || 0) + 1;
    });
    const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Haryana';

    // Most active sport
    const sportCounts: Record<string, number> = {};
    assessments.forEach((a) => {
      sportCounts[a.sport] = (sportCounts[a.sport] || 0) + 1;
    });
    const topSport = Object.entries(sportCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Wrestling';

    const shortlisted = assessments.filter((a) => (a.shortlistedBy || []).includes('scout_default'));

    return {
      total,
      eliteCount,
      topState,
      topSport,
      shortlistedCount: shortlisted.length,
      shortlistedList: shortlisted,
    };
  }, [assessments]);

  // Handlers
  const handleSelectAthlete = (assessment: AssessmentResult) => {
    setSelectedAssessment(assessment);
    setIsDetailOpen(true);
  };

  const handleToggleShortlist = async (assessmentId: string) => {
    await toggleScoutShortlist(assessmentId);
  };

  // One-click live simulator to demonstrate live sync to judges
  const handleSimulateLivePush = async () => {
    setIsSimulatingIncoming(true);

    const demoAthletes = [
      { name: 'Simranjeet Kaur', age: 16, gender: 'female' as const, sport: 'Athletics (Sprint/Jump)' as const, state: 'Punjab', district: 'Ludhiana', reps: 46, p: 97.4 },
      { name: 'Manish Rawat', age: 18, gender: 'male' as const, sport: 'Boxing' as const, state: 'Uttarakhand', district: 'Almora', reps: 58, p: 93.1 },
      { name: 'Praveen Goud', age: 17, gender: 'male' as const, sport: 'Kabaddi' as const, state: 'Telangana', district: 'Warangal', reps: 56, p: 94.6 },
    ];

    const pick = demoAthletes[Math.floor(Math.random() * demoAthletes.length)];
    const mockHash = `TL-${Math.round(pick.p)}-${pick.state.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newAssessment: AssessmentResult = {
      id: `ass_live_${Date.now()}`,
      athleteId: `ath_live_${Date.now()}`,
      athleteName: pick.name,
      age: pick.age,
      gender: pick.gender,
      state: pick.state,
      district: pick.district,
      sport: pick.sport,
      testType: 'pushups_standard',
      repsCount: pick.reps,
      durationSeconds: 56,
      percentile: pick.p,
      talentTier: 'National Elite Prospect (Top 5%)',
      biomechanics: {
        averageElbowFlexion: 77,
        averageTrunkAlignment: 174,
        formScore: 95,
        incompletedReps: 0,
        cadenceRepsPerMin: 52,
        peakSpeedSec: 0.94,
      },
      verificationHash: mockHash,
      verifiedAt: new Date().toISOString(),
      status: 'verified',
      scoutNotes: ['Live assessment submitted via remote camera feed'],
      shortlistedBy: [],
    };

    await saveAssessment(newAssessment);
    setIsSimulatingIncoming(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-card-border">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Live Scout Stream ({isFirebaseConfigured ? 'Firestore' : 'Reactive Bus'})
            </span>
            <span className="text-xs text-slate-500">• Auto-updating in real-time</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
            Sports Talent Discovery Protocol
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Real-time feed of AI-verified grassroots physical fitness assessments across Indian states, ranked against national percentile cohorts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            onClick={handleSimulateLivePush}
            isLoading={isSimulatingIncoming}
            variant="secondary"
            size="md"
            leftIcon={<Zap className="w-4 h-4 text-slate-950" />}
          >
            Simulate Incoming Live Assessment
          </Button>

          <Button
            onClick={() => setIsShortlistOpen(true)}
            variant="outline"
            size="md"
            leftIcon={<Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />}
          >
            Saved ({metrics.shortlistedCount})
          </Button>
        </div>
      </div>

      {/* Metric Cards KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Athletes */}
        <div className="p-5 rounded-3xl bg-card border border-card-border shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Verified Athletes
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                {metrics.total}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">+100% Verified</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Elite Prospects */}
        <div className="p-5 rounded-3xl bg-card border border-card-border shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Elite Prospects (90%+)
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-amber-400">
                {metrics.eliteCount}
              </span>
              <span className="text-xs text-slate-400 font-mono">National Cohort</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Top State */}
        <div className="p-5 rounded-3xl bg-card border border-card-border shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Leading Region
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 truncate max-w-[140px]">
              {metrics.topState}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyber/10 border border-cyber/30 flex items-center justify-center text-cyber">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        {/* Top Sport */}
        <div className="p-5 rounded-3xl bg-card border border-card-border shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
              Top Discipline
            </span>
            <div className="text-base sm:text-lg font-bold text-white mt-1 truncate max-w-[140px]">
              {metrics.topSport}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Filter Toolbar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            searchQuery: '',
            sport: '',
            state: '',
            minAge: 10,
            maxAge: 40,
            minPercentile: 0,
            tier: '',
            sortBy: 'percentile_desc',
            onlyShortlisted: false,
          })
        }
        totalResults={filteredAssessments.length}
        shortlistedCount={metrics.shortlistedCount}
      />

      {/* Real-time Assessments Table */}
      <AthleteTable
        assessments={filteredAssessments}
        onSelectAthlete={handleSelectAthlete}
        onToggleShortlist={handleToggleShortlist}
        newAssessmentIds={newIds}
      />

      {/* Athlete Detail Modal */}
      <AthleteDetailModal
        assessment={selectedAssessment}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlistedAssessments={metrics.shortlistedList}
        onSelectAthlete={handleSelectAthlete}
        onRemoveFromShortlist={handleToggleShortlist}
      />

    </div>
  );
};
