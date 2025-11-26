"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Badge } from '@/components/common/ui/Badge';
import {
  ArrowLeft,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/utils';

export function JobAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, applications } = useAppSelector((state) => state.employer);
  const jobId = params?.jobId as string;

  const job = jobs.find(j => j.id === jobId);
  const jobApplications = applications.filter(a => a.jobId === jobId);

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
            <Button onClick={() => router.push('/portal/employer/jobs/manage')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Manage Jobs
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const applicationRate = job.views > 0 ? ((job.applications / job.views) * 100).toFixed(1) : '0';
  const daysActive = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Layout noCard title={`Analytics: ${job.title}`} role="employer">
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
              <h1 className="text-2xl font-bold text-foreground">Job Analytics</h1>
              <p className="text-muted-foreground mt-1">{job.title}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-foreground">{job.views}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Applications</p>
                  <p className="text-3xl font-bold text-foreground">{job.applications}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Application Rate</p>
                  <p className="text-3xl font-bold text-foreground">{applicationRate}%</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Days Active</p>
                  <p className="text-3xl font-bold text-foreground">{daysActive}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Applications Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chart coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Status Breakdown */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['new', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'].map((status) => {
                const count = jobApplications.filter(a => a.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className="capitalize">
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${jobApplications.length > 0 ? (count / jobApplications.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

