"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Briefcase, Eye, Users, Calendar, ArrowRight } from 'lucide-react';
import { Job } from '@/store/features/employer/employerSlice';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';

interface RecentJobsProps {
  jobs: Job[];
}

const statusColors = {
  active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  closed: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  draft: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  expired: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export function RecentJobs({ jobs }: RecentJobsProps) {
  const router = useRouter();

  if (jobs.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No jobs posted yet</p>
            <Button
              className="mt-4"
              onClick={() => router.push('/portal/employer/jobs/new')}
            >
              Post Your First Job
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Jobs</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/portal/employer/jobs/manage')}
        >
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-all cursor-pointer group"
              onClick={() => router.push(`/portal/employer/jobs/${job.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.employmentType}</span>
                    </span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn('border', statusColors[job.status])}
                >
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center space-x-6 mt-3 text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{job.views} views</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{job.applications} applications</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

