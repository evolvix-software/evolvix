"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks';
import {
  updateApplication,
  assignRecruiter,
  addApplicationTags,
  addApplicationActivity,
  setStageMetrics,
} from '@/store/features/employer/employerSlice';
import { loadEmployerData } from '@/store/features/employer/employerThunks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { 
  Search, 
  Filter, 
  List, 
  Grid3x3,
  Users,
  X,
  Download,
  Mail,
  Tag,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { Application, PipelineStageType } from '@/store/features/employer/employerSlice';
import { PipelineStage } from './components/PipelineStage';
import { FiltersPanel, ApplicantFilters } from './components/FiltersPanel';
import { ApplicantDetailsPanel } from './components/ApplicantDetailsPanel';
import { StageStatistics } from './components/StageStatistics';
import { cn } from '@/utils';

const pipelineStages: Array<{
  id: PipelineStageType;
  name: string;
  color: string;
}> = [
  { id: 'new', name: 'New', color: 'bg-blue-500' },
  { id: 'reviewed', name: 'Reviewed', color: 'bg-purple-500' },
  { id: 'shortlisted', name: 'Shortlisted', color: 'bg-green-500' },
  { id: 'interviewed', name: 'Interviewed', color: 'bg-yellow-500' },
  { id: 'offered', name: 'Offered', color: 'bg-emerald-500' },
  { id: 'hired', name: 'Hired', color: 'bg-green-600' },
  { id: 'rejected', name: 'Rejected', color: 'bg-red-500' },
];

