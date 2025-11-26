"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { Bookmark, BookmarkCheck, X, Save, Trash2 } from 'lucide-react';
import { JobFilters } from './JobFilters';
import { cn } from '@/utils';

interface SavedFilter {
  id: string;
  name: string;
  filters: JobFilters;
  createdAt: string;
}

interface SavedFiltersProps {
  filters: JobFilters;
  onApplyFilters: (filters: JobFilters) => void;
}

const STORAGE_KEY = 'employer_saved_filters';

export function SavedFilters({ filters, onApplyFilters }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedFilters(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved filters:', e);
    }
  };

  const saveFilter = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFilterName('');
    setShowSaveDialog(false);
  };

  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const applyFilter = (savedFilter: SavedFilter) => {
    onApplyFilters(savedFilter.filters);
  };

  const activeFilterCount = 
    filters.status.length +
    filters.employmentType.length +
    filters.remoteType.length +
    (filters.location ? 1 : 0) +
    (filters.datePosted && filters.datePosted !== 'all' ? 1 : 0) +
    (filters.salaryMin || filters.salaryMax ? 1 : 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Saved Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="w-4 h-4 mr-1" />
            Save Current
          </Button>
        )}
      </div>

      {showSaveDialog && (
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Input
                placeholder="Filter name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveFilter();
                  } else if (e.key === 'Escape') {
                    setShowSaveDialog(false);
                    setFilterName('');
                  }
                }}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveFilter} disabled={!filterName.trim()}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setFilterName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {savedFilters.length > 0 && (
        <div className="space-y-2">
          {savedFilters.map((savedFilter) => (
            <div
              key={savedFilter.id}
              className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
            >
              <button
                onClick={() => applyFilter(savedFilter)}
                className="flex-1 text-left text-sm text-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-muted-foreground" />
                  <span>{savedFilter.name}</span>
                </div>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteFilter(savedFilter.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {savedFilters.length === 0 && !showSaveDialog && (
        <p className="text-xs text-muted-foreground text-center py-2">
          No saved filters. Save your current filters for quick access.
        </p>
      )}
    </div>
  );
}

