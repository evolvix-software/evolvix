/**
 * Applications Page - View and manage job applications
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText,
  Eye,
  Trash2,
  Filter,
  Search,
  Calendar,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { EmptyState } from '@/components/common/ui/EmptyState';
import { Skeleton } from '@/components/common/ui/SkeletonLoader';
import { JobApplication, ApplicationStatus } from '@/interfaces/jobs';
import { 
  getApplications, 
  updateApplicationStatus,
  getJobById 
} from '@/services/jobService';
import { Job } from '@/data/mock/jobsData';
import { formatTimeAgo } from '@/data/mock/jobsData';
import { cn } from '@/utils';

export function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (companyFilter !== 'all') {
      filtered = filtered.filter(app => app.company === companyFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  }, [applications, statusFilter, companyFilter, searchQuery]);

  const companies = useMemo(() => {
    return Array.from(new Set(applications.map(app => app.company))).sort();
  }, [applications]);

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      pending: 0,
      reviewing: 0,
      interview: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
    };
    applications.forEach(app => {
      counts[app.status]++;
    });
    return counts;
  }, [applications]);

  const handleViewDetails = async (application: JobApplication) => {
    setSelectedApplication(application);
    const job = await getJobById(application.jobId);
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleWithdraw = async () => {
    if (!selectedApplication) return;
    
    try {
      await updateApplicationStatus(selectedApplication.id, 'withdrawn', 'Application withdrawn by user');
      await loadApplications();
      setShowWithdrawModal(false);
      setShowDetailsModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const config = {
      pending: { variant: 'warning' as const, label: 'Pending', icon: Clock },
      reviewing: { variant: 'default' as const, label: 'Under Review', icon: Eye },
      interview: { variant: 'primary' as const, label: 'Interview', icon: Calendar },
      accepted: { variant: 'success' as const, label: 'Accepted', icon: CheckCircle2 },
      rejected: { variant: 'error' as const, label: 'Rejected', icon: XCircle },
      withdrawn: { variant: 'default' as const, label: 'Withdrawn', icon: XCircle },
    };
    
    const { variant, label, icon: Icon } = config[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton variant="text" lines={3} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{statusCounts.reviewing}</div>
            <div className="text-sm text-muted-foreground">Reviewing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{statusCounts.interview}</div>
            <div className="text-sm text-muted-foreground">Interview</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{statusCounts.accepted}</div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{statusCounts.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
              className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>

            {/* Company Filter */}
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={applications.length === 0 ? "No Applications Yet" : "No Applications Found"}
          description={
            applications.length === 0
              ? "Start applying to jobs to see your applications here"
              : "Try adjusting your filters to see more results"
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map(application => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {application.jobTitle}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {application.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied {formatTimeAgo(application.appliedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {application.resumeName}
                      </div>
                    </div>
                    {application.updates.length > 1 && (
                      <div className="text-xs text-muted-foreground">
                        Last update: {formatTimeAgo(application.updates[application.updates.length - 1].date)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(application)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {application.status !== 'withdrawn' && 
                     application.status !== 'accepted' && 
                     application.status !== 'rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowWithdrawModal(true);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && selectedJob && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
            setSelectedJob(null);
          }}
          title="Application Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Job Info */}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {selectedApplication.jobTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedApplication.company} • {selectedJob.location}
              </p>
            </div>

            {/* Application Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Applied On</label>
                <p className="text-sm text-foreground mt-1">
                  {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Resume</label>
                <p className="text-sm text-foreground mt-1">{selectedApplication.resumeName}</p>
              </div>
              {selectedApplication.coverLetterContent && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cover Letter</label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedApplication.coverLetterContent}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Updates */}
            {selectedApplication.updates.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Status Updates</h4>
                <div className="space-y-3">
                  {selectedApplication.updates.map((update, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          update.status === 'accepted' && "bg-success",
                          update.status === 'rejected' && "bg-destructive",
                          update.status === 'interview' && "bg-primary",
                          update.status === 'reviewing' && "bg-primary",
                          "bg-muted-foreground"
                        )} />
                        {index < selectedApplication.updates.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(update.date)}
                          </span>
                        </div>
                        {update.note && (
                          <p className="text-sm text-muted-foreground">{update.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedApplication.status !== 'withdrawn' && 
             selectedApplication.status !== 'accepted' && 
             selectedApplication.status !== 'rejected' && (
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowWithdrawModal(true);
                  }}
                >
                  Withdraw Application
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw Application"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to withdraw your application for{' '}
            <span className="font-semibold">
              {selectedApplication?.jobTitle} at {selectedApplication?.company}
            </span>?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. You can apply again later if the position is still open.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowWithdrawModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleWithdraw}>
              Withdraw Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

