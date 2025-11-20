/**
 * Filter Badges Component - Shows active filters
 */

import { X } from 'lucide-react';
import { Badge } from './Badge';
import { JobFilters } from '@/interfaces/jobs';
import { cn } from '@/utils';

export interface FilterBadgesProps {
  filters: JobFilters;
  onRemoveFilter: (key: keyof JobFilters, value?: any) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterBadges({ filters, onRemoveFilter, onClearAll, className }: FilterBadgesProps) {
  const activeFilters: Array<{ key: keyof JobFilters; label: string; value: any }> = [];
  
  if (filters.search) {
    activeFilters.push({ key: 'search', label: 'Search', value: filters.search });
  }
  
  if (filters.location && filters.location.length > 0) {
    filters.location.forEach(loc => {
      activeFilters.push({ key: 'location', label: 'Location', value: loc });
    });
  }
  
  if (filters.jobType && filters.jobType.length > 0) {
    filters.jobType.forEach(type => {
      activeFilters.push({ key: 'jobType', label: 'Job Type', value: type });
    });
  }
  
  if (filters.company && filters.company.length > 0) {
    filters.company.forEach(comp => {
      activeFilters.push({ key: 'company', label: 'Company', value: comp });
    });
  }
  
  if (filters.experienceLevel && filters.experienceLevel.length > 0) {
    filters.experienceLevel.forEach(level => {
      activeFilters.push({ key: 'experienceLevel', label: 'Experience', value: level });
    });
  }
  
  if (filters.remote !== undefined) {
    activeFilters.push({ key: 'remote', label: 'Remote', value: filters.remote });
  }
  
  if (filters.datePosted && filters.datePosted !== 'all') {
    activeFilters.push({ key: 'datePosted', label: 'Date Posted', value: filters.datePosted });
  }
  
  if (activeFilters.length === 0) return null;
  
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${index}`}
          variant="default"
          className="flex items-center gap-1.5 px-2 py-1"
        >
          <span className="text-xs">
            {filter.label}: {typeof filter.value === 'boolean' 
              ? filter.value ? 'Yes' : 'No'
              : filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key, filter.value)}
            className="hover:bg-muted rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-primary hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

