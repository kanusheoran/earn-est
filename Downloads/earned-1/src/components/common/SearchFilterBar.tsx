import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  selectedArrangement: string;
  onArrangementChange: (arr: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  showEligibilityFilter?: boolean;
  onlyEligible?: boolean;
  onOnlyEligibleToggle?: (val: boolean) => void;
  onResetFilters?: () => void;
  placeholder?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedArrangement,
  onArrangementChange,
  sortBy,
  onSortChange,
  showEligibilityFilter = true,
  onlyEligible = false,
  onOnlyEligibleToggle,
  onResetFilters,
  placeholder = 'Search by project title, skill, or organization...',
}) => {
  return (
    <div className="card-subtle rounded-3xl p-4 bg-white border border-lavender-200/90 space-y-3">
      {/* Search Input Row */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-lavender-200 px-4 py-3 pl-11 text-xs text-charcoal-900 placeholder:text-mutedGray focus:outline-none focus:ring-2 focus:ring-plum-400 bg-ivory-50/60"
        />
        <Search className="w-5 h-5 text-plum-500 absolute left-3.5 top-3.5" />
      </div>

      {/* Filter Chips & Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Work Arrangement */}
          <select
            value={selectedArrangement}
            onChange={(e) => onArrangementChange(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
          >
            <option value="All">All Arrangements</option>
            <option value="Remote">Remote</option>
            <option value="On-Campus">On-Campus</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="compensation_high">Compensation: High to Low</option>
            <option value="hours_low">Hours: Low to High</option>
            <option value="deadline">Deadline: Soonest</option>
          </select>

          {/* Eligibility Toggle */}
          {showEligibilityFilter && onOnlyEligibleToggle && (
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-lavender-200 bg-ivory-50 text-xs font-semibold text-charcoal-800 cursor-pointer select-none hover:bg-lavender-50">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => onOnlyEligibleToggle(e.target.checked)}
                className="rounded text-plum-600 focus:ring-plum-400"
              />
              <span>Only show eligible</span>
            </label>
          )}
        </div>

        {/* Reset button */}
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-mutedGray hover:text-plum-600 transition-colors p-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
