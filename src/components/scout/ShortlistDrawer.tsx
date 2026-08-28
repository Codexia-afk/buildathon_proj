import React from 'react';
import { X, Bookmark, Download, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { AssessmentResult } from '../../types';
import { EXERCISE_CONFIGS, getTierBadgeColor } from '../../services/percentileEngine';
import { Button } from '../common/Button';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedAssessments: AssessmentResult[];
  onSelectAthlete: (assessment: AssessmentResult) => void;
  onRemoveFromShortlist: (assessmentId: string) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistedAssessments,
  onSelectAthlete,
  onRemoveFromShortlist,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (shortlistedAssessments.length === 0) return;

    const headers = [
      'Athlete Name',
      'Age',
      'Gender',
      'Sport',
      'State',
      'District',
      'Test Type',
      'Score',
      'Duration (sec)',
      'National Percentile',
      'Talent Tier',
      'Form Score (%)',
      'Verification Hash',
      'Date',
    ];

    const rows = shortlistedAssessments.map((a) => [
      `"${a.athleteName}"`,
      a.age,
      a.gender,
      `"${a.sport}"`,
      `"${a.state}"`,
      `"${a.district}"`,
      `"${a.testType}"`,
      a.score,
      a.durationSeconds,
      a.percentile,
      `"${a.talentTier}"`,
      a.biomechanics.formScore,
      `"${a.verificationHash}"`,
      `"${a.verifiedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `talentlens_shortlisted_prospects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-card-border shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-card-border flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Scout Shortlist</h3>
                <p className="text-xs text-slate-400">
                  {shortlistedAssessments.length} Athletes Bookmarked
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {shortlistedAssessments.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No athletes added to shortlist yet. Click the bookmark icon next to an athlete in the discovery feed.
              </div>
            ) : (
              shortlistedAssessments.map((athlete) => {
                const config = EXERCISE_CONFIGS[athlete.testType] || EXERCISE_CONFIGS.pushups_standard;
                const tierStyle = getTierBadgeColor(athlete.talentTier);

                return (
                  <div
                    key={athlete.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-card-border hover:border-slate-600 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{athlete.athleteName}</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {athlete.sport} · {athlete.state} ({athlete.age}y)
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveFromShortlist(athlete.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove from shortlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-card-border/50">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          {config.shortName}
                        </span>
                        <span className="font-bold text-white font-mono">
                          {athlete.score} {config.unit}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">
                          Percentile
                        </span>
                        <span className="font-bold text-brand font-mono text-sm">
                          {Math.round(athlete.percentile)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                        {athlete.talentTier.split(' (')[0]}
                      </span>

                      <button
                        onClick={() => {
                          onSelectAthlete(athlete);
                          onClose();
                        }}
                        className="text-xs font-semibold text-brand hover:text-brand-400 flex items-center gap-1"
                      >
                        <span>Inspect Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          {shortlistedAssessments.length > 0 && (
            <div className="p-6 border-t border-card-border bg-slate-900/60">
              <Button
                onClick={handleExportCSV}
                variant="primary"
                className="w-full"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export Shortlist to CSV
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
