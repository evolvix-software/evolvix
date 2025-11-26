"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { BarChart3, TrendingUp, PieChart, LineChart, Calendar } from 'lucide-react';
import { Job } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

interface JobPerformanceChartProps {
  jobs: Job[];
}

type ChartType = 'applications' | 'top-jobs' | 'status';
type TimePeriod = '7d' | '30d' | '90d' | 'custom';

export function JobPerformanceChart({ jobs }: JobPerformanceChartProps) {
  const [chartType, setChartType] = useState<ChartType>('applications');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');

  // Calculate applications over time (mock data)
  const applicationsOverTime = [
    { date: 'Week 1', applications: 45 },
    { date: 'Week 2', applications: 62 },
    { date: 'Week 3', applications: 38 },
    { date: 'Week 4', applications: 71 },
  ];

  // Top performing jobs
  const topJobs = [...jobs]
    .sort((a, b) => (b.applications + b.views) - (a.applications + a.views))
    .slice(0, 5);

  // Applications by status (mock data)
  const applicationsByStatus = [
    { status: 'New', count: 45, color: 'bg-blue-500' },
    { status: 'Reviewed', count: 32, color: 'bg-purple-500' },
    { status: 'Shortlisted', count: 18, color: 'bg-green-500' },
    { status: 'Interviewed', count: 12, color: 'bg-yellow-500' },
    { status: 'Hired', count: 8, color: 'bg-emerald-500' },
    { status: 'Rejected', count: 25, color: 'bg-red-500' },
  ];

  const maxApplications = Math.max(...applicationsOverTime.map(d => d.applications), 1);
  const maxTopJobs = Math.max(...topJobs.map(j => j.applications + j.views), 1);
  const maxStatus = Math.max(...applicationsByStatus.map(s => s.count), 1);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg font-semibold">Job Performance</CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Button
            variant={chartType === 'applications' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('applications')}
            className="flex items-center gap-2"
          >
            <LineChart className="w-4 h-4" />
            Applications Over Time
          </Button>
          <Button
            variant={chartType === 'top-jobs' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('top-jobs')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Top Jobs
          </Button>
          <Button
            variant={chartType === 'status' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('status')}
            className="flex items-center gap-2"
          >
            <PieChart className="w-4 h-4" />
            By Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No job data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Applications Over Time - Line Chart */}
            {chartType === 'applications' && (
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-2 h-48">
                  {applicationsOverTime.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full h-full flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-purple-600 rounded-t-lg transition-all hover:opacity-80 group-hover:scale-105"
                          style={{ height: `${(data.applications / maxApplications) * 100}%` }}
                          title={`${data.applications} applications`}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{data.date}</div>
                      <div className="text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.applications}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-purple-600" />
                    <span>Applications</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performing Jobs - Bar Chart */}
            {chartType === 'top-jobs' && (
              <div className="space-y-4">
                {topJobs.map((job) => {
                  const totalScore = job.applications + job.views;
                  return (
                    <div key={job.id} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground truncate flex-1">
                          {job.title}
                        </span>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground ml-4">
                          <span>{job.applications} apps</span>
                          <span>{job.views} views</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Applications</span>
                            <span className="text-xs font-medium text-foreground">
                              {job.applications}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all group-hover:opacity-80"
                              style={{ width: `${(job.applications / maxTopJobs) * 100}%` }}
                              title={`${job.applications} applications`}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Views</span>
                            <span className="text-xs font-medium text-foreground">
                              {job.views}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all group-hover:opacity-80"
                              style={{ width: `${(job.views / maxTopJobs) * 100}%` }}
                              title={`${job.views} views`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Applications By Status - Pie Chart Representation */}
            {chartType === 'status' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {applicationsByStatus.map((status) => (
                    <div key={status.status} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded-full", status.color)} />
                          <span className="text-sm font-medium text-foreground">{status.status}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{status.count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all group-hover:opacity-80", status.color)}
                          style={{ width: `${(status.count / maxStatus) * 100}%` }}
                          title={`${status.count} ${status.status.toLowerCase()} applications`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground text-center">
                    Total: {applicationsByStatus.reduce((sum, s) => sum + s.count, 0)} applications
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
