"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { 
  Search, 
  Plus, 
  Download, 
  Upload,
  User,
  MessageSquare,
  Tag as TagIcon,
  X,
  Grid3x3,
  List,
  Filter,
  Star,
  FileText,
  Eye
} from 'lucide-react';
import { cn } from '@/utils';
import { AddCandidateDialog } from './components/AddCandidateDialog';
import { ImportDialog } from './components/ImportDialog';
import { TagManager, type Tag } from './components/TagManager';
import { SavedFilters, type FilterPreset } from './components/SavedFilters';

interface TalentPoolEntry {
  id: string;
  candidateId: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  interestLevel: 'high' | 'medium' | 'low';
  tags: string[];
  addedAt: string;
  lastContactAt?: string;
  matchedJobs: string[];
}

const mockTalentPool: TalentPoolEntry[] = [
  {
    id: '1',
    candidateId: 'c1',
    name: 'John Doe',
    headline: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Node.js'],
    interestLevel: 'high',
    tags: ['Frontend', 'Full Stack'],
    addedAt: '2024-01-15',
    lastContactAt: '2024-03-10',
    matchedJobs: ['job-1', 'job-2'],
  },
  {
    id: '2',
    candidateId: 'c2',
    name: 'Jane Smith',
    headline: 'Full Stack Developer',
    location: 'Remote',
    skills: ['Python', 'Django', 'PostgreSQL'],
    interestLevel: 'medium',
    tags: ['Backend'],
    addedAt: '2024-02-20',
    matchedJobs: ['job-3'],
  },
];

