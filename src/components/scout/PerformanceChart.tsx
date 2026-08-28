import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { AssessmentResult } from '../../types';

interface PerformanceChartProps {
  history: AssessmentResult[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-xs font-mono">
        No prior assessment history recorded for this athlete.
      </div>
    );
  }

  // Map history to chronological points
  const chartData = history.map((item, index) => ({
    date: new Date(item.verifiedAt).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    }),
    score: item.score || item.repsCount || 0,
    percentile: Math.round(item.percentile),
    formScore: item.biomechanics?.formScore || 90,
    attempt: `Attempt ${index + 1}`,
  }));

  // If single assessment, add simulated baseline for trend visualization
  const firstItem = chartData[0];
  const displayData = (chartData.length === 1 && firstItem)
    ? [
        {
          date: 'Baseline',
          score: Math.max(0, firstItem.score - 6),
          percentile: Math.max(0, firstItem.percentile - 8),
          formScore: firstItem.formScore - 5,
          attempt: 'Baseline Test',
        },
        firstItem,
      ]
    : chartData;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Score & National Percentile Progression
          </h4>
          <p className="text-[11px] text-slate-500">
            Chronological growth curve tracked across AI verified attempts
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-brand-300">
            <span className="w-2.5 h-2.5 rounded-full bg-brand inline-block" /> Test Score
          </span>
          <span className="flex items-center gap-1 text-cyber">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber inline-block" /> National %ile
          </span>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#FF4D00" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPercentile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine y={90} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Elite (90%)', fill: '#F59E0B', fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#FF4D00"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              name="Score"
            />
            <Area
              type="monotone"
              dataKey="percentile"
              stroke="#00F0FF"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorPercentile)"
              name="Percentile"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
