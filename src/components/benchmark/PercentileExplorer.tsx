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
  Table as TableIcon,
  Activity
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
import { BenchmarkDistribution, Gender, TestType } from '../../types';
import { calculatePercentile, getTierBadgeColor, EXERCISE_CONFIGS } from '../../services/percentileEngine';

export const PercentileExplorer: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestType>('pushups_standard');
  const [age, setAge] = useState<number>(17);
  const [gender, setGender] = useState<Gender>('male');
  const [score, setScore] = useState<number>(38);

  const testConfig = EXERCISE_CONFIGS[selectedTest] || EXERCISE_CONFIGS.pushups_standard;
  const testDist = (benchmarkDataRaw.tests as Record<string, BenchmarkDistribution>)[selectedTest] || benchmarkDataRaw.tests.pushups_standard;

  const percentileResult = useMemo(() => {
    return calculatePercentile(score, age, gender, selectedTest);
  }, [score, age, gender, selectedTest]);

  const tierColors = getTierBadgeColor(percentileResult.talentTier);

  // Active bracket stats
  const activeBracket = useMemo(() => {
    return testDist.brackets.find((b) => age >= b.minAge && age <= b.maxAge) || testDist.brackets[1];
  }, [testDist, age]);

  const safeGender = gender === 'female' ? 'female' : 'male';
  const bracketStats = activeBracket[safeGender];

  // Cohort distribution chart data
  const chartData = [
    { name: '10th %ile', score: bracketStats.p10, type: 'benchmark' },
    { name: '25th %ile', score: bracketStats.p25, type: 'benchmark' },
    { name: '50th (Median)', score: bracketStats.p50, type: 'benchmark' },
    { name: '75th %ile', score: bracketStats.p75, type: 'benchmark' },
    { name: '90th (Elite)', score: bracketStats.p90, type: 'benchmark' },
    { name: '95th (State)', score: bracketStats.p95, type: 'benchmark' },
    { name: '99th (National)', score: bracketStats.p99, type: 'benchmark' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="border-b border-card-border pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <BarChart3 className="w-5 h-5 text-brand" />
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
            Khelo India & SAI Aligned Standards
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide uppercase">
          National Athletic Percentile Standards
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Explore the exact empirical distribution curves and mathematical percentile engine used by TalentLens AI to benchmark grassroots athletes across India.
        </p>
      </div>

      {/* Test Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(EXERCISE_CONFIGS) as TestType[]).map((key) => {
          const cfg = EXERCISE_CONFIGS[key];
          const isSelected = selectedTest === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedTest(key);
                if (key === 'pushups_standard') setScore(38);
                else if (key === 'squats_standard') setScore(55);
                else if (key === 'plank_hold') setScore(120);
                else if (key === 'vertical_jump') setScore(55);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-card border-brand/60 shadow-[0_0_20px_rgba(255,77,0,0.18)] text-white'
                  : 'bg-card/40 border-card-border hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-brand block w-fit mb-2">
                {cfg.category}
              </span>
              <h3 className="text-sm font-bold text-white">{cfg.name}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">Unit: {cfg.unit}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Calculator Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters Controls */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-card-border shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand" /> Interactive Simulator Calculator
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
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Athlete Age: <span className="text-white font-mono text-sm">{age} Years Old</span>
              </label>
              <span className="text-xs font-mono text-brand font-bold">
                {activeBracket.label}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-brand bg-slate-800 h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Score Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {testConfig.metricLabel}: <span className="text-white font-mono text-lg font-bold">{score} {testConfig.unit}</span>
              </label>
            </div>
            <input
              type="range"
              min="1"
              max={testConfig.unit === 'seconds' ? 300 : testConfig.unit === 'cm' ? 100 : 100}
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full accent-brand bg-slate-800 h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Dynamic Comparison Card */}
          <div className={`p-5 rounded-2xl border ${tierColors.bg} ${tierColors.border} ${tierColors.glow} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Calculated Placement
              </span>
              <span className={`text-xs font-bold ${tierColors.text}`}>
                {percentileResult.talentTier}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-display font-extrabold text-white">
                {percentileResult.percentileRounded}%
              </span>
              <span className="text-xs font-mono text-slate-300">National Percentile</span>
            </div>

            <p className="text-xs text-slate-300">
              {percentileResult.cohortComparisonText}
            </p>
          </div>

        </div>

        {/* Chart & Distribution Analysis */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-card-border shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-card-border pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wide">
                {activeBracket.label} Empirical Cohort Curve
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {safeGender.toUpperCase()} Division · National Record: {bracketStats.nationalRecord} {testConfig.unit}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block font-mono">Median (50th)</span>
              <span className="text-base font-bold text-cyber font-mono">{bracketStats.p50} {testConfig.unit}</span>
            </div>
          </div>

          {/* Recharts Bar Graph */}
          <div className="h-64 w-full p-2 bg-slate-950/60 rounded-2xl border border-card-border">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070A11',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score <= score ? '#FF4D00' : '#1e293b'}
                      stroke={entry.score <= score ? '#FF6E2E' : '#334155'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Empirical Benchmark Table */}
          <div className="overflow-x-auto rounded-2xl border border-card-border">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 border-b border-card-border text-[11px] text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Bracket</th>
                  <th className="py-2.5 px-2 text-center">P10</th>
                  <th className="py-2.5 px-2 text-center">P25</th>
                  <th className="py-2.5 px-2 text-center text-cyber font-bold">P50 (Median)</th>
                  <th className="py-2.5 px-2 text-center">P75</th>
                  <th className="py-2.5 px-2 text-center text-amber-400 font-bold">P90 (Elite)</th>
                  <th className="py-2.5 px-2 text-center text-brand font-bold">P99</th>
                  <th className="py-2.5 px-2 text-right">Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/60 text-slate-300">
                {testDist.brackets.map((b) => {
                  const s = b[safeGender];
                  const isActive = b.bracketId === activeBracket.bracketId;
                  return (
                    <tr key={b.bracketId} className={isActive ? 'bg-brand/10 font-bold text-white' : ''}>
                      <td className="py-2.5 px-3 whitespace-nowrap">{b.label}</td>
                      <td className="py-2.5 px-2 text-center">{s.p10}</td>
                      <td className="py-2.5 px-2 text-center">{s.p25}</td>
                      <td className="py-2.5 px-2 text-center text-cyber">{s.p50}</td>
                      <td className="py-2.5 px-2 text-center">{s.p75}</td>
                      <td className="py-2.5 px-2 text-center text-amber-400">{s.p90}</td>
                      <td className="py-2.5 px-2 text-center text-brand">{s.p99}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-emerald-400">{s.nationalRecord}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