export function TalentPoolPage() {
  const router = useRouter();
  const [talentPool, setTalentPool] = useState<TalentPoolEntry[]>(mockTalentPool);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterInterest, setFilterInterest] = useState<string>('');
  const [filterSkills, setFilterSkills] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterExperience, setFilterExperience] = useState<string>('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const filteredCandidates = useMemo(() => {
    return talentPool.filter(candidate => {
      const matchesSearch = 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !filterTag || candidate.tags.includes(filterTag);
      const matchesInterest = !filterInterest || candidate.interestLevel === filterInterest;
      const matchesSkills = !filterSkills || candidate.skills.some(skill => skill.toLowerCase().includes(filterSkills.toLowerCase()));
      const matchesLocation = !filterLocation || candidate.location.toLowerCase().includes(filterLocation.toLowerCase());

      return matchesSearch && matchesTag && matchesInterest && matchesSkills && matchesLocation;
    });
  }, [talentPool, searchQuery, filterTag, filterInterest, filterSkills, filterLocation]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    talentPool.forEach(candidate => {
      candidate.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [talentPool]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCandidates(newSelected);
  };

  const handleBulkAction = (action: 'tag' | 'message' | 'export' | 'remove') => {
    const selectedIds = Array.from(selectedCandidates);
    switch (action) {
      case 'tag':
        // Open tag assignment dialog
        alert(`Tag ${selectedIds.length} candidates`);
        break;
      case 'message':
        // Open messaging interface
        router.push(`/portal/employer/messaging?candidates=${selectedIds.join(',')}`);
        break;
      case 'export':
        handleExport(selectedIds);
        break;
      case 'remove':
        if (confirm(`Remove ${selectedIds.length} candidates from talent pool?`)) {
          setTalentPool(talentPool.filter(c => !selectedIds.includes(c.id)));
          setSelectedCandidates(new Set());
        }
        break;
    }
  };

  const handleAddCandidate = (candidate: any) => {
    setTalentPool([...talentPool, candidate]);
  };

  const handleImport = (candidates: any[]) => {
    setTalentPool([...talentPool, ...candidates]);
  };

  const handleExport = (candidateIds?: string[]) => {
    const candidatesToExport = candidateIds 
      ? talentPool.filter(c => candidateIds.includes(c.id))
      : filteredCandidates;
    
    const csv = [
      ['Name', 'Email', 'Location', 'Headline', 'Skills', 'Tags', 'Interest Level', 'Added Date'].join(','),
      ...candidatesToExport.map(c => [
        c.name,
        c.candidateId,
        c.location,
        c.headline,
        c.skills.join(';'),
        c.tags.join(';'),
        c.interestLevel,
        c.addedAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talent-pool-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleTagCreated = (tag: Tag) => {
    setAvailableTags([...availableTags, tag]);
  };

  const handleTagUpdated = (tag: Tag) => {
    setAvailableTags(availableTags.map(t => t.id === tag.id ? tag : t));
  };

  const handleTagDeleted = (tagId: string) => {
    setAvailableTags(availableTags.filter(t => t.id !== tagId));
    // Remove tag from candidates
    setTalentPool(talentPool.map(c => ({
      ...c,
      tags: c.tags.filter(t => t !== availableTags.find(at => at.id === tagId)?.name)
    })));
  };

  const handleApplyFilter = (presetFilters: FilterPreset['filters']) => {
    setSearchQuery(presetFilters.searchQuery);
    setFilterTag(presetFilters.filterTag);
    setFilterInterest(presetFilters.filterInterest);
    setFilterSkills(presetFilters.filterSkills);
    setFilterLocation(presetFilters.filterLocation);
    setFilterExperience(presetFilters.filterExperience);
  };

  const getInterestColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Layout noCard title="Talent Pool" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Talent Pool</h1>
            <p className="text-muted-foreground mt-1">
              {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'} in your pool
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport()}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, skills, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    >
                      <option value="">All Tags</option>
                      {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <select
                      value={filterInterest}
                      onChange={(e) => setFilterInterest(e.target.value)}
                      className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    >
                      <option value="">All Interest Levels</option>
                      <option value="high">High Interest</option>
                      <option value="medium">Medium Interest</option>
                      <option value="low">Low Interest</option>
                    </select>
                    <Input
                      placeholder="Filter by skills..."
                      value={filterSkills}
                      onChange={(e) => setFilterSkills(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      placeholder="Filter by location..."
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-40"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTagManager(true)}
                      title="Manage Tags"
                    >
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="border border-border">
              <CardContent className="p-4">
                <SavedFilters
                  filters={{
                    searchQuery,
                    filterTag,
                    filterInterest,
                    filterSkills,
                    filterLocation,
                    filterExperience,
                  }}
                  onApplyFilter={handleApplyFilter}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCandidates.size > 0 && (
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {selectedCandidates.size} {selectedCandidates.size === 1 ? 'candidate' : 'candidates'} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('tag')}>
                    <TagIcon className="w-4 h-4 mr-2" />
                    Add Tags
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('message')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('remove')} className="text-destructive">
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCandidates(new Set())}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates Grid/List */}
        {filteredCandidates.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No candidates found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterTag || filterInterest
                  ? 'Try adjusting your filters'
                  : 'Start building your talent pool by adding candidates'}
              </p>
              {!searchQuery && !filterTag && !filterInterest && (
                <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-primary to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Candidate
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate) => (
              <Card
                key={candidate.id}
                className={cn(
                  "border border-border hover:shadow-lg transition-all cursor-pointer",
                  selectedCandidates.has(candidate.id) && "ring-2 ring-primary"
                )}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  router.push(`/portal/employer/talent-pool/${candidate.candidateId}`);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                        <Badge variant="default" className={cn("border capitalize", getInterestColor(candidate.interestLevel))}>
                          {candidate.interestLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{candidate.headline}</p>
                      <p className="text-xs text-muted-foreground mt-1">{candidate.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="text-xs border border-border">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(candidate.addedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/portal/employer/messaging?candidate=${candidate.candidateId}`);
                        }}
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/portal/employer/talent-pool/${candidate.candidateId}`);
                        }}
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedCandidates.size === filteredCandidates.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCandidates(new Set(filteredCandidates.map(c => c.id)));
                            } else {
                              setSelectedCandidates(new Set());
                            }
                          }}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Candidate</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Location</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Tags</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Interest</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Added</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className={cn(
                          "border-t border-border hover:bg-accent/50 cursor-pointer",
                          selectedCandidates.has(candidate.id) && "bg-primary/5"
                        )}
                        onClick={() => toggleSelection(candidate.id)}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedCandidates.has(candidate.id)}
                            onCheckedChange={(checked) => toggleSelection(candidate.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{candidate.headline}</div>
                        </td>
                        <td className="p-4 text-sm text-foreground">{candidate.location}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.tags.map((tag, index) => (
                              <Badge key={index} variant="default" className="text-xs border border-border">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="default" className={cn("border capitalize", getInterestColor(candidate.interestLevel))}>
                            {candidate.interestLevel}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(candidate.addedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/portal/employer/messaging?candidate=${candidate.candidateId}`)}
                              title="Send Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/portal/employer/talent-pool/${candidate.candidateId}`)}
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <AddCandidateDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSave={handleAddCandidate}
        />
        <ImportDialog
          isOpen={showImportDialog}
          onClose={() => setShowImportDialog(false)}
          onImport={handleImport}
        />
        <TagManager
          isOpen={showTagManager}
          onClose={() => setShowTagManager(false)}
          onTagCreated={handleTagCreated}
          onTagUpdated={handleTagUpdated}
          onTagDeleted={handleTagDeleted}
          existingTags={availableTags}
        />
      </div>
    </Layout>
  );
}

