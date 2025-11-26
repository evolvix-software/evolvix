"use client";

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase,
  Download,
  FileText,
  Eye,
  Clock,
  Target
} from 'lucide-react';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { AnimatedBarChart } from '@/components/common/dashboard/common/AnimatedBarChart';
import { DateRangeSelector, DateRangeOption } from './components/DateRangeSelector';
import { MetricsCard } from './components/MetricsCard';
import { format, subDays } from 'date-fns';

export function AnalyticsPage() {
  const { stats, jobs, applications } = useAppSelector((state) => state.employer);
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Mock data for charts
  const applicationsOverTime = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 180;
    return Array.from({ length: days }, (_, i) => ({
      label: format(subDays(endDate, days - i - 1), 'MMM d'),
      value: Math.floor(Math.random() * 50) + 10,
    }));
  }, [dateRange, endDate]);

  const topPerformingJobs = useMemo(() => {
    return jobs
      .slice(0, 5)
      .map(job => ({
        label: job.title.length > 20 ? job.title.substring(0, 20) + '...' : job.title,
        value: job.applications,
        maxValue: Math.max(...jobs.map(j => j.applications), 1),
      }));
  }, [jobs]);

  const pipelineStages = useMemo(() => {
    const stages = ['new', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'] as const;
    return stages.map(stage => ({
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: applications.filter(app => app.status === stage).length,
      maxValue: applications.length || 1,
    }));
  }, [applications]);

  const applicationSources = useMemo(() => {
    return [
      { label: 'Career Page', value: 45 },
      { label: 'Job Board', value: 30 },
      { label: 'Referral', value: 15 },
      { label: 'Direct', value: 10 },
    ];
  }, []);

  const handleDateRangeChange = (range: DateRangeOption, start?: Date, end?: Date) => {
    setDateRange(range);
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // TODO: Implement export functionality
    console.log(`Exporting analytics as ${format}`);
  };

  const hireRate = stats.totalApplications > 0 
    ? ((stats.hiredCount / stats.totalApplications) * 100).toFixed(1)
    : '0';

  return (
    <Layout noCard title="Analytics" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your hiring performance and insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeSelector
              value={dateRange}
              onChange={handleDateRangeChange}
              startDate={startDate}
              endDate={endDate}
            />
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricsCard
            title="Total Jobs"
            value={stats.totalJobs}
            previousValue={stats.totalJobs - 2}
            change={5.2}
            icon={<Briefcase className="w-6 h-6 text-blue-600" />}
          />
          <MetricsCard
            title="Total Applications"
            value={stats.totalApplications}
            previousValue={stats.totalApplications - 20}
            change={8.7}
            icon={<Users className="w-6 h-6 text-purple-600" />}
          />
          <MetricsCard
            title="Hire Rate"
            value={`${hireRate}%`}
            previousValue="6.5%"
            change={1.2}
            icon={<Target className="w-6 h-6 text-green-600" />}
          />
          <MetricsCard
            title="Avg. Time to Hire"
            value={`${stats.averageTimeToHire} days`}
            previousValue="16 days"
            change={-2}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Applications Over Time */}
          <LineChart
            title="Applications Over Time"
            description={`Last ${dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : dateRange === '90d' ? '90 days' : '6 months'}`}
            data={applicationsOverTime}
            height={250}
            color="blue"
          />

          {/* Top Performing Jobs */}
          <AnimatedBarChart
            title="Top Performing Jobs"
            description="By number of applications"
            data={topPerformingJobs}
            height={250}
          />
        </div>

        {/* Pipeline Analytics */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Pipeline Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedBarChart
              title=""
              description=""
              data={pipelineStages}
              height={200}
            />
          </CardContent>
        </Card>

        {/* Application Sources */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Application Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationSources.map((source, index) => {
                  const total = applicationSources.reduce((sum, s) => sum + s.value, 0);
                  const percentage = (source.value / total) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{source.label}</span>
                        <span className="font-semibold text-foreground">
                          {source.value} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Job Performance Metrics */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Job Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Total Views</p>
                      <p className="text-xs text-muted-foreground">Across all jobs</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.jobViews}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Application Rate</p>
                      <p className="text-xs text-muted-foreground">Views to applications</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.applicationRate}%</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Active Jobs</p>
                      <p className="text-xs text-muted-foreground">Currently posted</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.activeJobs}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Pending Applications</p>
                      <p className="text-xs text-muted-foreground">Awaiting review</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>
                <FileText className="w-4 h-4 mr-2" />
                Export as Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
