import React from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  Zap, 
  Download, 
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { AssessmentResult } from '../../types';
import { EXERCISE_CONFIGS, getTierBadgeColor } from '../../services/percentileEngine';
import { Button } from '../common/Button';

interface AthleteComparisonModalProps {
  athletes: AssessmentResult[];
  onClose: () => void;
  onClear: () => void;
}

export const AthleteComparisonModal: React.FC<AthleteComparisonModalProps> = ({
  athletes,
  onClose,
  onClear,
}) => {
  if (athletes.length < 2) return null;

  const exportComparisonCSV = () => {
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
      'Form Score',
      'Trunk Alignment',
      'Verification Hash',
    ];

    const rows = athletes.map((a) => [
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
      a.biomechanics.averageTrunkAlignment,
      `"${a.verificationHash}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TalentLens_Comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Comparative Radar Data
  const radarMetrics = [
    { metric: 'National Percentile', key: 'percentile' },
    { metric: 'Form Precision', key: 'formScore' },
    { metric: 'Core Stability', key: 'stability' },
    { metric: 'Movement Velocity', key: 'velocity' },
    { metric: 'Relative Power', key: 'power' },
  ];

  const radarData = radarMetrics.map((m) => {
    const point: Record<string, string | number> = { subject: m.metric };
    athletes.forEach((a, idx) => {
      const athleteKey = `athlete_${idx}`;
      if (m.key === 'percentile') point[athleteKey] = a.percentile;
      else if (m.key === 'formScore') point[athleteKey] = a.biomechanics.formScore;
      else if (m.key === 'stability') point[athleteKey] = Math.min(100, Math.round((a.biomechanics.averageTrunkAlignment / 180) * 100));
      else if (m.key === 'velocity') point[athleteKey] = Math.min(100, Math.round((a.biomechanics.cadenceRepsPerMin || 30) * 2));
      else point[athleteKey] = Math.min(100, a.score * 2);
    });
    return point;
  });

  const athleteColors = ['#FF4D00', '#00F0FF', '#10B981'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-950 rounded-3xl border border-card-border shadow-2xl overflow-hidden my-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-card-border bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyber/20 border border-cyber/40 flex items-center justify-center text-cyber">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                Head-to-Head Scout Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Comparing {athletes.length} shortlisted prospects side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={exportComparisonCSV}
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Comparison (CSV)
            </Button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-card border border-card-border text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Side-by-Side Athlete Dossiers */}
          <div className={`grid grid-cols-1 md:grid-cols-${athletes.length} gap-4`}>
            {athletes.map((athlete, idx) => {
              const config = EXERCISE_CONFIGS[athlete.testType] || EXERCISE_CONFIGS.pushups_standard;
              const tierStyle = getTierBadgeColor(athlete.talentTier);
              const color = athleteColors[idx % athleteColors.length];

              return (
                <div 
                  key={athlete.id}
                  className="p-5 rounded-2xl bg-card border border-card-border relative overflow-hidden space-y-4 shadow-lg"
                  style={{ borderColor: `${color}40` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base"
                        style={{ backgroundColor: `${color}30`, border: `1.5px solid ${color}` }}
                      >
                        {athlete.athleteName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{athlete.athleteName}</h3>
                        <p className="text-xs text-slate-400 font-mono">{athlete.district}, {athlete.state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-card-border/60 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sport:</span>
                      <span className="font-semibold text-white">{athlete.sport}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Assessment:</span>
                      <span className="font-mono text-brand font-bold">{config.shortName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Score:</span>
                      <span className="font-mono text-white font-bold">{athlete.score} {config.unit}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">National Percentile:</span>
                      <span className="font-mono text-base font-extrabold text-brand">
                        {Math.round(athlete.percentile)}%
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Form Quality:</span>
                      <span className="font-mono text-emerald-400 font-bold">{athlete.biomechanics.formScore}%</span>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-xl border text-center text-[10px] font-bold ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                    {athlete.talentTier}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Biometric Comparison Radar Chart */}
          <div className="p-5 rounded-2xl bg-card border border-card-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyber" /> Multilateral Biomechanical Comparison Radar
              </span>
              <div className="flex items-center gap-3 text-xs font-mono">
                {athletes.map((a, idx) => (
                  <span key={a.id} className="flex items-center gap-1.5" style={{ color: athleteColors[idx] }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: athleteColors[idx] }} />
                    {a.athleteName.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                  {athletes.map((a, idx) => (
                    <Radar
                      key={a.id}
                      name={a.athleteName}
                      dataKey={`athlete_${idx}`}
                      stroke={athleteColors[idx]}
                      fill={athleteColors[idx]}
                      fillOpacity={0.25}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-card-border flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Clear Selected Comparison
          </button>

          <Button onClick={onClose} variant="secondary" size="sm">
            Close Matrix
          </Button>
        </div>

      </div>
    </div>
  );
};
