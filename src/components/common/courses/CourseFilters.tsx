"use client";

import { Search, X } from 'lucide-react';
import { Button } from '@/components/common/forms/Button';
import { categories, levels, skills } from '@/data/mock/coursesData';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setFilters } from '@/store/features/courses/coursesSlice';
import { useState } from 'react';

export function CourseFilters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(state => state.courses);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleFilterChange = (type: 'category' | 'level' | 'skill', value: string) => {
    dispatch(setFilters({ [type]: value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({ category: 'all', level: 'all', skill: '', searchQuery: '' }));
  };

  const hasActiveFilters = filters.category !== 'all' || filters.level !== 'all' || filters.skill !== '' || filters.searchQuery !== '';

  return (
    <div className="space-y-4">
      {/* Search Bar - More Compact */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses by name, skill, or category..."
          value={filters.searchQuery}
          onChange={(e) => dispatch(setFilters({ searchQuery: e.target.value }))}
          className="w-full pl-12 pr-10 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => dispatch(setFilters({ searchQuery: '' }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Compact Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>

        <select
          value={filters.level}
          onChange={(e) => handleFilterChange('level', e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>

        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange('skill', e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="">All Skills</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        {/* Clear Filters Button - Compact */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
