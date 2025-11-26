"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { X, Search } from 'lucide-react';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function AdvancedSearchModal({ isOpen, onClose, onSearch }: AdvancedSearchModalProps) {
  const [searchFields, setSearchFields] = useState({
    title: '',
    description: '',
    skills: '',
    companyName: '',
    location: '',
  });

  const [options, setOptions] = useState({
    matchAll: false,
    caseSensitive: false,
  });

  if (!isOpen) return null;

  const handleSearch = () => {
    const parts: string[] = [];
    
    if (searchFields.title) parts.push(`title:"${searchFields.title}"`);
    if (searchFields.description) parts.push(`description:"${searchFields.description}"`);
    if (searchFields.skills) parts.push(`skills:"${searchFields.skills}"`);
    if (searchFields.companyName) parts.push(`company:"${searchFields.companyName}"`);
    if (searchFields.location) parts.push(`location:"${searchFields.location}"`);

    const query = parts.join(options.matchAll ? ' AND ' : ' OR ');
    onSearch(query);
    onClose();
  };

  const handleReset = () => {
    setSearchFields({
      title: '',
      description: '',
      skills: '',
      companyName: '',
      location: '',
    });
    setOptions({
      matchAll: false,
      caseSensitive: false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Advanced Search
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Job Title
              </label>
              <Input
                placeholder="e.g., Software Engineer"
                value={searchFields.title}
                onChange={(e) => setSearchFields({ ...searchFields, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description Keywords
              </label>
              <Input
                placeholder="Keywords in job description..."
                value={searchFields.description}
                onChange={(e) => setSearchFields({ ...searchFields, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Skills
              </label>
              <Input
                placeholder="e.g., React, TypeScript, Node.js"
                value={searchFields.skills}
                onChange={(e) => setSearchFields({ ...searchFields, skills: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Company Name
              </label>
              <Input
                placeholder="Company name..."
                value={searchFields.companyName}
                onChange={(e) => setSearchFields({ ...searchFields, companyName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Location
              </label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={searchFields.location}
                onChange={(e) => setSearchFields({ ...searchFields, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={options.matchAll}
                onCheckedChange={(checked) => setOptions({ ...options, matchAll: !!checked })}
              />
              <span className="text-sm text-foreground">Match all criteria (AND)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={options.caseSensitive}
                onCheckedChange={(checked) => setOptions({ ...options, caseSensitive: !!checked })}
              />
              <span className="text-sm text-foreground">Case sensitive</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

