"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import {
  ArrowLeft,
  Edit,
  Copy,
  Pause,
  Play,
  X,
  Users,
  BarChart3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
} from 'lucide-react';
import { cn } from '@/utils';
import { JobActionsMenu } from './components/JobActionsMenu';
import { updateJob, deleteJob, duplicateJob } from '@/store/features/employer/employerSlice';

const statusColors = {
  active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  closed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  draft: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { jobs } = useAppSelector((state) => state.employer);
  const jobId = params?.jobId as string;

  const job = jobs.find(j => j.id === jobId);

  useEffect(() => {
    if (!job && jobs.length > 0) {
      router.push('/portal/employer/jobs/manage');
    }
  }, [job, jobs.length, router]);

  if (!job) {
    return (
      <Layout noCard title="Job Not Found" role="employer">
        <Card className="border border-border">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => router.push('/portal/employer/jobs/manage')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Manage Jobs
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const handleDuplicate = () => {
    if (window.confirm('Duplicate this job? It will be created as a draft.')) {
      dispatch(duplicateJob(job.id));
      alert(`Job "${job.title}" has been duplicated successfully!`);
      router.push('/portal/employer/jobs/manage');
    }
  };

  const handleStatusChange = (newStatus: 'active' | 'paused' | 'closed') => {
    const statusLabels: Record<string, string> = {
      active: 'activated',
      paused: 'paused',
      closed: 'closed',
    };
    dispatch(updateJob({
      ...job,
      status: newStatus as any,
    }));
    alert(`Job "${job.title}" has been ${statusLabels[newStatus]} successfully!`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      dispatch(deleteJob(job.id));
      alert(`Job "${job.title}" has been deleted successfully!`);
      router.push('/portal/employer/jobs/manage');
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin || !job.salaryMax) return null;
    const min = parseInt(job.salaryMin).toLocaleString();
    const max = parseInt(job.salaryMax).toLocaleString();
    return `${job.currency || 'USD'} ${min} - ${max} ${job.salaryPeriod === 'yearly' ? 'per year' : job.salaryPeriod === 'monthly' ? 'per month' : 'per hour'}`;
  };

  return (
    <Layout noCard title={job.title} role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <Badge
                  variant="default"
                  className={cn('border', statusColors[job.status])}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <JobActionsMenu
              job={job}
              onViewDetails={() => {}}
              onEdit={() => router.push(`/portal/employer/jobs/${job.id}/edit`)}
              onDuplicate={handleDuplicate}
              onPause={() => handleStatusChange('paused')}
              onResume={() => handleStatusChange('active')}
              onClose={() => handleStatusChange('closed')}
              onViewApplicants={() => router.push(`/portal/employer/jobs/${job.id}/applicants`)}
              onViewAnalytics={() => router.push(`/portal/employer/jobs/${job.id}/analytics`)}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-bold text-foreground">{job.views}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">{job.applications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Match Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {job.applications > 0 ? Math.round((job.applications / job.views) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Active</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Details */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            {job.description && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-foreground">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-foreground">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="text-foreground font-medium capitalize">{job.employmentType}</p>
                  </div>
                </div>
                {job.remoteType && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Remote Type</p>
                      <p className="text-foreground font-medium capitalize">{job.remoteType}</p>
                    </div>
                  </div>
                )}
                {formatSalary() && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="text-foreground font-medium">{formatSalary()}</p>
                    </div>
                  </div>
                )}
                {job.expiresAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expires</p>
                      <p className="text-foreground font-medium">
                        {new Date(job.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/portal/employer/jobs/${job.id}/applicants`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Applicants ({job.applications})
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/portal/employer/jobs/${job.id}/analytics`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/portal/employer/jobs/${job.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

