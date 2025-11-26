"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/common/ui/Badge';

export interface JobFilters {
  status: string[];
  employmentType: string[];
  location: string;
  datePosted: string;
  remoteType: string[];
  salaryMin: string;
  salaryMax: string;
  assignedRecruiter?: string;
}

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClearFilters: () => void;
}

const statusOptions = ['active', 'draft', 'closed', 'expired', 'paused'];
const employmentTypeOptions = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
const remoteTypeOptions = ['remote', 'hybrid', 'onsite'];
const dateOptions = ['all', 'last-7-days', 'last-30-days', 'last-90-days', 'custom'];

export function JobFiltersPanel({ filters, onFiltersChange, onClearFilters }: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof JobFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'status' | 'employmentType' | 'remoteType', value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const activeFilterCount = 
    filters.status.length +
    filters.employmentType.length +
    filters.remoteType.length +
    (filters.location ? 1 : 0) +
    (filters.datePosted && filters.datePosted !== 'all' ? 1 : 0) +
    (filters.salaryMin || filters.salaryMax ? 1 : 0);

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleArrayFilter('status', status)}
                className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                  filters.status.includes(status)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Employment Type Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Employment Type
          </label>
          <div className="flex flex-wrap gap-2">
            {employmentTypeOptions.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleArrayFilter('employmentType', type)}
                className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                  filters.employmentType.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-accent'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Location
          </label>
          <Input
            placeholder="Search location..."
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Date Posted Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Date Posted
          </label>
          <select
            value={filters.datePosted}
            onChange={(e) => updateFilter('datePosted', e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            {dateOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All Time' :
                 option === 'last-7-days' ? 'Last 7 Days' :
                 option === 'last-30-days' ? 'Last 30 Days' :
                 option === 'last-90-days' ? 'Last 90 Days' :
                 'Custom Range'}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-border">
            {/* Remote Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Remote Type
              </label>
              <div className="flex flex-wrap gap-2">
                {remoteTypeOptions.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleArrayFilter('remoteType', type)}
                    className={`px-3 py-1 rounded-lg text-sm border transition-colors ${
                      filters.remoteType.includes(type)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.salaryMin}
                  onChange={(e) => updateFilter('salaryMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.salaryMax}
                  onChange={(e) => updateFilter('salaryMax', e.target.value)}
                />
              </div>
            </div>

            {/* Assigned Recruiter Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Assigned Recruiter
              </label>
              <Input
                placeholder="Search recruiter..."
                value={filters.assignedRecruiter || ''}
                onChange={(e) => updateFilter('assignedRecruiter', e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

