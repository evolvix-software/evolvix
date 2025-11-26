"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { X, Filter, Save } from 'lucide-react';
import { cn } from '@/utils';
import { PipelineStageType } from './PipelineStage';

export interface ApplicantFilters {
  stage?: PipelineStageType[];
  matchScoreMin?: number;
  matchScoreMax?: number;
  dateAppliedFrom?: string;
  dateAppliedTo?: string;
  assignedRecruiter?: string[];
  location?: string[];
  experienceLevel?: string[];
  skills?: string[];
  tags?: string[];
}

interface FiltersPanelProps {
  filters: ApplicantFilters;
  onFiltersChange: (filters: ApplicantFilters) => void;
  onClose: () => void;
  onSavePreset?: (name: string) => void;
  availableRecruiters?: string[];
  availableLocations?: string[];
  availableSkills?: string[];
  availableTags?: string[];
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  onClose,
  onSavePreset,
  availableRecruiters = [],
  availableLocations = [],
  availableSkills = [],
  availableTags = [],
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<ApplicantFilters>(filters);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  const updateFilter = (key: keyof ApplicantFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (key: keyof ApplicantFilters) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(localFilters).length;

  const handleSavePreset = () => {
    if (presetName && onSavePreset) {
      onSavePreset(presetName);
      setShowSavePreset(false);
      setPresetName('');
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="primary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {onSavePreset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSavePreset(true)}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSavePreset && (
          <div className="flex gap-2 p-3 bg-muted rounded-lg">
            <Input
              placeholder="Preset name..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSavePreset}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSavePreset(false)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Pipeline Stage */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Pipeline Stage
          </label>
          <div className="flex flex-wrap gap-2">
            {(['new', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'] as PipelineStageType[]).map((stage) => (
              <Button
                key={stage}
                variant={localFilters.stage?.includes(stage) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const stages = localFilters.stage || [];
                  const newStages = stages.includes(stage)
                    ? stages.filter(s => s !== stage)
                    : [...stages, stage];
                  updateFilter('stage', newStages.length > 0 ? newStages : undefined);
                }}
                className="capitalize"
              >
                {stage}
              </Button>
            ))}
          </div>
        </div>

        {/* Match Score Range */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Match Score
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              min={0}
              max={100}
              value={localFilters.matchScoreMin || ''}
              onChange={(e) => updateFilter('matchScoreMin', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              min={0}
              max={100}
              value={localFilters.matchScoreMax || ''}
              onChange={(e) => updateFilter('matchScoreMax', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-24"
            />
            {(localFilters.matchScoreMin || localFilters.matchScoreMax) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilter('matchScoreMin');
                  clearFilter('matchScoreMax');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Date Applied */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Date Applied
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={localFilters.dateAppliedFrom || ''}
              onChange={(e) => updateFilter('dateAppliedFrom', e.target.value || undefined)}
              className="flex-1"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="date"
              value={localFilters.dateAppliedTo || ''}
              onChange={(e) => updateFilter('dateAppliedTo', e.target.value || undefined)}
              className="flex-1"
            />
            {(localFilters.dateAppliedFrom || localFilters.dateAppliedTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilter('dateAppliedFrom');
                  clearFilter('dateAppliedTo');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Assigned Recruiter */}
        {availableRecruiters.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Assigned Recruiter
            </label>
            <div className="flex flex-wrap gap-2">
              {availableRecruiters.map((recruiter) => (
                <Button
                  key={recruiter}
                  variant={localFilters.assignedRecruiter?.includes(recruiter) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const recruiters = localFilters.assignedRecruiter || [];
                    const newRecruiters = recruiters.includes(recruiter)
                      ? recruiters.filter(r => r !== recruiter)
                      : [...recruiters, recruiter];
                    updateFilter('assignedRecruiter', newRecruiters.length > 0 ? newRecruiters : undefined);
                  }}
                >
                  {recruiter}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {availableLocations.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Location
            </label>
            <div className="flex flex-wrap gap-2">
              {availableLocations.map((location) => (
                <Button
                  key={location}
                  variant={localFilters.location?.includes(location) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const locations = localFilters.location || [];
                    const newLocations = locations.includes(location)
                      ? locations.filter(l => l !== location)
                      : [...locations, location];
                    updateFilter('location', newLocations.length > 0 ? newLocations : undefined);
                  }}
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {availableSkills.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <Button
                  key={skill}
                  variant={localFilters.skills?.includes(skill) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const skills = localFilters.skills || [];
                    const newSkills = skills.includes(skill)
                      ? skills.filter(s => s !== skill)
                      : [...skills, skill];
                    updateFilter('skills', newSkills.length > 0 ? newSkills : undefined);
                  }}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {availableTags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  variant={localFilters.tags?.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const tags = localFilters.tags || [];
                    const newTags = tags.includes(tag)
                      ? tags.filter(t => t !== tag)
                      : [...tags, tag];
                    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <div className="pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

