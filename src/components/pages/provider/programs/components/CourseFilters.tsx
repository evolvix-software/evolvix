"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { X } from 'lucide-react';

interface Filters {
  search: string;
  status: 'upcoming' | 'live' | 'completed' | 'all';
  scholarshipFilter: 'with-slots' | 'without-slots' | 'all';
  mentor?: string;
  duration?: string;
  mode?: 'recorded' | 'live' | 'hybrid' | 'all';
}

interface CourseFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

export function CourseFilters({ filters, onFiltersChange, onClose }: CourseFiltersProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      scholarshipFilter: 'all',
      mode: 'all',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Course Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Delivery Mode</label>
          <select
            value={filters.mode || 'all'}
            onChange={(e) => updateFilter('mode', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Modes</option>
            <option value="recorded">Recorded</option>
            <option value="live">Live</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Clear Filters
          </Button>
          <Button onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

