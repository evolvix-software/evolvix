"use client";

import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';
import { StudentStats } from '@/store/features/student/studentSlice';

interface StatsGridProps {
  stats: StudentStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={BookOpen}
        value={stats.coursesEnrolled}
        label="Courses Enrolled"
        trend={{ value: 5, isPositive: true }}
        {...STAT_CARD_COLORS.blue}
      />
      <StatsCard
        icon={Users}
        value={stats.mentorsConnected}
        label="Mentors Connected"
        trend={{ value: 3, isPositive: true }}
        {...STAT_CARD_COLORS.purple}
      />
      <StatsCard
        icon={Award}
        value={stats.certificatesEarned}
        label="Certificates Earned"
        trend={{ value: 2, isPositive: true }}
        {...STAT_CARD_COLORS.yellow}
      />
      <StatsCard
        icon={TrendingUp}
        value={`${stats.progressScore}%`}
        label="Progress Score"
        trend={{ value: 8, isPositive: true }}
        {...STAT_CARD_COLORS.green}
      />
    </div>
  );
}

