"use client";

import { Star, TrendingUp, Users, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/common/StatCard';
import { LineChart } from '@/components/dashboard/common/LineChart';

export function AnalyticsContent() {
  const ratingData = [
    { label: 'Jan', value: 4.2 },
    { label: 'Feb', value: 4.5 },
    { label: 'Mar', value: 4.3 },
    { label: 'Apr', value: 4.7 },
    { label: 'May', value: 4.6 },
    { label: 'Jun', value: 4.9 },
  ];

  const performanceData = [
    { label: 'Jan', value: 78 },
    { label: 'Feb', value: 82 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 88 },
    { label: 'May', value: 90 },
    { label: 'Jun', value: 92 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analytics & Reports</h2>
        <p className="text-slate-600 dark:text-slate-400">Track class ratings and student performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="w-5 h-5" />}
          value="4.9"
          label="Avg Rating"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          value="156"
          label="Total Sessions"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          value="92%"
          label="Engagement"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          value="$12K"
          label="Total Earnings"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <LineChart
          title="Class Ratings Trend"
          description="Last 6 months"
          data={ratingData}
          height={250}
          color="green"
        />
        <LineChart
          title="Student Performance"
          description="Average scores over time"
          data={performanceData}
          height={250}
          color="blue"
        />
      </div>
    </div>
  );
}

