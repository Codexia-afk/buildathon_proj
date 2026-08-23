import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Flame, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Info,
  TrendingUp,
  Table as TableIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  ReferenceLine 
} from 'recharts';
import benchmarkDataRaw from '../../data/benchmarks.json';
import { BenchmarkDistribution, Gender } from '../../types';
import { calculatePercentile, getTierBadgeColor } from '../../services/percentileEngine';

const benchmarkData = benchmarkDataRaw as BenchmarkDistribution;

export const PercentileExplorer: React.FC = () => {
  const [age, setAge] = useState<number>(17);
  const [gender, setGender] = useState<Gender>('male');
  const [reps, setReps] = useState<number>(38);

  const percentileResult = useMemo(() => {
    return calculatePercentile(reps, age, gender);
  }, [reps, age, gender]);

  const tierColors = getTierBadgeColor(percentileResult.talentTier);

  // Active bracket stats
  const activeBracket = useMemo(() => {
    return benchmarkData.brackets.find((b) => age >= b.minAge && age <= b.maxAge) || benchmarkData.brackets[1];
  }, [age]);

  const safeGender = gender === 'female' ? 'female' : 'male';
  const bracketStats = activeBracket[safeGender];

  // Cohort distribution chart data
  const chartData = [
    { name: '10th %ile', reps: bracketStats.p10, type: 'benchmark' },
    { name: '25th %ile', reps: bracketStats.p25, type: 'benchmark' },
    { name: '50th (Median)', reps: bracketStats.p50, type: 'benchmark' },
    { name: '75th %ile', reps: bracketStats.p75, type: 'benchmark' },
    { name: '90th (Elite)', reps: bracketStats.p90, type: 'benchmark' },
    { name: '95th (State)', reps: bracketStats.p95, type: 'benchmark' },
    { name: '99th (National)', reps: bracketStats.p99, type: 'benchmark' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-card-border pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <BarChart3 className="w-5 h-5 text-brand" />
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
            Khelo India & SAI Aligned
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
          National Push-Up Percentile Standards
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Explore the exact empirical distribution tables and continuous mathematical interpolation used by TalentLens AI to evaluate grassroots athletes across India.
        </p>
      </div>

      {/* Interactive Calculator Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters Controls */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-card-border shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand" /> Test Calculator Parameters
          </h3>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Gender Cohort
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['male', 'female'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider capitalize transition-all ${
                    gender === g
                      ? 'bg-brand text-white border-brand shadow-glow-brand'
                      : 'bg-slate-900 border-card-border text-slate-400 hover:text-white'
                  }`}
                >
                  {g === 'male' ? 'Male / Boys' : 'Female / Girls'}
                </button>
              ))}
            </div>
          </div>

          {/* Age Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Athlete Age
              </label>
              <span className="font-mono text-sm font-bold text-brand bg-slate-900 px-2.5 py-0.5 rounded-lg border border-card-border">
                {age} Years ({activeBracket.label.split('(')[0].trim()})
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-brand bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Rep Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Push-Up Reps Count
              </label>
              <span className="font-mono text-sm font-bold text-cyber bg-slate-900 px-2.5 py-0.5 rounded-lg border border-card-border">
                {reps} Clean Reps
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="w-full accent-cyber bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Calculation Output Card */}
          <div className={`p-5 rounded-2xl border ${tierColors.bg} ${tierColors.border} ${tierColors.glow} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Calculated Percentile
              </span>
              <span className={`text-xs font-bold ${tierColors.text}`}>
                {percentileResult.talentTier}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-extrabold text-white">
                {percentileResult.percentileRounded}
              </span>
              <span className="text-xl font-display font-bold text-brand">%ile Standing</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {percentileResult.cohortComparisonText}
            </p>
          </div>

        </div>

        {/* Dynamic Chart & Comparison Visual */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-card-border shadow-xl space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyber" /> Cohort Rep Distribution ({activeBracket.label})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target rep thresholds required to hit each national percentile bracket
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={reps}
                  stroke="#FF4D00"
                  strokeWidth={2}
                  label={{ value: `Your Score (${reps})`, fill: '#FF4D00', fontSize: 11, position: 'top' }}
                />
                <Bar dataKey="reps" fill="#334155" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.reps <= reps ? '#00F0FF' : '#1e293b'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs pt-4 border-t border-card-border">
            <div className="p-3 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">50th %ile Median</span>
              <span className="text-base font-mono font-bold text-white">{bracketStats.p50} Reps</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">90th %ile Elite</span>
              <span className="text-base font-mono font-bold text-amber-400">{bracketStats.p90} Reps</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">National Mark (99th)</span>
              <span className="text-base font-mono font-bold text-brand">{bracketStats.p99} Reps</span>
            </div>
          </div>

        </div>

      </div>

      {/* Full Standards Master Table */}
      <div className="p-6 rounded-3xl bg-card border border-card-border shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-cyber" />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Full National Push-Up Percentile Brackets Reference Table
              </h3>
              <p className="text-xs text-slate-400">
                Source: Indian Physical Fitness Norms & Youth Sports Academy Distribution Data
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-card-border bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                <th className="py-3 px-4">Age Bracket</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4 text-center">10th %ile</th>
                <th className="py-3 px-4 text-center">25th %ile</th>
                <th className="py-3 px-4 text-center font-bold text-slate-200">50th (Median)</th>
                <th className="py-3 px-4 text-center">75th %ile</th>
                <th className="py-3 px-4 text-center text-amber-400">90th (Elite)</th>
                <th className="py-3 px-4 text-center text-brand">95th (State)</th>
                <th className="py-3 px-4 text-center text-cyber font-bold">99th (National)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/60">
              {benchmarkData.brackets.map((b) => (
                <React.Fragment key={b.bracketId}>
                  {/* Male Row */}
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-semibold text-white" rowSpan={2}>
                      {b.label}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">Male</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{b.male.p10}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{b.male.p25}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white bg-slate-900/50">{b.male.p50}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">{b.male.p75}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">{b.male.p90}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-brand">{b.male.p95}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cyber">{b.male.p99}</td>
                  </tr>
                  {/* Female Row */}
                  <tr className="border-b border-card-border/80 hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-medium text-slate-300">Female</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{b.female.p10}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{b.female.p25}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white bg-slate-900/50">{b.female.p50}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">{b.female.p75}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">{b.female.p90}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-brand">{b.female.p95}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cyber">{b.female.p99}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
