import React from 'react';
import { Search, Filter, Bookmark, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ScoutFilterState } from '../../types';

interface FilterBarProps {
  filters: ScoutFilterState;
  onChange: (filters: ScoutFilterState) => void;
  onReset: () => void;
  totalResults: number;
  shortlistedCount: number;
}

const INDIAN_STATES = [
  'All States',
  'Haryana', 'Kerala', 'Punjab', 'Maharashtra', 'Odisha', 'Manipur',
  'Tamil Nadu', 'Karnataka', 'Assam', 'Telangana', 'Uttar Pradesh',
  'Rajasthan', 'Gujarat', 'Madhya Pradesh', 'West Bengal', 'Jharkhand'
];

const SPORTS_FILTER = [
  'All Sports',
  'Wrestling',
  'Athletics (Sprint/Jump)',
  'Football',
  'Kabaddi',
  'Boxing',
  'Cricket',
  'Hockey',
  'Badminton',
  'Weightlifting'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
  shortlistedCount,
}) => {
  const update = (partial: Partial<ScoutFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className="p-5 rounded-3xl bg-card border border-card-border shadow-xl space-y-4">
      
      {/* Top Row: Search + Quick Toggles + Sort */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search Query Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search athlete name, district, or protocol hash..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-card-border focus:border-brand focus:ring-1 focus:ring-brand text-white placeholder-slate-500 text-sm"
          />
        </div>

        {/* Shortlist Filter Toggle */}
        <button
          type="button"
          onClick={() => update({ onlyShortlisted: !filters.onlyShortlisted })}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            filters.onlyShortlisted
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900/60 border-card-border text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${filters.onlyShortlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>Saved Shortlist ({shortlistedCount})</span>
        </button>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as ScoutFilterState['sortBy'] })}
            className="px-3 py-2.5 rounded-xl bg-slate-900/90 border border-card-border focus:border-brand text-white text-xs font-semibold"
          >
            <option value="percentile_desc">National Percentile (High to Low)</option>
            <option value="percentile_asc">National Percentile (Low to High)</option>
            <option value="reps_desc">Push-Up Rep Count (Max First)</option>
            <option value="date_desc">Latest Verified Assessment</option>
          </select>
        </div>

      </div>

      {/* Filter Row: Sport, State, Min Percentile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-card-border/60">
        
        {/* Sport Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Sport Discipline
          </label>
          <select
            value={filters.sport}
            onChange={(e) => update({ sport: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white text-xs"
          >
            {SPORTS_FILTER.map((s) => (
              <option key={s} value={s === 'All Sports' ? '' : s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            State / Region
          </label>
          <select
            value={filters.state}
            onChange={(e) => update({ state: e.target.value })}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-card-border focus:border-brand text-white text-xs"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s === 'All States' ? '' : s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Min Percentile Filter */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Min Percentile
            </label>
            <span className="text-xs font-mono font-bold text-brand">
              {filters.minPercentile > 0 ? `≥ ${filters.minPercentile}%` : 'All Tiers'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={filters.minPercentile}
            onChange={(e) => update({ minPercentile: Number(e.target.value) })}
            className="w-full accent-brand bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-end justify-between gap-2">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white font-mono">{totalResults}</strong> athletes
          </div>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>

    </div>
  );
};