export function ApplicantPipelinePage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;
  const dispatch = useAppDispatch();
  const { applications, jobs, pipelineStages, stageMetrics } = useAppSelector((state) => state.employer);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ApplicantFilters>({});
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Load employer data if not already loaded
  useEffect(() => {
    if (applications.length === 0 && jobs.length === 0) {
      console.log('[ApplicantPipelinePage] Data not loaded, loading employer data...');
      dispatch(loadEmployerData());
    } else {
      console.log('[ApplicantPipelinePage] Data loaded:', {
        applicationsCount: applications.length,
        jobsCount: jobs.length,
      });
    }
  }, [dispatch, applications.length, jobs.length]);

  // Get job details
  const job = jobs.find(j => j.id === jobId);

  // Filter applications by job
  const jobApplications = useMemo(() => {
    return applications.filter(app => !jobId || app.jobTitle === job?.title);
  }, [applications, jobId, job]);

  // Filter and search applications
  const filteredApplications = useMemo(() => {
    return jobApplications.filter((app) => {
      // Search filter
      const matchesSearch = 
        app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        app.notes?.some(note => note.content.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Stage filter
      if (filters.stage && filters.stage.length > 0 && !filters.stage.includes(app.status)) {
        return false;
      }

      // Match score filter
      if (app.matchScore !== undefined) {
        if (filters.matchScoreMin !== undefined && app.matchScore < filters.matchScoreMin) {
          return false;
        }
        if (filters.matchScoreMax !== undefined && app.matchScore > filters.matchScoreMax) {
          return false;
        }
      }

      // Date applied filter
      if (filters.dateAppliedFrom || filters.dateAppliedTo) {
        const appliedDate = new Date(app.appliedAt);
        if (filters.dateAppliedFrom && appliedDate < new Date(filters.dateAppliedFrom)) {
          return false;
        }
        if (filters.dateAppliedTo && appliedDate > new Date(filters.dateAppliedTo)) {
          return false;
        }
      }

      // Assigned recruiter filter
      if (filters.assignedRecruiter && filters.assignedRecruiter.length > 0) {
        if (!app.assignedRecruiter || !filters.assignedRecruiter.includes(app.assignedRecruiter)) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location.length > 0) {
        if (!app.location || !filters.location.includes(app.location)) {
          return false;
        }
      }

      // Skills filter
      if (filters.skills && filters.skills.length > 0) {
        if (!app.skills || !filters.skills.some(skill => app.skills!.includes(skill))) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!app.tags || !filters.tags.some(tag => app.tags!.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, [jobApplications, searchQuery, filters]);

  // Group applications by stage
  const applicationsByStage = useMemo(() => {
    const grouped: Record<PipelineStageType, Application[]> = {
      new: [],
      reviewed: [],
      shortlisted: [],
      interviewed: [],
      offered: [],
      hired: [],
      rejected: [],
    };

    filteredApplications.forEach((app) => {
      if (grouped[app.status]) {
        grouped[app.status].push(app);
      }
    });

    return grouped;
  }, [filteredApplications]);

  const handleViewApplication = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (app) {
      setSelectedApplication(app);
      setShowDetailsPanel(true);
    }
  };

  const handleMoveToStage = (applicationId: string, newStatus: PipelineStageType) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      dispatch(updateApplication({
        ...application,
        status: newStatus,
      }));
      dispatch(addApplicationActivity({
        applicationId,
        activity: {
          id: `activity-${Date.now()}`,
          type: 'status_change',
          description: `Moved to ${newStatus}`,
          actor: 'Current User',
          timestamp: new Date().toISOString(),
        },
      }));
    }
  };

  const toggleApplicationSelection = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedApplications);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedApplications(newSelected);
  };

  const selectAll = () => {
    if (selectedApplications.size === filteredApplications.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const handleBulkAction = (action: 'move' | 'message' | 'tag' | 'download' | 'reject') => {
    const selectedIds = Array.from(selectedApplications);
    
    switch (action) {
      case 'move':
        // TODO: Show move stage dialog
        break;
      case 'message':
        router.push(`/portal/employer/messaging?applicants=${selectedIds.join(',')}`);
        break;
      case 'tag':
        // TODO: Show tag dialog
        break;
      case 'download':
        selectedIds.forEach(id => {
          const app = applications.find(a => a.id === id);
          if (app?.resumeUrl) {
            window.open(app.resumeUrl, '_blank');
          }
        });
        break;
      case 'reject':
        selectedIds.forEach(id => {
          handleMoveToStage(id, 'rejected');
        });
        break;
    }
    
    setSelectedApplications(new Set());
  };

  // Get available filter options
  const availableRecruiters = useMemo(() => {
    const recruiters = new Set<string>();
    applications.forEach(app => {
      if (app.assignedRecruiter) {
        recruiters.add(app.assignedRecruiter);
      }
    });
    return Array.from(recruiters);
  }, [applications]);

  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    applications.forEach(app => {
      if (app.location) {
        locations.add(app.location);
      }
    });
    return Array.from(locations);
  }, [applications]);

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    applications.forEach(app => {
      app.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills);
  }, [applications]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    applications.forEach(app => {
      app.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [applications]);

  // Calculate stage metrics
  useEffect(() => {
    const metrics: Record<string, any> = {};
    pipelineStages.forEach(stage => {
      const stageApps = filteredApplications.filter(app => app.status === stage.id);
      const avgTime = stageApps.length > 0 ? 24 : 0; // Mock calculation
      const conversionRate = stageApps.length > 0 ? 75 : 0; // Mock calculation
      metrics[stage.id] = {
        stageId: stage.id,
        totalApplicants: stageApps.length,
        averageTimeInStage: avgTime,
        conversionRate,
        dropOffRate: 10,
        trend: 'stable' as const,
      };
    });
    dispatch(setStageMetrics(metrics));
  }, [filteredApplications, pipelineStages, dispatch]);

  const totalApplications = filteredApplications.length;

  return (
    <Layout noCard title={job ? `${job.title} - Applicants` : "Applicant Pipeline"} role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {job ? job.title : 'Applicant Pipeline'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {totalApplications} {totalApplications === 1 ? 'applicant' : 'applicants'}
              </span>
              {job && (
                <span className="flex items-center gap-1.5">
                  <span>•</span>
                  <span>{job.location}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-border rounded-lg bg-background">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary/10 border-primary' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {Object.keys(filters).length > 0 && (
                <Badge variant="default" className="ml-2 h-5 min-w-[20px] px-1.5 text-xs">
                  {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applicants by name, email, or job title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedApplications.size > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedApplications.size} selected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions Toolbar */}
        {selectedApplications.size > 0 && (
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {selectedApplications.size} {selectedApplications.size === 1 ? 'applicant' : 'applicants'} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('move')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Move to Stage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('message')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('tag')}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Add Tags
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('download')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resumes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('reject')}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApplications(new Set())}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <FiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
            availableRecruiters={availableRecruiters}
            availableLocations={availableLocations}
            availableSkills={availableSkills}
            availableTags={availableTags}
          />
        )}

        {/* Pipeline Board */}
        {viewMode === 'kanban' ? (
          <div className="space-y-6">
            {/* Stage Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {pipelineStages.map((stage) => {
                const stageApps = applicationsByStage[stage.id as PipelineStageType] || [];
                const metrics = stageMetrics[stage.id];
                return (
                  <StageStatistics
                    key={stage.id}
                    stageId={stage.id}
                    stageName={stage.name}
                    metrics={metrics}
                    applicantCount={stageApps.length}
                    maxApplicants={stage.maxApplicants}
                  />
                );
              })}
            </div>

            {/* Kanban Board */}
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {pipelineStages.map((stage) => (
                  <PipelineStage
                    key={stage.id}
                    stage={stage}
                    applications={applicationsByStage[stage.id as PipelineStageType] || []}
                    onViewApplication={handleViewApplication}
                    onMoveApplication={handleMoveToStage}
                    selectedApplications={selectedApplications}
                    onSelectApplication={toggleApplicationSelection}
                  />
                ))}
              </div>
              {/* Scroll Indicator */}
              <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </div>
        ) : (
          <Card className="border border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedApplications.size === filteredApplications.length && filteredApplications.length > 0}
                          onChange={selectAll}
                          className="w-4 h-4"
                        />
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Candidate</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Job Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Match Score</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Applied</th>
                      <th className="p-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr
                        key={application.id}
                        className={cn(
                          "border-t border-border hover:bg-accent/50 cursor-pointer",
                          selectedApplications.has(application.id) && "bg-primary/5"
                        )}
                        onClick={() => handleViewApplication(application.id)}
                      >
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedApplications.has(application.id)}
                            onChange={(e) => toggleApplicationSelection(application.id, e.target.checked)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{application.candidateName}</div>
                          <div className="text-sm text-muted-foreground">{application.candidateEmail}</div>
                        </td>
                        <td className="p-4 text-sm text-foreground">{application.jobTitle}</td>
                        <td className="p-4">
                          <Badge variant="default" className="capitalize border border-border">
                            {application.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {application.matchScore !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
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
                              <span className="text-sm font-medium">{application.matchScore}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewApplication(application.id)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <Card className="border border-border">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'No applicants match your search'
                  : 'No applicants yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters'
                  : 'No applications have been received for this job posting yet'}
              </p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                >
                  Clear Search & Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Applicant Details Panel */}
        {showDetailsPanel && selectedApplication && (
          <ApplicantDetailsPanel
            application={selectedApplication}
            onClose={() => {
              setShowDetailsPanel(false);
              setSelectedApplication(null);
            }}
            onMoveToStage={(stage) => {
              handleMoveToStage(selectedApplication.id, stage);
              setSelectedApplication({
                ...selectedApplication,
                status: stage,
              });
            }}
          />
        )}
      </div>
    </Layout>
  );
}

