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
  TrendingUp,
  Download,
  Scale
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
import { AthleteComparisonModal } from './AthleteComparisonModal';
import { Button } from '../common/Button';
import { isFirebaseConfigured } from '../../services/firebase';

export const ScoutDashboard: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResult | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [isSimulatingIncoming, setIsSimulatingIncoming] = useState(false);
  
  // Head-to-Head Comparison selection
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Filter & Search State
  const [filters, setFilters] = useState<ScoutFilterState>({
    searchQuery: '',
    testType: '',
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

    // Test Type
    if (filters.testType) {
      list = list.filter((a) => a.testType === filters.testType);
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
      if (filters.sortBy === 'percentile_desc') return b.percentile - a.percentile;
      if (filters.sortBy === 'percentile_asc') return a.percentile - b.percentile;
      if (filters.sortBy === 'score_desc') return b.score - a.score;
      if (filters.sortBy === 'date_desc') return new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime();
      return 0;
    });

    return list;
  }, [assessments, filters]);

  const shortlistedAssessments = useMemo(() => {
    return assessments.filter((a) => (a.shortlistedBy || []).includes('scout_default'));
  }, [assessments]);

  // Handle shortlist toggle
  const handleToggleShortlist = async (id: string) => {
    await toggleScoutShortlist(id, 'scout_default');
  };

  // Handle comparison toggle
  const handleToggleCompare = (id: string) => {
    setSelectedForComparison((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 3) {
          alert('You can compare up to 3 athletes simultaneously.');
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const comparedAthletes = useMemo(() => {
    return assessments.filter((a) => selectedForComparison.has(a.id));
  }, [assessments, selectedForComparison]);

  // Export filtered assessments to CSV
  const exportAllCSV = () => {
    const headers = [
      'Name',
      'Age',
      'Gender',
      'Sport',
      'State',
      'District',
      'Test Type',
      'Score',
      'Percentile',
      'Talent Tier',
      'Form Quality %',
      'Verification Hash',
      'Verified At',
    ];

    const rows = filteredAssessments.map((a) => [
      `"${a.athleteName}"`,
      a.age,
      a.gender,
      `"${a.sport}"`,
      `"${a.state}"`,
      `"${a.district}"`,
      `"${a.testType}"`,
      a.score,
      a.percentile,
      `"${a.talentTier}"`,
      a.biomechanics.formScore,
      `"${a.verificationHash}"`,
      `"${a.verifiedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TalentLens_Scout_Database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate incoming live assessment for hackathon judging demo
  const handleSimulateIncoming = async () => {
    setIsSimulatingIncoming(true);
    const names = ['Neeraj Yadav', 'Simranjeet Kaur', 'Devendra Murmu', 'Ananya Deshmukh', 'Sahil Rathore'];
    const sports = ['Athletics (Sprint/Jump)', 'Wrestling', 'Kabaddi', 'Football', 'Boxing'] as const;
    const states = ['Haryana', 'Punjab', 'Jharkhand', 'Maharashtra', 'Rajasthan'];
    const tests = ['pushups_standard', 'squats_standard', 'plank_hold', 'vertical_jump'] as const;

    const randIdx = Math.floor(Math.random() * names.length);
    const randTest = tests[Math.floor(Math.random() * tests.length)];
    const chosenName = names[randIdx];
    const chosenSport = sports[randIdx];
    const chosenState = states[randIdx];

    let testScore = 42;
    if (randTest === 'squats_standard') testScore = 58;
    else if (randTest === 'plank_hold') testScore = 145;
    else if (randTest === 'vertical_jump') testScore = 64;

    const mockResult: AssessmentResult = {
      id: `ass_live_${Date.now()}`,
      athleteId: `ath_live_${Date.now()}`,
      athleteName: chosenName,
      age: 16 + Math.floor(Math.random() * 4),
      gender: Math.random() > 0.4 ? 'male' : 'female',
      state: chosenState,
      district: 'Excellence Hub',
      sport: chosenSport,
      testType: randTest,
      score: testScore,
      durationSeconds: 60,
      percentile: 94 + Math.floor(Math.random() * 5),
      talentTier: 'National Elite Prospect (Top 5%)',
      biomechanics: {
        averageElbowFlexion: 78,
        averageTrunkAlignment: 174,
        formScore: 98,
        incompletedReps: 0,
        cadenceRepsPerMin: 38,
        peakSpeedSec: 1.1,
      },
      verificationHash: `TL-98-${chosenState.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
      status: 'verified',
      scoutNotes: [],
      shortlistedBy: [],
    };

    await saveAssessment(mockResult);
    setIsSimulatingIncoming(false);
  };

  // Metrics summary
  const eliteCount = useMemo(() => assessments.filter((a) => a.percentile >= 90).length, [assessments]);
  const avgPercentile = useMemo(() => {
    if (assessments.length === 0) return 0;
    return Math.round(assessments.reduce((acc, a) => acc + a.percentile, 0) / assessments.length);
  }, [assessments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-card-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Scouting Discovery Network
            </span>
            <span className="text-xs font-mono text-slate-500">
              {isFirebaseConfigured ? 'Firestore Synchronized' : 'Multi-Tab Event Mesh'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
            Scout & Coach Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Real-time feed of verified grassroots athletes across India. Filter by sport, state, and test type to discover undiscovered Olympic talent.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {selectedForComparison.size >= 2 && (
            <Button
              onClick={() => setIsComparisonOpen(true)}
              variant="outline"
              size="sm"
              className="border-cyber text-cyber hover:bg-cyber/10 shadow-glow-cyber"
              leftIcon={<Scale className="w-4 h-4" />}
            >
              Compare ({selectedForComparison.size})
            </Button>
          )}

          <Button
            onClick={exportAllCSV}
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>

          <Button
            onClick={handleSimulateIncoming}
            variant="outline"
            size="sm"
            disabled={isSimulatingIncoming}
            leftIcon={<Sparkles className="w-4 h-4 text-brand" />}
          >
            {isSimulatingIncoming ? 'Simulating...' : 'Simulate Live Submission'}
          </Button>

          <button
            onClick={() => setIsShortlistOpen(true)}
            className="px-4 py-2 rounded-xl bg-card border border-card-border hover:border-amber-500/50 text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 shadow-lg transition-all"
          >
            <Bookmark className="w-4 h-4 fill-amber-400" />
            <span>Shortlist ({shortlistedAssessments.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-3xl bg-card border border-card-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Athletes</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-display font-extrabold text-white">
            {assessments.length}
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Verified in Protocol</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-card-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">National Elite (Top 10%)</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-extrabold text-amber-400">
            {eliteCount}
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">High-Potential Prospects</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-card-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Average Percentile</span>
            <TrendingUp className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-display font-extrabold text-brand">
            {avgPercentile}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">National Norm Calibration</span>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-card-border space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Shortlisted Candidates</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-extrabold text-white">
            {shortlistedAssessments.length}
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">Saved for State Trials</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            searchQuery: '',
            testType: '',
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
        shortlistedCount={shortlistedAssessments.length}
      />

      {/* Athlete Discovery Table */}
      <AthleteTable
        assessments={filteredAssessments}
        onSelectAthlete={(item) => {
          setSelectedAssessment(item);
          setIsDetailOpen(true);
        }}
        onToggleShortlist={handleToggleShortlist}
        newAssessmentIds={newIds}
        selectedForComparison={selectedForComparison}
        onToggleCompare={handleToggleCompare}
      />

      {/* Athlete Detail Inspection Modal */}
      {selectedAssessment && (
        <AthleteDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedAssessment(null);
          }}
          assessment={selectedAssessment}
          onShortlistChange={() => {}}
        />
      )}

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlistedAssessments={shortlistedAssessments}
        onSelectAthlete={(item) => {
          setSelectedAssessment(item);
          setIsDetailOpen(true);
        }}
        onRemoveFromShortlist={handleToggleShortlist}
      />

      {/* Head-to-Head Athlete Comparison Matrix */}
      {isComparisonOpen && (
        <AthleteComparisonModal
          athletes={comparedAthletes}
          onClose={() => setIsComparisonOpen(false)}
          onClear={() => {
            setSelectedForComparison(new Set());
            setIsComparisonOpen(false);
          }}
        />
      )}

    </div>
  );
};
