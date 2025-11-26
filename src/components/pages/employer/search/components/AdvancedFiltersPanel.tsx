"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Input } from '@/components/common/forms/Input';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Languages,
  Award,
  Tag,
  Building2
} from 'lucide-react';
import { SearchFilters } from '../types';
import { cn } from '@/utils';

interface AdvancedFiltersPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export function AdvancedFiltersPanel({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['skills', 'experience']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const addSkill = (skill: string) => {
    if (skill && !filters.skills?.includes(skill)) {
      updateFilters({ skills: [...(filters.skills || []), skill] });
    }
  };

  const removeSkill = (skill: string) => {
    updateFilters({ skills: filters.skills?.filter(s => s !== skill) || [] });
  };

  const addTag = (tag: string) => {
    if (tag && !filters.tags?.includes(tag)) {
      updateFilters({ tags: [...(filters.tags || []), tag] });
    }
  };

  const removeTag = (tag: string) => {
    updateFilters({ tags: filters.tags?.filter(t => t !== tag) || [] });
  };

  const addLanguage = (lang: string) => {
    if (lang && !filters.languages?.includes(lang)) {
      updateFilters({ languages: [...(filters.languages || []), lang] });
    }
  };

  const removeLanguage = (lang: string) => {
    updateFilters({ languages: filters.languages?.filter(l => l !== lang) || [] });
  };

  const toggleAvailability = (availability: string) => {
    const current = filters.availability || [];
    if (current.includes(availability)) {
      updateFilters({ availability: current.filter(a => a !== availability) });
    } else {
      updateFilters({ availability: [...current, availability] });
    }
  };

  const filterCount = [
    filters.skills?.length || 0,
    filters.experience ? 1 : 0,
    filters.location ? 1 : 0,
    filters.remote ? 1 : 0,
    filters.availability?.length || 0,
    filters.education?.length || 0,
    filters.salaryRange ? 1 : 0,
    filters.tags?.length || 0,
    filters.languages?.length || 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {filterCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="primary">{filterCount}</Badge>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('skills')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Skills</CardTitle>
              {filters.skills && filters.skills.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.skills.length}</Badge>
              )}
            </div>
            {expandedSections.has('skills') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('skills') && (
          <CardContent className="space-y-3">
            <Input
              placeholder="Add skills (e.g., React, Python)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    addSkill(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            {filters.skills && filters.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.skills.map((skill) => (
                  <Badge key={skill} variant="default" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Experience Filter */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('experience')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Experience</CardTitle>
              {filters.experience && (
                <Badge variant="primary" className="text-xs">1</Badge>
              )}
            </div>
            {expandedSections.has('experience') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('experience') && (
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.experience?.min || ''}
                onChange={(e) => updateFilters({
                  experience: {
                    min: parseInt(e.target.value) || 0,
                    max: filters.experience?.max || 20
                  }
                })}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.experience?.max || ''}
                onChange={(e) => updateFilters({
                  experience: {
                    min: filters.experience?.min || 0,
                    max: parseInt(e.target.value) || 20
                  }
                })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Role Level</label>
              <div className="space-y-2">
                {['Entry', 'Mid', 'Senior', 'Lead', 'Executive'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.roleLevel?.includes(level.toLowerCase())}
                      onCheckedChange={(checked) => {
                        const current = filters.roleLevel || [];
                        if (checked) {
                          updateFilters({ roleLevel: [...current, level.toLowerCase()] });
                        } else {
                          updateFilters({ roleLevel: current.filter(l => l !== level.toLowerCase()) });
                        }
                      }}
                    />
                    <span className="text-sm text-foreground">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Location Filter */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('location')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Location</CardTitle>
              {(filters.location || filters.remote) && (
                <Badge variant="primary" className="text-xs">1</Badge>
              )}
            </div>
            {expandedSections.has('location') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('location') && (
          <CardContent className="space-y-3">
            <Input
              placeholder="City, State, or Country"
              value={filters.location || ''}
              onChange={(e) => updateFilters({ location: e.target.value })}
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.remote || false}
                  onCheckedChange={(checked) => updateFilters({ remote: !!checked })}
                />
                <span className="text-sm text-foreground">Remote only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.willingToRelocate || false}
                  onCheckedChange={(checked) => updateFilters({ willingToRelocate: !!checked })}
                />
                <span className="text-sm text-foreground">Willing to relocate</span>
              </label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Education Filter */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('education')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Education</CardTitle>
              {filters.education && filters.education.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.education.length}</Badge>
              )}
            </div>
            {expandedSections.has('education') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('education') && (
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Degree Level</label>
              <div className="space-y-2">
                {['High School', 'Associate', 'Bachelor', 'Master', 'PhD'].map((degree) => (
                  <label key={degree} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.degreeLevel?.includes(degree.toLowerCase())}
                      onCheckedChange={(checked) => {
                        const current = filters.degreeLevel || [];
                        if (checked) {
                          updateFilters({ degreeLevel: [...current, degree.toLowerCase()] });
                        } else {
                          updateFilters({ degreeLevel: current.filter(d => d !== degree.toLowerCase()) });
                        }
                      }}
                    />
                    <span className="text-sm text-foreground">{degree}</span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              placeholder="Institution name"
              value={filters.institution || ''}
              onChange={(e) => updateFilters({ institution: e.target.value })}
            />
          </CardContent>
        )}
      </Card>

      {/* Availability Filter */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('availability')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Availability</CardTitle>
              {filters.availability && filters.availability.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.availability.length}</Badge>
              )}
            </div>
            {expandedSections.has('availability') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('availability') && (
          <CardContent className="space-y-2">
            {[
              { value: 'immediate', label: 'Immediately available' },
              { value: '2weeks', label: '2 weeks notice' },
              { value: '1month', label: '1 month notice' },
              { value: '3months', label: '3+ months notice' },
              { value: 'not-looking', label: 'Not looking' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.availability?.includes(option.value)}
                  onCheckedChange={() => toggleAvailability(option.value)}
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Salary Expectations */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('salary')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Salary Expectations</CardTitle>
              {filters.salaryRange && (
                <Badge variant="primary" className="text-xs">1</Badge>
              )}
            </div>
            {expandedSections.has('salary') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('salary') && (
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.salaryRange?.min || ''}
                onChange={(e) => updateFilters({
                  salaryRange: {
                    min: parseInt(e.target.value) || 0,
                    max: filters.salaryRange?.max || 200000,
                    currency: filters.salaryRange?.currency || 'USD',
                    period: filters.salaryRange?.period || 'annual'
                  }
                })}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.salaryRange?.max || ''}
                onChange={(e) => updateFilters({
                  salaryRange: {
                    min: filters.salaryRange?.min || 0,
                    max: parseInt(e.target.value) || 200000,
                    currency: filters.salaryRange?.currency || 'USD',
                    period: filters.salaryRange?.period || 'annual'
                  }
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.salaryRange?.currency || 'USD'}
                onChange={(e) => updateFilters({
                  salaryRange: {
                    ...filters.salaryRange!,
                    currency: e.target.value
                  }
                })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
              <select
                value={filters.salaryRange?.period || 'annual'}
                onChange={(e) => updateFilters({
                  salaryRange: {
                    ...filters.salaryRange!,
                    period: e.target.value as 'annual' | 'monthly' | 'hourly'
                  }
                })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Languages */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('languages')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Languages</CardTitle>
              {filters.languages && filters.languages.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.languages.length}</Badge>
              )}
            </div>
            {expandedSections.has('languages') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('languages') && (
          <CardContent className="space-y-3">
            <Input
              placeholder="Add language (e.g., English, Spanish)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    addLanguage(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            {filters.languages && filters.languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.languages.map((lang) => (
                  <Badge key={lang} variant="default" className="flex items-center gap-1">
                    {lang}
                    <button onClick={() => removeLanguage(lang)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Certifications */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('certifications')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Certifications</CardTitle>
              {filters.certifications && filters.certifications.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.certifications.length}</Badge>
              )}
            </div>
            {expandedSections.has('certifications') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('certifications') && (
          <CardContent className="space-y-3">
            <Input
              placeholder="Add certification"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    updateFilters({
                      certifications: [...(filters.certifications || []), value]
                    });
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            {filters.certifications && filters.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.certifications.map((cert) => (
                  <Badge key={cert} variant="default" className="flex items-center gap-1">
                    {cert}
                    <button onClick={() => {
                      updateFilters({
                        certifications: filters.certifications?.filter(c => c !== cert)
                      });
                    }}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Tags */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('tags')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Tags</CardTitle>
              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="primary" className="text-xs">{filters.tags.length}</Badge>
              )}
            </div>
            {expandedSections.has('tags') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('tags') && (
          <CardContent className="space-y-3">
            <Input
              placeholder="Add tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    addTag(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Security Clearance */}
      <Card className="border border-border">
        <CardHeader 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => toggleSection('security')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Security Clearance</CardTitle>
            </div>
            {expandedSections.has('security') ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {expandedSections.has('security') && (
          <CardContent>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.securityClearance || false}
                onCheckedChange={(checked) => updateFilters({ securityClearance: !!checked })}
              />
              <span className="text-sm text-foreground">Has security clearance</span>
            </label>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

