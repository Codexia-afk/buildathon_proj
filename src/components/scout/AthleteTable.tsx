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
  Sparkles
} from 'lucide-react';
import { AssessmentResult } from '../../types';
import { getTierBadgeColor } from '../../services/percentileEngine';

interface AthleteTableProps {
  assessments: AssessmentResult[];
  onSelectAthlete: (assessment: AssessmentResult) => void;
  onToggleShortlist: (assessmentId: string) => void;
  newAssessmentIds?: Set<string>;
}

export const AthleteTable: React.FC<AthleteTableProps> = ({
  assessments,
  onSelectAthlete,
  onToggleShortlist,
  newAssessmentIds = new Set(),
}) => {
  if (assessments.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-card border border-card-border space-y-3">
        <Activity className="w-10 h-10 text-slate-500 mx-auto" />
        <h4 className="text-base font-bold text-white">No Matching Athlete Assessments Found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try loosening your filter parameters (State, Sport, Min Percentile) or submit a new push-up assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-card border border-card-border shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-card-border bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            <th className="py-4 px-5">Athlete & Location</th>
            <th className="py-4 px-4">Sport Discipline</th>
            <th className="py-4 px-4 text-center">Score (Reps)</th>
            <th className="py-4 px-4 text-center">National %ile</th>
            <th className="py-4 px-4 text-center">Form Quality</th>
            <th className="py-4 px-4">Verified Date</th>
            <th className="py-4 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60 text-xs">
          {assessments.map((item) => {
            const isNew = newAssessmentIds.has(item.id);
            const isShortlisted = (item.shortlistedBy || []).includes('scout_default');
            const tierColors = getTierBadgeColor(item.talentTier);

            return (
              <tr
                key={item.id}
                onClick={() => onSelectAthlete(item)}
                className={`group hover:bg-card-hover/80 cursor-pointer transition-all duration-200 ${
                  isNew ? 'bg-brand-500/10 animate-pulse' : ''
                }`}
              >
                {/* Athlete Name & Location */}
                <td className="py-4 px-5">
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

                {/* Sport */}
                <td className="py-4 px-4 font-medium text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-card-border text-[11px] text-slate-200 font-semibold whitespace-nowrap">
                    {item.sport}
                  </span>
                </td>

                {/* Reps Score */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="font-display font-extrabold text-xl text-white tracking-tight">
                      {item.repsCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 -mt-1">
                      {item.durationSeconds}s
                    </span>
                  </div>
                </td>

                {/* National Percentile */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono ${tierColors.bg} ${tierColors.text} ${tierColors.border}`}>
                      {Math.round(item.percentile)}%ile
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 max-w-[120px] truncate">
                      {item.talentTier.split('(')[0]}
                    </span>
                  </div>
                </td>

                {/* Form Quality */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{item.biomechanics.formScore}%</span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                  {new Date(item.verifiedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleShortlist(item.id)}
                      title={isShortlisted ? 'Remove from shortlist' : 'Save to shortlist'}
                      className={`p-2 rounded-xl border transition-all ${
                        isShortlisted
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-slate-900 border-card-border text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {isShortlisted ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onSelectAthlete(item)}
                      className="p-2 rounded-xl bg-slate-900 border border-card-border text-slate-400 hover:text-white group-hover:border-brand/40 group-hover:text-brand transition-colors"
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
