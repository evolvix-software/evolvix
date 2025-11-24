"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { X } from 'lucide-react';

interface Filters {
  search: string;
  status: 'active' | 'completed' | 'paused' | 'revoked' | 'all';
  graduationStatus: 'not-graduated' | 'graduated' | 'dropped-out' | 'all';
  jobStatus: 'not-placed' | 'placed' | 'all';
  campaign?: string;
  course?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
}

interface ScholarFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

export function ScholarFilters({ filters, onFiltersChange, onClose }: ScholarFiltersProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      graduationStatus: 'all',
      jobStatus: 'all',
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
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Graduation Status</label>
          <select
            value={filters.graduationStatus}
            onChange={(e) => updateFilter('graduationStatus', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All</option>
            <option value="not-graduated">Not Graduated</option>
            <option value="graduated">Graduated</option>
            <option value="dropped-out">Dropped Out</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Job Placement Status</label>
          <select
            value={filters.jobStatus}
            onChange={(e) => updateFilter('jobStatus', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All</option>
            <option value="placed">Placed</option>
            <option value="not-placed">Not Placed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Risk Level</label>
          <select
            value={filters.riskLevel || 'all'}
            onChange={(e) => updateFilter('riskLevel', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
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

