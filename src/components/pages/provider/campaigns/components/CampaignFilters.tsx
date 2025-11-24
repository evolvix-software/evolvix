"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { X } from 'lucide-react';

interface Filters {
  search: string;
  status: 'draft' | 'open' | 'closed' | 'completed' | 'cancelled' | 'all';
  campaignType: 'course-specific' | 'pooled' | 'general' | 'all';
  dateRange?: {
    start?: string;
    end?: string;
  };
  linkedCourses?: string[];
}

interface CampaignFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

export function CampaignFilters({
  filters,
  onFiltersChange,
  onClose,
}: CampaignFiltersProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      campaignType: 'all',
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
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Campaign Type Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Campaign Type</label>
          <select
            value={filters.campaignType}
            onChange={(e) => updateFilter('campaignType', e.target.value)}
            className="w-full p-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="course-specific">Course-Specific</option>
            <option value="pooled">Pooled</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              label="Start Date"
              value={filters.dateRange?.start || ''}
              onChange={(e) =>
                updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
            />
            <Input
              type="date"
              label="End Date"
              value={filters.dateRange?.end || ''}
              onChange={(e) =>
                updateFilter('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* Actions */}
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

