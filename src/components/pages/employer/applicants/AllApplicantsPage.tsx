"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { Checkbox } from '@/components/common/forms/Checkbox';
import { 
  Search, 
  Users, 
  Filter, 
  Grid3x3, 
  List,
  Download,
  MessageSquare,
  ArrowUpDown,
  X,
  MapPin,
  Briefcase,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Application } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

type ViewMode = 'grid' | 'table';
type SortOption = 'date' | 'name' | 'match' | 'job' | 'status';

interface ApplicantFilters {
  status?: string[];
  jobId?: string;
  matchScoreMin?: number;
  matchScoreMax?: number;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
  skills?: string[];
  tags?: string[];
}

const statusColors = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  reviewed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  shortlisted: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  interviewed: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  offered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  hired: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export function AllApplicantsPage() {
  const router = useRouter();
  const { applications, jobs } = useAppSelector((state) => state.employer);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ApplicantFilters>({});
  const itemsPerPage = 20;

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applications.length,
      new: 0,
      reviewed: 0,
      shortlisted: 0,
      interviewed: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    };
    applications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.candidateName.toLowerCase().includes(query) ||
        app.candidateEmail.toLowerCase().includes(query) ||
        app.jobTitle.toLowerCase().includes(query) ||
        app.location?.toLowerCase().includes(query) ||
        app.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(app => filters.status!.includes(app.status));
    }

    // Job filter
    if (filters.jobId) {
      filtered = filtered.filter(app => app.jobId === filters.jobId);
    }

    // Match score filter
    if (filters.matchScoreMin !== undefined) {
      filtered = filtered.filter(app => (app.matchScore || 0) >= filters.matchScoreMin!);
    }
    if (filters.matchScoreMax !== undefined) {
      filtered = filtered.filter(app => (app.matchScore || 100) <= filters.matchScoreMax!);
    }

    // Date filter
    if (filters.dateFrom) {
      filtered = filtered.filter(app => new Date(app.appliedAt) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(app => new Date(app.appliedAt) <= new Date(filters.dateTo!));
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(app => 
        app.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter(app =>
        filters.skills!.some(skill =>
          app.skills?.some(appSkill => appSkill.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
          break;
        case 'name':
          comparison = a.candidateName.localeCompare(b.candidateName);
          break;
        case 'match':
          comparison = (a.matchScore || 0) - (b.matchScore || 0);
          break;
        case 'job':
          comparison = a.jobTitle.localeCompare(b.jobTitle);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [applications, searchQuery, filters, sortBy, sortOrder]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedApplications.slice(start, start + itemsPerPage);
  }, [filteredAndSortedApplications, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);

  const toggleApplicantSelection = (id: string) => {
    const newSelected = new Set(selectedApplicants);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplicants(newSelected);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(new Set(paginatedApplications.map(a => a.id)));
    } else {
      setSelectedApplicants(new Set());
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedApplicants.size === 0) {
      alert('Please select applicants first');
      return;
    }
    // TODO: Implement bulk actions
    alert(`Bulk ${action} for ${selectedApplicants.size} applicants`);
  };

  const handleExport = () => {
    const dataToExport = filteredAndSortedApplications.map(app => ({
      Name: app.candidateName,
      Email: app.candidateEmail,
      Job: app.jobTitle,
      Status: app.status,
      'Match Score': app.matchScore || 0,
      'Applied Date': new Date(app.appliedAt).toLocaleDateString(),
      Location: app.location || '',
    }));
    // TODO: Implement CSV export
    console.log('Export data:', dataToExport);
    alert(`Exporting ${dataToExport.length} applicants...`);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof ApplicantFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  }).length;

  return (
    <Layout noCard title="All Applicants" role="employer" noPaddingX>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Applicants</h1>
          <p className="text-muted-foreground mt-1">
                View and manage all job applications across all jobs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border border-border rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="primary" className="ml-2">{activeFilterCount}</Badge>
                )}
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'new', label: 'New', count: statusCounts.new },
              { key: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed },
              { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
              { key: 'interviewed', label: 'Interviewed', count: statusCounts.interviewed },
              { key: 'offered', label: 'Offered', count: statusCounts.offered },
              { key: 'hired', label: 'Hired', count: statusCounts.hired },
              { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key === 'all') {
                    setFilters({ ...filters, status: undefined });
                  } else {
                    setFilters({ ...filters, status: [tab.key] });
                  }
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  filters.status?.includes(tab.key) || (tab.key === 'all' && !filters.status)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                {tab.label}
                <Badge variant="default" className="ml-2 text-xs">
                  {tab.count}
                </Badge>
              </button>
            ))}
        </div>

          {/* Search and Sort */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, job, location, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="match">Sort by Match Score</option>
                <option value="job">Sort by Job</option>
                <option value="status">Sort by Status</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Advanced Filters</h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Job</label>
                <select
                  value={filters.jobId || ''}
                  onChange={(e) => setFilters({ ...filters, jobId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                  <option value="">All Jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Match Score</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.matchScoreMin || ''}
                    onChange={(e) => setFilters({ ...filters, matchScoreMin: parseInt(e.target.value) || undefined })}
                    className="text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.matchScoreMax || ''}
                    onChange={(e) => setFilters({ ...filters, matchScoreMax: parseInt(e.target.value) || undefined })}
                    className="text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Date From</label>
                <Input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                <Input
                  placeholder="City, State"
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedApplicants.size > 0 && (
          <div className="p-4 border-b border-border bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedApplicants.size} applicant{selectedApplicants.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('message')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('shortlist')}
                >
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedApplications.length} {filteredAndSortedApplications.length === 1 ? 'applicant' : 'applicants'} found
            </p>
          </div>

          {/* Applications List */}
          {filteredAndSortedApplications.length === 0 ? (
            <Card className="border border-border">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No applicants found</h3>
              <p className="text-muted-foreground">
                  {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'No applications yet'}
              </p>
            </CardContent>
          </Card>
          ) : viewMode === 'table' ? (
            <Card className="border border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="p-4 text-left">
                          <Checkbox
                            checked={selectedApplicants.size === paginatedApplications.length && paginatedApplications.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Candidate</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Job</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Match Score</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Location</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Applied</th>
                        <th className="p-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedApplications.map((application) => (
                        <tr
                key={application.id}
                          className={cn(
                            "border-b border-border hover:bg-accent/50 transition-colors cursor-pointer",
                            selectedApplicants.has(application.id) && "bg-primary/5"
                          )}
                onClick={() => router.push(`/portal/employer/applicants/${application.id}`)}
              >
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedApplicants.has(application.id)}
                              onCheckedChange={() => toggleApplicantSelection(application.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {application.candidatePhoto ? (
                                  <img src={application.candidatePhoto} alt={application.candidateName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  application.candidateName.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{application.candidateName}</div>
                                <div className="text-sm text-muted-foreground">{application.candidateEmail}</div>
                              </div>
                    </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-foreground">{application.jobTitle}</div>
                            <div className="text-sm text-muted-foreground">{application.jobId}</div>
                          </td>
                          <td className="p-4">
                        <Badge
                              variant="default"
                          className={cn('border', statusColors[application.status])}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                          </td>
                          <td className="p-4">
                            {application.matchScore !== undefined ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-muted rounded-full h-2 w-16">
                            <div
                              className={cn(
                                      "h-2 rounded-full",
                                application.matchScore >= 80
                                  ? "bg-green-500"
                                  : application.matchScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              )}
                              style={{ width: `${application.matchScore}%` }}
                            />
                          </div>
                                <span className="text-sm font-medium text-foreground w-10 text-right">
                                  {application.matchScore}%
                          </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm text-foreground">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              {application.location || '-'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-foreground">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(application.appliedAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/portal/employer/applicants/${application.id}`)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/portal/employer/messaging?candidate=${application.candidateId}`)}
                                title="Send Message"
                              >
                                <MessageSquare className="w-4 h-4" />
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedApplications.map((application) => (
                <Card
                  key={application.id}
                  className={cn(
                    "border border-border hover:shadow-lg transition-all cursor-pointer",
                    selectedApplicants.has(application.id) && "ring-2 ring-primary"
                  )}
                  onClick={() => router.push(`/portal/employer/applicants/${application.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {application.candidatePhoto ? (
                          <img src={application.candidatePhoto} alt={application.candidateName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          application.candidateName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">{application.candidateName}</h3>
                          <Checkbox
                            checked={selectedApplicants.has(application.id)}
                            onCheckedChange={() => toggleApplicantSelection(application.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{application.candidateEmail}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{application.jobTitle}</span>
                      </div>
                      {application.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {application.location}
                        </div>
                      )}
                    </div>

                    {application.matchScore !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Match Score</span>
                          <span className="text-sm font-semibold text-foreground">{application.matchScore}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              application.matchScore >= 80
                                ? "bg-green-500"
                                : application.matchScore >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            )}
                            style={{ width: `${application.matchScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {application.skills && application.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {application.skills.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="default" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.skills.length > 3 && (
                            <Badge variant="default" className="text-xs">
                              +{application.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Badge
                        variant="default"
                        className={cn('border', statusColors[application.status])}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/portal/employer/applicants/${application.id}`);
                          }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/portal/employer/messaging?candidate=${application.candidateId}`);
                          }}
                          title="Send Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
