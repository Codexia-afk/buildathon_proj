import React from 'react';
import { X, Bookmark, Download, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { AssessmentResult } from '../../types';
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
      'PushUp Reps',
      'Duration (sec)',
      'National Percentile',
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
      a.repsCount,
      a.durationSeconds,
      a.percentile,
      a.biomechanics.formScore,
      a.verificationHash,
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
    <div className="fixed inset-0 z-50 overflow-hidden">
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
                No athletes in your shortlist yet. Click the bookmark icon next to any athlete to add them.
              </div>
            ) : (
              shortlistedAssessments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-card-border hover:border-brand/40 transition-all flex items-start justify-between gap-3 group"
                >
                  <div 
                    onClick={() => {
                      onSelectAthlete(a);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm group-hover:text-brand-300 transition-colors">
                        {a.athleteName}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full border border-brand/30">
                        {Math.round(a.percentile)}%ile
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      {a.sport} • {a.state} ({a.district})
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                      <span><strong>{a.repsCount}</strong> reps</span>
                      <span>•</span>
                      <span className="text-emerald-400">{a.biomechanics.formScore}% form</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromShortlist(a.id)}
                    title="Remove from shortlist"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-card-border bg-slate-900/40 space-y-3">
            <Button
              onClick={handleExportCSV}
              disabled={shortlistedAssessments.length === 0}
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Shortlist to CSV
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
