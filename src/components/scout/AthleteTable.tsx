import React from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  Flame, 
  ShieldCheck, 
  Activity, 
  Award, 
  Clock, 
  MapPin,
  Sparkles,
  Zap
} from 'lucide-react';
import { AssessmentResult } from '../../types';
import { getTierBadgeColor, EXERCISE_CONFIGS } from '../../services/percentileEngine';

interface AthleteTableProps {
  assessments: AssessmentResult[];
  onSelectAthlete: (assessment: AssessmentResult) => void;
  onToggleShortlist: (assessmentId: string) => void;
  newAssessmentIds?: Set<string>;
  selectedForComparison?: Set<string>;
  onToggleCompare?: (assessmentId: string) => void;
}

export const AthleteTable: React.FC<AthleteTableProps> = ({
  assessments,
  onSelectAthlete,
  onToggleShortlist,
  newAssessmentIds = new Set(),
  selectedForComparison = new Set(),
  onToggleCompare,
}) => {
  if (assessments.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-card border border-card-border space-y-3">
        <Activity className="w-10 h-10 text-slate-500 mx-auto" />
        <h4 className="text-base font-bold text-white">No Matching Athlete Assessments Found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try loosening your filter parameters (Test, State, Sport, Min Percentile) or submit a new athletic assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-card border border-card-border shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-card-border bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {onToggleCompare && <th className="py-4 px-3 text-center">Compare</th>}
            <th className="py-4 px-4">Athlete & Location</th>
            <th className="py-4 px-4">Assessment Test</th>
            <th className="py-4 px-4">Sport</th>
            <th className="py-4 px-4 text-center">Score</th>
            <th className="py-4 px-4 text-center">National %ile</th>
            <th className="py-4 px-4 text-center">Form Score</th>
            <th className="py-4 px-4">Verified Date</th>
            <th className="py-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60 text-xs">
          {assessments.map((item) => {
            const isNew = newAssessmentIds.has(item.id);
            const isShortlisted = (item.shortlistedBy || []).includes('scout_default');
            const isCompared = selectedForComparison.has(item.id);
            const tierColors = getTierBadgeColor(item.talentTier);
            const config = EXERCISE_CONFIGS[item.testType] || EXERCISE_CONFIGS.pushups_standard;

            return (
              <tr
                key={item.id}
                className={`group hover:bg-card-hover/80 transition-all duration-200 ${
                  isNew ? 'bg-brand-500/10 animate-pulse' : ''
                } ${isCompared ? 'bg-cyber/10' : ''}`}
              >
                {/* Compare Checkbox */}
                {onToggleCompare && (
                  <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => onToggleCompare(item.id)}
                      className="w-4 h-4 accent-cyber rounded cursor-pointer"
                    />
                  </td>
                )}

                {/* Athlete Name & Location */}
                <td className="py-4 px-4 cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 group-hover:border-brand/50 group-hover:text-brand transition-colors shrink-0">
                      {item.athleteName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-brand-300 transition-colors">
                          {item.athleteName}
                        </span>
                        {isNew && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand text-white uppercase font-mono animate-bounce">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{item.district}, {item.state}</span>
                        <span>•</span>
                        <span>{item.age}y ({item.gender.charAt(0).toUpperCase()})</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Assessment Test */}
                <td className="py-4 px-4 cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-card-border text-[11px] text-brand-300 font-semibold font-mono whitespace-nowrap">
                    {config.shortName}
                  </span>
                </td>

                {/* Sport */}
                <td className="py-4 px-4 font-medium text-slate-300 cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-card-border text-[11px] text-slate-200 font-semibold whitespace-nowrap">
                    {item.sport}
                  </span>
                </td>

                {/* Raw Score */}
                <td className="py-4 px-4 text-center cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <span className="text-base font-display font-bold text-white">
                    {item.score} <span className="text-[10px] font-mono text-slate-400 font-normal uppercase">{config.unit}</span>
                  </span>
                </td>

                {/* National Percentile & Talent Tier */}
                <td className="py-4 px-4 text-center cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold font-mono text-white">
                      {Math.round(item.percentile)}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-0.5 whitespace-nowrap ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                      {item.talentTier.split(' (')[0]}
                    </span>
                  </div>
                </td>

                {/* Form Quality */}
                <td className="py-4 px-4 text-center cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-card-border text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-200 font-bold">{item.biomechanics.formScore}%</span>
                  </div>
                </td>

                {/* Verified Date */}
                <td className="py-4 px-4 text-slate-400 text-xs font-mono cursor-pointer" onClick={() => onSelectAthlete(item)}>
                  {new Date(item.verifiedAt).toLocaleDateString()}
                </td>

                {/* Actions: Shortlist & View */}
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShortlist(item.id);
                      }}
                      title={isShortlisted ? 'Remove from Shortlist' : 'Bookmark Candidate'}
                      className={`p-2 rounded-xl border transition-colors ${
                        isShortlisted
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900 border-card-border text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => onSelectAthlete(item)}
                      className="p-2 rounded-xl bg-card hover:bg-slate-800 border border-card-border text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
