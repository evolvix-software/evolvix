"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClassAnalyticsComponent,
  StudentPerformance,
  RevenueAnalytics,
  RatingsReviews
} from './analytics';
import {
  mockClassAnalytics,
  mockStudentPerformance,
  mockRevenueData,
  mockMentorAnalytics
} from './analytics/mockData';
import {
  Users,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';

export function AnalyticsContent() {
  const [activeTab, setActiveTab] = useState('class');

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="class" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Class Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Student Performance</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Revenue Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Ratings & Reviews</span>
          </TabsTrigger>
        </TabsList>

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



