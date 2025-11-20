"use client";

import { Search, X, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/common/forms/Button';
import { categories, levels, skills } from '@/data/mock/coursesData';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setFilters, setSortBy, setViewMode } from '@/store/features/courses/coursesSlice';
import { useState } from 'react';
import { Course } from '@/data/mock/coursesData';

export function EnhancedCourseFilters() {
  const dispatch = useAppDispatch();
  const { filters, sortBy, viewMode, courses } = useAppSelector(state => state.courses);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique mentors from courses
  const mentors = Array.from(
    new Set(courses.map(c => c.instructor.id))
  ).map(id => {
    const course = courses.find(c => c.instructor.id === id);
    return course ? { id: course.instructor.id, name: course.instructor.name } : null;
  }).filter(Boolean) as Array<{ id: string; name: string }>;

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [type]: value }));
  };

  const clearFilters = () => {
    dispatch(setFilters({ 
      category: 'all', 
      level: 'all', 
      skill: '', 
      searchQuery: '',
      price: 'all',
      rating: 'all',
      duration: 'all',
      mentor: 'all'
    }));
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.level !== 'all' || 
    filters.skill !== '' || 
    filters.searchQuery !== '' ||
    filters.price !== 'all' ||
    filters.rating !== 'all' ||
    filters.duration !== 'all' ||
    filters.mentor !== 'all';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search courses by name, skill, or category..."
          value={filters.searchQuery}
          onChange={(e) => dispatch(setFilters({ searchQuery: e.target.value }))}
          className="w-full pl-12 pr-10 py-3 bg-card dark:bg-card border border-slate-300 dark:border-border rounded-lg text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => dispatch(setFilters({ searchQuery: '' }))}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={filters.level}
          onChange={(e) => handleFilterChange('level', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          {levels.map(level => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>

        {/* Skill Filter */}
        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange('skill', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          <option value="">All Skills</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={filters.price}
          onChange={(e) => handleFilterChange('price', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          <option value="all">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        {/* Rating Filter */}
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          <option value="all">All Ratings</option>
          <option value="4+">4+ Stars</option>
          <option value="4.5+">4.5+ Stars</option>
        </select>

        {/* Duration Filter */}
        <select
          value={filters.duration}
          onChange={(e) => handleFilterChange('duration', e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          <option value="all">All Durations</option>
          <option value="short">Short (&lt; 5 hours)</option>
          <option value="medium">Medium (5-20 hours)</option>
          <option value="long">Long (&gt; 20 hours)</option>
        </select>

        {/* Mentor Filter */}
        {mentors.length > 0 && (
          <select
            value={filters.mentor}
            onChange={(e) => handleFilterChange('mentor', e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
          >
            <option value="all">All Mentors</option>
            {mentors.map(mentor => (
              <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
            ))}
          </select>
        )}

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="px-4 py-2 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="duration-short">Duration: Shortest</option>
          <option value="duration-long">Duration: Longest</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 border border-slate-300 dark:border-border rounded-lg p-1 bg-card dark:bg-card">
          <button
            onClick={() => dispatch(setViewMode('grid'))}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary dark:bg-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-secondary'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(setViewMode('list'))}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary dark:bg-primary text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-secondary'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}

