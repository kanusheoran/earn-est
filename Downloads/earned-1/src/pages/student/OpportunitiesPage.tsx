import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../../components/features/OpportunityCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const OpportunitiesPage: React.FC = () => {
  const { opportunities, checkStudentEligibility, currentStudent } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    return Array.from(new Set(opportunities.map(o => o.category)));
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.status !== 'Published') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchOrg = opp.organizationName.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg) return false;
      }

      if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
        return false;
      }

      if (onlyEligible) {
        const el = checkStudentEligibility(opp, currentStudent);
        if (!el.canApply) return false;
      }

      return true;
    });
  }, [opportunities, searchQuery, selectedCategory, onlyEligible, currentStudent, checkStudentEligibility]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          Explore Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Browse paid projects that fit your skills and schedule.
        </p>
      </div>

      {/* 2. One Search Bar & Compact Filter Control */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full rounded-2xl border border-lavender-200 px-4 py-2.5 pl-10 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
            />
            <Search className="w-4 h-4 text-mutedGray absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-mutedGray hover:text-charcoal-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
              showFilters || selectedCategory !== 'All' || onlyEligible
                ? 'bg-lavender-100 border-plum-300 text-plum-900 font-semibold'
                : 'bg-white border-lavender-200 text-charcoal-800 hover:bg-ivory-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Compact Expandable Filters */}
        {showFilters && (
          <div className="p-3 rounded-2xl bg-white border border-lavender-200 flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-mutedGray font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-lavender-200 px-2.5 py-1 text-xs bg-white text-charcoal-800"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-charcoal-800">
              <input
                type="checkbox"
                checked={onlyEligible}
                onChange={(e) => setOnlyEligible(e.target.checked)}
                className="rounded text-plum-600 focus:ring-plum-400"
              />
              <span>Only eligible opportunities</span>
            </label>

            {(selectedCategory !== 'All' || onlyEligible) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setOnlyEligible(false);
                }}
                className="text-xs text-mutedGray hover:text-plum-700 underline ml-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Clean Two-Column Card Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No opportunities found"
          description="Try clearing your search or filters to see all available opportunities."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setOnlyEligible(false);
          }}
        />
      )}

    </div>
  );
};
