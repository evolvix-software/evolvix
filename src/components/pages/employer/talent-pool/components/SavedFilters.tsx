"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { X, Save, Filter, Trash2 } from 'lucide-react';

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    searchQuery: string;
    filterTag: string;
    filterInterest: string;
    filterSkills: string;
    filterLocation: string;
    filterExperience: string;
  };
  createdAt: string;
}

interface SavedFiltersProps {
  filters: {
    searchQuery: string;
    filterTag: string;
    filterInterest: string;
    filterSkills: string;
    filterLocation: string;
    filterExperience: string;
  };
  onApplyFilter: (filters: FilterPreset['filters']) => void;
}

export function SavedFilters({ filters, onApplyFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<FilterPreset[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    // Load saved filters from localStorage
    const saved = localStorage.getItem('employer_talent_pool_saved_filters');
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved filters:', e);
      }
    }
  }, []);

  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      alert('Please enter a name for this filter');
      return;
    }

    const hasActiveFilters = Object.values(filters).some(v => v && v.trim() !== '');
    if (!hasActiveFilters) {
      alert('Please set some filters before saving');
      return;
    }

    const newFilter: FilterPreset = {
      id: `filter-${Date.now()}`,
      name: filterName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('employer_talent_pool_saved_filters', JSON.stringify(updated));
    setFilterName('');
    setShowSaveDialog(false);
  };

  const applyFilter = (preset: FilterPreset) => {
    onApplyFilter(preset.filters);
  };

  const deleteFilter = (id: string) => {
    if (confirm('Are you sure you want to delete this saved filter?')) {
      const updated = savedFilters.filter(f => f.id !== id);
      setSavedFilters(updated);
      localStorage.setItem('employer_talent_pool_saved_filters', JSON.stringify(updated));
    }
  };

  const getFilterSummary = (preset: FilterPreset) => {
    const activeFilters: string[] = [];
    if (preset.filters.searchQuery) activeFilters.push(`Search: "${preset.filters.searchQuery}"`);
    if (preset.filters.filterTag) activeFilters.push(`Tag: ${preset.filters.filterTag}`);
    if (preset.filters.filterInterest) activeFilters.push(`Interest: ${preset.filters.filterInterest}`);
    if (preset.filters.filterSkills) activeFilters.push(`Skills: ${preset.filters.filterSkills}`);
    if (preset.filters.filterLocation) activeFilters.push(`Location: ${preset.filters.filterLocation}`);
    return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Saved Filters</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSaveDialog(true)}
          disabled={!Object.values(filters).some(v => v && v.trim() !== '')}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Current
        </Button>
      </div>

      {showSaveDialog && (
        <Card className="border border-border bg-muted/30">
          <CardContent className="p-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Filter Name
              </label>
              <Input
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="e.g., Frontend Developers in SF"
                onKeyPress={(e) => e.key === 'Enter' && saveCurrentFilter()}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setShowSaveDialog(false);
                setFilterName('');
              }} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveCurrentFilter} className="flex-1 bg-gradient-to-r from-primary to-purple-600">
                Save Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {savedFilters.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No saved filters</p>
          <p className="text-xs mt-1">Set filters and click "Save Current" to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedFilters.map((preset) => (
            <div
              key={preset.id}
              className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => applyFilter(preset)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{preset.name}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {getFilterSummary(preset)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFilter(preset.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

