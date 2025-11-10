"use client";

import { Calendar, Users, Star, FileText, DollarSign, Clock, CheckCircle2, MessageSquare, TrendingUp, BookOpen } from 'lucide-react';
import { StatCard } from '@/components/common/dashboard/common/StatCard';
import { Card, CardContent } from '@/components/common/forms/Card';
import { useState, useMemo } from 'react';
import { useAppSelector } from '@/hooks';

interface MentorStats {
  totalClasses: number;
  totalStudents: number;
  activeStudents: number;
  averageRating: number;
  pendingReviews: number;
  pendingPayments: number;
  totalRevenue: {
    thisMonth: number;
    thisYear: number;
    allTime: number;
  };
  upcomingClasses: number;
  pendingGrading: number;
  completionRate: number;
  responseTime: number; // in hours
  retentionRate: number;
}

interface StatsGridProps {
  stats: MentorStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const [revenueView, setRevenueView] = useState<'month' | 'year' | 'all'>('month');
  const { courses } = useAppSelector((state) => state.courses);
  
  // Calculate course statistics
  const courseStats = useMemo(() => {
    const storedRegistration = typeof window !== 'undefined' ? localStorage.getItem('evolvix_registration') : null;
    const mentorEmail = storedRegistration ? JSON.parse(storedRegistration).email : '';
    const mentorCourses = courses.filter(c => c.instructor.id === 'suhxil14@gmail.com' || c.instructor.id === mentorEmail);
    
    return {
      total: mentorCourses.length,
      published: mentorCourses.filter(c => c.courseStatus === 'published' || !c.courseStatus).length,
      draft: mentorCourses.filter(c => c.courseStatus === 'draft').length,
      pending: mentorCourses.filter(c => c.courseStatus === 'pending-verification').length,
      verified: mentorCourses.filter(c => c.courseStatus === 'verified').length,
      rejected: mentorCourses.filter(c => c.courseStatus === 'rejected').length,
      averageCompletionRate: mentorCourses.length > 0 
        ? mentorCourses.reduce((sum, c) => sum + (c.enrolledCount > 0 ? (c.enrolledCount * 0.75) : 0), 0) / mentorCourses.length 
        : 0,
      topCourse: mentorCourses.length > 0 
        ? mentorCourses.reduce((top, c) => (c.enrolledCount || 0) > (top.enrolledCount || 0) ? c : top, mentorCourses[0])
        : null,
    };
  }, [courses]);

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getRevenueValue = () => {
    switch (revenueView) {
      case 'month': return formatRevenue(stats.totalRevenue.thisMonth);
      case 'year': return formatRevenue(stats.totalRevenue.thisYear);
      case 'all': return formatRevenue(stats.totalRevenue.allTime);
    }
  };

  const getRevenueLabel = () => {
    switch (revenueView) {
      case 'month': return 'Revenue (This Month)';
      case 'year': return 'Revenue (This Year)';
      case 'all': return 'Revenue (All-Time)';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Total Revenue Card with Breakdown */}
        <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setRevenueView('month')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    revenueView === 'month'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => setRevenueView('year')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    revenueView === 'year'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Y
                </button>
                <button
                  onClick={() => setRevenueView('all')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    revenueView === 'all'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{getRevenueValue()}</p>
            <p className="text-sm font-medium text-muted-foreground mb-2">{getRevenueLabel()}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>Month: {formatRevenue(stats.totalRevenue.thisMonth)}</div>
              <div>Year: {formatRevenue(stats.totalRevenue.thisYear)}</div>
              <div>All-Time: {formatRevenue(stats.totalRevenue.allTime)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Active Students */}
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value={stats.activeStudents}
          label="Active Students"
          trend={{ value: 8, isPositive: true }}
        />

        {/* Upcoming Classes */}
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          value={stats.upcomingClasses}
          label="Upcoming Classes"
          trend={{ value: 2, isPositive: true }}
        />

        {/* Pending Grading */}
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          value={stats.pendingGrading}
          label="Pending Grading"
        />

        {/* Average Rating */}
        <StatCard
          icon={<Star className="w-5 h-5" />}
          value={stats.averageRating.toFixed(1)}
          label="Avg Rating"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Completion Rate */}
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          value={`${stats.completionRate}%`}
          label="Completion Rate"
          trend={{ value: 3, isPositive: true }}
        />

        {/* Response Time */}
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          value={`${stats.responseTime}h`}
          label="Avg Response Time"
          trend={{ value: -15, isPositive: true }}
        />

        {/* Student Retention Rate */}
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          value={`${stats.retentionRate}%`}
          label="Retention Rate"
          trend={{ value: 5, isPositive: true }}
        />

        {/* Total Classes */}
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          value={stats.totalClasses}
          label="Total Classes"
          trend={{ value: 12, isPositive: true }}
        />

        {/* Total Students */}
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value={stats.totalStudents}
          label="Total Students"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Course Statistics Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Statistics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Courses */}
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value={courseStats.total}
            label="Total Courses"
          />

          {/* Published Courses */}
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
            value={courseStats.published}
            label="Published"
            className="border-green-200 dark:border-green-800"
          />

          {/* Draft Courses */}
          <StatCard
            icon={<FileText className="w-5 h-5 text-gray-600" />}
            value={courseStats.draft}
            label="Draft"
            className="border-gray-200 dark:border-gray-800"
          />

          {/* Pending Verification */}
          <StatCard
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            value={courseStats.pending}
            label="Pending"
            className="border-yellow-200 dark:border-yellow-800"
          />

          {/* Verified Courses */}
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
            value={courseStats.verified}
            label="Verified"
            className="border-blue-200 dark:border-blue-800"
          />

          {/* Average Completion Rate */}
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={`${Math.round(courseStats.averageCompletionRate)}%`}
            label="Avg Completion"
          />
        </div>
      </div>
    </div>
  );
}

