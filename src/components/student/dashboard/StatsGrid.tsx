"use client";

import { BookOpen, Users, Award, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/common/StatCard';
import { StudentStats } from '@/store/features/student/studentSlice';

interface StatsGridProps {
  stats: StudentStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<BookOpen className="w-5 h-5" />}
        value={stats.coursesEnrolled}
        label="Courses Enrolled"
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        icon={<Users className="w-5 h-5" />}
        value={stats.mentorsConnected}
        label="Mentors Connected"
        trend={{ value: 3, isPositive: true }}
      />
      <StatCard
        icon={<Award className="w-5 h-5" />}
        value={stats.certificatesEarned}
        label="Certificates Earned"
        trend={{ value: 2, isPositive: true }}
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        value={`${stats.progressScore}%`}
        label="Progress Score"
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  );
}

