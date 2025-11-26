"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { 
  Grid3x3, 
  List,
  Save,
  Download,
  MessageSquare,
  Filter,
  X,
  Bookmark,
  Bell
} from 'lucide-react';
import { cn } from '@/utils';
import { Candidate, SearchFilters, SortOption, ViewMode, SavedSearch } from './types';
import { SearchBar } from './components/SearchBar';
import { AdvancedFiltersPanel } from './components/AdvancedFiltersPanel';
import { CandidateCard } from './components/CandidateCard';
import { CandidatePreviewPanel } from './components/CandidatePreviewPanel';

// Mock data - replace with API calls
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    headline: 'Senior Software Engineer',
    currentPosition: 'Senior Software Engineer',
    currentCompany: 'Tech Corp',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    matchScore: 92,
    availability: 'immediate',
    experience: 8,
    education: 'BS Computer Science',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    languages: ['English', 'Spanish'],
    certifications: ['AWS Certified Solutions Architect'],
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
  },
  {
    id: '2',
    name: 'Jane Smith',
    headline: 'Full Stack Developer',
    currentPosition: 'Full Stack Developer',
    currentCompany: 'StartupXYZ',
    location: 'Remote',
    skills: ['React', 'Python', 'PostgreSQL', 'GraphQL', 'Django'],
    matchScore: 85,
    availability: '2weeks',
    experience: 5,
    education: 'MS Software Engineering',
    email: 'jane.smith@example.com',
    languages: ['English', 'French'],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    headline: 'DevOps Engineer',
    currentPosition: 'DevOps Engineer',
    currentCompany: 'CloudTech',
    location: 'New York, NY',
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins'],
    matchScore: 78,
    availability: '1month',
    experience: 6,
    education: 'BS Information Technology',
    certifications: ['Kubernetes Administrator'],
  },
];

export function SearchTalentPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const itemsPerPage = 12;

  // Filter and search candidates
  const filteredCandidates = useMemo(() => {
    let filtered = [...mockCandidates];

    // Search query
    if (searchQuery || filters.query) {
      const query = (searchQuery || filters.query || '').toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.headline.toLowerCase().includes(query) ||
        candidate.currentCompany.toLowerCase().includes(query) ||
        candidate.location.toLowerCase().includes(query) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(query)) ||
        candidate.education.toLowerCase().includes(query)
      );
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.skills!.every(skill =>
          candidate.skills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(candidate =>
        candidate.experience >= (filters.experience!.min || 0) &&
        candidate.experience <= (filters.experience!.max || 20)
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
        (filters.remote && candidate.location.toLowerCase().includes('remote'))
      );
    } else if (filters.remote) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes('remote')
      );
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.availability!.includes(candidate.availability)
      );
    }

    // Education filter
    if (filters.education && filters.education.length > 0) {
      filtered = filtered.filter(candidate =>
        filters.education!.some(edu => candidate.education.toLowerCase().includes(edu.toLowerCase()))
      );
    }

    // Languages filter
    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(candidate =>
        candidate.languages?.some(lang =>
          filters.languages!.some(filterLang => lang.toLowerCase().includes(filterLang.toLowerCase()))
        )
      );
    }

    // Certifications filter
    if (filters.certifications && filters.certifications.length > 0) {
      filtered = filtered.filter(candidate =>
        candidate.certifications?.some(cert =>
          filters.certifications!.some(filterCert => cert.toLowerCase().includes(filterCert.toLowerCase()))
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'match':
        filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        // Sort by some date field if available
        break;
      default:
        // Relevance (by match score)
        filtered.sort((a, b) => b.matchScore - a.matchScore);
    }

    return filtered;
  }, [searchQuery, filters, sortBy]);

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(start, start + itemsPerPage);
  }, [filteredCandidates, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, query });
    setCurrentPage(1);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 9)]);
    }
  };

  const toggleCandidateSelection = (id: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(new Set(paginatedCandidates.map(c => c.id)));
    } else {
      setSelectedCandidates(new Set());
    }
  };

  const handleSaveSearch = () => {
    const searchName = prompt('Enter a name for this search:');
    if (searchName) {
      // TODO: Save search to API
      alert(`Search "${searchName}" saved successfully!`);
    }
  };

  const handleExport = () => {
    const selected = filteredCandidates.filter(c => selectedCandidates.has(c.id));
    if (selected.length === 0) {
      alert('Please select candidates to export');
      return;
    }
    // TODO: Implement export functionality
    alert(`Exporting ${selected.length} candidates...`);
  };

  const handleMessageSelected = () => {
    if (selectedCandidates.size === 0) {
      alert('Please select candidates to message');
      return;
    }
    // TODO: Open messaging with selected candidates
    router.push(`/portal/employer/messaging?candidates=${Array.from(selectedCandidates).join(',')}`);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <Layout noCard title="Search Talent" role="employer" noPaddingX>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Search Talent</h1>
              <p className="text-muted-foreground mt-1">
                Discover and connect with top candidates
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
              <Button variant="outline" onClick={() => router.push('/portal/employer/search/saved')}>
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Searches
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                recentSearches={recentSearches}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="relevance">Relevance</option>
              <option value="match">Match Score</option>
              <option value="experience">Experience</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <Button variant="outline" onClick={handleSaveSearch}>
              <Save className="w-4 h-4 mr-2" />
              Save Search
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          {showFilters && (
            <div className="w-80 border-r border-border bg-card overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <AdvancedFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Center - Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {filteredCandidates.length} {filteredCandidates.length === 1 ? 'candidate' : 'candidates'} found
                </p>
                {!showFilters && (
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Show Filters
                  </Button>
                )}
              </div>
              {selectedCandidates.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">
                    {selectedCandidates.size} selected
                  </span>
                  <Button variant="outline" size="sm" onClick={handleMessageSelected}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Selected
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              )}
            </div>

            {/* Results */}
            {filteredCandidates.length === 0 ? (
              <Card className="border border-border">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No candidates found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {viewMode === 'list' && (
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCandidates.size === paginatedCandidates.length && paginatedCandidates.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm text-foreground">Select all on this page</span>
                    </label>
                  </div>
                )}
                <div className={cn(
                  viewMode === 'grid' 
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" 
                    : "space-y-2"
                )}>
                  {paginatedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      isSelected={selectedCandidates.has(candidate.id)}
                      onSelect={toggleCandidateSelection}
                      onView={(id) => {
                        const candidate = filteredCandidates.find(c => c.id === id);
                        setSelectedCandidate(candidate || null);
                      }}
                      onAddToPool={(id) => {
                        // TODO: Add to talent pool
                        alert(`Adding candidate ${id} to talent pool...`);
                      }}
                      onMessage={(id) => {
                        router.push(`/portal/employer/messaging?candidate=${id}`);
                      }}
                      onSave={(id) => {
                        // TODO: Save candidate
                        alert(`Saving candidate ${id}...`);
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar - Candidate Preview (Desktop) */}
          {selectedCandidate && (
            <CandidatePreviewPanel
              candidate={selectedCandidate}
              onClose={() => setSelectedCandidate(null)}
              onMessage={(id) => router.push(`/portal/employer/messaging?candidate=${id}`)}
              onAddToPool={(id) => {
                alert(`Adding candidate ${id} to talent pool...`);
              }}
              onSave={(id) => {
                alert(`Saving candidate ${id}...`);
              }}
              onViewFullProfile={(id) => {
                router.push(`/portal/employer/talent-pool/${id}`);
              }}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
