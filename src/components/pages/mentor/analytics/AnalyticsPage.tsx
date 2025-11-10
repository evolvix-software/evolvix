"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClassAnalyticsComponent,
  StudentPerformance,
  RevenueAnalytics,
  RatingsReviews,
  FinancialAnalytics,
  StudentAnalytics,
  CourseAnalytics,
  TeachingAnalytics
} from './components';
import {
  mockClassAnalytics,
  mockStudentPerformance,
  mockRevenueData,
  mockMentorAnalytics
} from '@/data/mock/analytics';
import {
  Users,
  TrendingUp,
  DollarSign,
  Star,
  BarChart3,
  BookOpen,
  MessageSquare,
  FileText
} from 'lucide-react';

export function MentorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('financial');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Analytics & Reports
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Track class performance, student progress, revenue, and ratings
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden lg:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">Students</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="teaching" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">Teaching</span>
          </TabsTrigger>
          <TabsTrigger value="class" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">Class</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden lg:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden lg:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span className="hidden lg:inline">Ratings</span>
          </TabsTrigger>
        </TabsList>

        {/* Financial Analytics Tab */}
        <TabsContent value="financial" className="mt-6">
          <FinancialAnalytics revenueData={mockRevenueData} />
        </TabsContent>

        {/* Student Analytics Tab */}
        <TabsContent value="students" className="mt-6">
          <StudentAnalytics performance={mockStudentPerformance} />
        </TabsContent>

        {/* Course Analytics Tab */}
        <TabsContent value="courses" className="mt-6">
          <CourseAnalytics />
        </TabsContent>

        {/* Teaching Analytics Tab */}
        <TabsContent value="teaching" className="mt-6">
          <TeachingAnalytics />
        </TabsContent>

        {/* Class Analytics Tab */}
        <TabsContent value="class" className="mt-6">
          <ClassAnalyticsComponent analytics={mockClassAnalytics} />
        </TabsContent>

        {/* Student Performance Tab */}
        <TabsContent value="performance" className="mt-6">
          <StudentPerformance performance={mockStudentPerformance} />
        </TabsContent>

        {/* Revenue Analytics Tab */}
        <TabsContent value="revenue" className="mt-6">
          <RevenueAnalytics revenueData={mockRevenueData} />
        </TabsContent>

        {/* Ratings & Reviews Tab */}
        <TabsContent value="ratings" className="mt-6">
          <RatingsReviews analytics={mockMentorAnalytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

