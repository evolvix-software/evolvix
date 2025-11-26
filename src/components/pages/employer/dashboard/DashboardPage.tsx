"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loadEmployerData } from '@/store/features/employer/employerThunks';
import { Layout } from '@/components/common/layout/Layout';
import {
  WelcomeHeader,
  StatsGrid,
  RecentJobs,
  RecentApplications,
  RecentActivity,
  QuickActions,
  JobPerformanceChart,
  AIInsights,
  UpcomingTasks,
} from './components';
import { Card, CardContent } from '@/components/common/forms/Card';

export function EmployerDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { stats, jobs, applications, recentActivity, isLoading } = useAppSelector(
    (state) => state.employer
  );
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    } else {
      setUserData({ fullName: 'Employer', role: 'employer' });
    }

    // Load employer data
    if (applications.length === 0 && jobs.length === 0) {
      console.log('[EmployerDashboardPage] Data not loaded, loading employer data...');
      dispatch(loadEmployerData());
    } else {
      console.log('[EmployerDashboardPage] Data already loaded:', {
        applicationsCount: applications.length,
        jobsCount: jobs.length,
      });
    }
  }, [dispatch, applications.length, jobs.length]);

  if (isLoading || !userData) {
    return (
      <Layout noCard title="Dashboard" role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading dashboard...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout noCard title="Dashboard" role="employer">
      <div className="space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader userName={userData.fullName || 'Employer'} />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Performance Chart */}
            <JobPerformanceChart jobs={jobs} />

            {/* AI Insights */}
            <AIInsights />

            {/* Recent Jobs */}
            <RecentJobs jobs={jobs.slice(0, 5)} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <UpcomingTasks />

            {/* Recent Applications */}
            <RecentApplications applications={applications.slice(0, 5)} />

            {/* Recent Activity */}
            <RecentActivity activities={recentActivity.slice(0, 10)} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

