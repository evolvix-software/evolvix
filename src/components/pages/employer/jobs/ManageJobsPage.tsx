"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateJob, deleteJob, duplicateJob } from '@/store/features/employer/employerSlice';
import { JobActionsMenu } from './components/JobActionsMenu';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { Badge } from '@/components/common/ui/Badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Briefcase,
  Grid3x3,
  List,
  ArrowUpDown,
  MoreVertical,
  X,
  Pause,
  Play,
  Copy,
  Download
} from 'lucide-react';
import { Job } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';
import { JobFiltersPanel, JobFilters } from './components/JobFilters';
import { SavedFilters } from './components/SavedFilters';
import { SearchSuggestions } from './components/SearchSuggestions';
import { AdvancedSearchModal } from './components/AdvancedSearchModal';

const statusColors = {
  active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  closed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  draft: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'applications-high' | 'applications-low' | 'views-high' | 'views-low' | 'title-asc' | 'title-desc' | 'expiry-soonest' | 'expiry-latest';

export function ManageJobsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.employer);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 20;
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    status: [],
    employmentType: [],
    location: '',
    datePosted: 'all',
    remoteType: [],
    salaryMin: '',
    salaryMax: '',
    assignedRecruiter: '',
  });

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter - enhanced to search description and skills
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        job.title.toLowerCase().includes(lowerQuery) ||
        job.location.toLowerCase().includes(lowerQuery) ||
        (job.description && job.description.toLowerCase().includes(lowerQuery)) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(lowerQuery)));

      // Status filter
      const matchesStatus = filters.status.length === 0 || filters.status.includes(job.status);

      // Employment type filter
      const matchesEmploymentType = filters.employmentType.length === 0 || 
                                   filters.employmentType.includes(job.employmentType);

      // Location filter
      const matchesLocation = !filters.location || 
                             job.location.toLowerCase().includes(filters.location.toLowerCase());

      // Date filter
      let matchesDate = true;
      if (filters.datePosted !== 'all') {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (filters.datePosted === 'last-7-days') {
          matchesDate = daysDiff <= 7;
        } else if (filters.datePosted === 'last-30-days') {
          matchesDate = daysDiff <= 30;
        } else if (filters.datePosted === 'last-90-days') {
          matchesDate = daysDiff <= 90;
        }
      }

      // Assigned recruiter filter (if jobs had assignedRecruiter field)
      const matchesRecruiter = !filters.assignedRecruiter || true; // Placeholder - would check job.assignedRecruiter

      return matchesSearch && matchesStatus && matchesEmploymentType && matchesLocation && matchesDate && matchesRecruiter;
    });
  }, [jobs, searchQuery, filters]);

  // Sort jobs
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'applications-high':
        return sorted.sort((a, b) => b.applications - a.applications);
      case 'applications-low':
        return sorted.sort((a, b) => a.applications - b.applications);
      case 'views-high':
        return sorted.sort((a, b) => b.views - a.views);
      case 'views-low':
        return sorted.sort((a, b) => a.views - b.views);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'expiry-soonest':
        return sorted.sort((a, b) => {
          if (!a.expiresAt && !b.expiresAt) return 0;
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        });
      case 'expiry-latest':
        return sorted.sort((a, b) => {
          if (!a.expiresAt && !b.expiresAt) return 0;
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
        });
      default:
        return sorted;
    }
  }, [filteredJobs, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    return sortedJobs.slice(startIndex, startIndex + jobsPerPage);
  }, [sortedJobs, currentPage, jobsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);

  const toggleJobSelection = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
  };

  const selectAll = () => {
    if (selectedJobs.size === sortedJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(sortedJobs.map(j => j.id)));
    }
  };

  const handleBulkAction = (action: 'pause' | 'close' | 'delete' | 'promote' | 'resume') => {
    const actionLabels: Record<string, string> = {
      pause: 'paused',
      close: 'closed',
      delete: 'deleted',
      promote: 'promoted',
      resume: 'resumed',
    };

    const confirmMessage = action === 'delete'
      ? `Are you sure you want to delete ${selectedJobs.size} job(s)? This action cannot be undone.`
      : `Are you sure you want to ${action} ${selectedJobs.size} job(s)?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    let successCount = 0;
    selectedJobs.forEach((jobId) => {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        if (action === 'delete') {
          dispatch(deleteJob(jobId));
          successCount++;
        } else if (action === 'promote') {
          dispatch(updateJob({
            ...job,
            promoteJob: true,
          }));
          successCount++;
        } else if (action === 'resume') {
          dispatch(updateJob({
            ...job,
            status: 'active' as any,
          }));
          successCount++;
        } else {
          dispatch(updateJob({
            ...job,
            status: action === 'pause' ? 'paused' : 'closed' as any,
          }));
          successCount++;
        }
      }
    });

    if (successCount > 0) {
      alert(`Successfully ${actionLabels[action]} ${successCount} job(s)!`);
    }
    setSelectedJobs(new Set());
  };

  const handleDuplicateJob = (jobId: string) => {
    if (window.confirm('Duplicate this job? It will be created as a draft.')) {
      dispatch(duplicateJob(jobId));
      // Show success message
      const duplicatedJob = jobs.find(j => j.id === jobId);
      if (duplicatedJob) {
        alert(`Job "${duplicatedJob.title}" has been duplicated successfully!`);
      }
    }
  };

  const handleStatusChange = (jobId: string, newStatus: 'active' | 'paused' | 'closed') => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const statusLabels: Record<string, string> = {
        active: 'activated',
        paused: 'paused',
        closed: 'closed',
      };
      dispatch(updateJob({
        ...job,
        status: newStatus as any,
      }));
      // Show success message
      alert(`Job "${job.title}" has been ${statusLabels[newStatus]} successfully!`);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const jobsToExport = selectedJobs.size > 0 
      ? sortedJobs.filter(j => selectedJobs.has(j.id))
      : sortedJobs;

    if (format === 'csv') {
      const headers = ['Title', 'Status', 'Location', 'Employment Type', 'Applications', 'Views', 'Posted Date', 'Expiry Date'];
      const rows = jobsToExport.map(job => [
        job.title,
        job.status,
        job.location,
        job.employmentType,
        job.applications.toString(),
        job.views.toString(),
        new Date(job.createdAt).toLocaleDateString(),
        job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jobs-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // PDF export would require a library like jsPDF
      alert('PDF export coming soon!');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      employmentType: [],
      location: '',
      datePosted: 'all',
      remoteType: [],
      salaryMin: '',
      salaryMax: '',
      assignedRecruiter: '',
    });
    setSearchQuery('');
  };

  const handleAdvancedSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectSuggestion = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout noCard title="Manage Jobs" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Jobs</h1>
            <p className="text-muted-foreground mt-1">
              {sortedJobs.length} {sortedJobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
          <Button
            onClick={() => router.push('/portal/employer/jobs/new')}
            className="bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </Button>
        </div>

        {/* Search and View Controls */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative" onFocus={() => setSearchInputFocused(true)}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, location, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchInputFocused(true)}
                    onBlur={() => setTimeout(() => setSearchInputFocused(false), 200)}
                    className="pl-10"
                  />
                  <SearchSuggestions
                    searchQuery={searchQuery}
                    jobs={jobs}
                    onSelectSuggestion={handleSelectSuggestion}
                    onClearHistory={() => setSearchQuery('')}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedSearch(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                  >
                    Advanced
                  </Button>
                </div>
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground flex items-center gap-2"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="applications-high">Most Applications</option>
                  <option value="applications-low">Least Applications</option>
                  <option value="views-high">Most Views</option>
                  <option value="views-low">Least Views</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="expiry-soonest">Expiry Soonest</option>
                  <option value="expiry-latest">Expiry Latest</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv')}
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <JobFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>
          <div className="md:col-span-1">
            <Card className="border border-border">
              <CardContent className="p-4">
                <SavedFilters
                  filters={filters}
                  onApplyFilters={setFilters}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedJobs.size > 0 && (
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {selectedJobs.size} {selectedJobs.size === 1 ? 'job' : 'jobs'} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('pause')}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('close')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('promote')}
                  >
                    Promote
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('csv')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedJobs(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs Display */}
        {sortedJobs.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery
                  ? 'No jobs match your search'
                  : filters.status.length > 0 || filters.employmentType.length > 0 || filters.location
                  ? 'No jobs match your filters'
                  : jobs.length === 0
                  ? 'No jobs posted yet'
                  : 'No jobs found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `We couldn't find any jobs matching "${searchQuery}". Try different keywords or clear your search.`
                  : filters.status.length > 0 || filters.employmentType.length > 0 || filters.location
                  ? 'Try adjusting your filters or clearing them to see more results.'
                  : jobs.length === 0
                  ? 'Get started by posting your first job to attract top talent.'
                  : 'No jobs match your current criteria.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      clearFilters();
                    }}
                  >
                    Clear Search
                  </Button>
                )}
                {(filters.status.length > 0 || filters.employmentType.length > 0 || filters.location) && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
                {jobs.length === 0 && (
                  <Button
                    onClick={() => router.push('/portal/employer/jobs/new')}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedJobs.map((job) => (
              <Card
                key={job.id}
                className={cn(
                  "border border-border hover:shadow-lg transition-all cursor-pointer group",
                  selectedJobs.has(job.id) && "ring-2 ring-primary"
                )}
                onClick={() => router.push(`/portal/employer/jobs/${job.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Checkbox
                      checked={selectedJobs.has(job.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleJobSelection(job.id);
                        } else {
                          const newSelected = new Set(selectedJobs);
                          newSelected.delete(job.id);
                          setSelectedJobs(newSelected);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <Badge
                          variant="default"
                          className={cn('border text-xs', statusColors[job.status])}
                        >
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.location} • {job.employmentType}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.applications}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/portal/employer/jobs/${job.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/portal/employer/jobs/${job.id}/edit`);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <JobActionsMenu
                      job={job}
                      onViewDetails={() => router.push(`/portal/employer/jobs/${job.id}`)}
                      onEdit={() => router.push(`/portal/employer/jobs/${job.id}/edit`)}
                      onDuplicate={() => handleDuplicateJob(job.id)}
                      onPause={() => handleStatusChange(job.id, 'paused')}
                      onResume={() => handleStatusChange(job.id, 'active')}
                      onClose={() => handleStatusChange(job.id, 'closed')}
                      onViewApplicants={() => router.push(`/portal/employer/jobs/${job.id}/applicants`)}
                      onViewAnalytics={() => router.push(`/portal/employer/jobs/${job.id}/analytics`)}
                      onDelete={() => {
                        if (window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
                          dispatch(deleteJob(job.id));
                          alert(`Job "${job.title}" has been deleted successfully!`);
                        }
                      }}
                    />
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
                          checked={selectedJobs.size === sortedJobs.length && sortedJobs.length > 0}
                          onCheckedChange={selectAll}
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Job Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Location</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Applications</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Views</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Posted</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedJobs.map((job) => (
                      <tr
                        key={job.id}
                        className={cn(
                          "border-t border-border hover:bg-accent/50 cursor-pointer",
                          selectedJobs.has(job.id) && "bg-primary/5"
                        )}
                        onClick={() => router.push(`/portal/employer/jobs/${job.id}`)}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedJobs.has(job.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                toggleJobSelection(job.id);
                              } else {
                                const newSelected = new Set(selectedJobs);
                                newSelected.delete(job.id);
                                setSelectedJobs(newSelected);
                              }
                            }}
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{job.title}</div>
                          <div className="text-sm text-muted-foreground">{job.employmentType}</div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="default"
                            className={cn('border', statusColors[job.status])}
                          >
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-foreground">{job.location}</td>
                        <td className="p-4 text-sm text-foreground">{job.applications}</td>
                        <td className="p-4 text-sm text-foreground">{job.views}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <JobActionsMenu
                            job={job}
                            onViewDetails={() => router.push(`/portal/employer/jobs/${job.id}`)}
                            onEdit={() => router.push(`/portal/employer/jobs/${job.id}/edit`)}
                            onDuplicate={() => handleDuplicateJob(job.id)}
                            onPause={() => handleStatusChange(job.id, 'paused')}
                            onResume={() => handleStatusChange(job.id, 'active')}
                            onClose={() => handleStatusChange(job.id, 'closed')}
                            onViewApplicants={() => router.push(`/portal/employer/jobs/${job.id}/applicants`)}
                            onViewAnalytics={() => router.push(`/portal/employer/jobs/${job.id}/analytics`)}
                            onDelete={() => {
                              if (window.confirm('Are you sure you want to delete this job?')) {
                                dispatch(deleteJob(job.id));
                              }
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * jobsPerPage + 1} to {Math.min(currentPage * jobsPerPage, sortedJobs.length)} of {sortedJobs.length} jobs
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Search Modal */}
        <AdvancedSearchModal
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          onSearch={handleAdvancedSearch}
        />
      </div>
    </Layout>
  );
}
