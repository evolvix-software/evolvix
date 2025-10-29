"use client";

import { Calendar, Users, Star, FileText, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/common/StatCard';

interface MentorStats {
  totalClasses: number;
  totalStudents: number;
  averageRating: number;
  pendingReviews: number;
  pendingPayments: number;
}

interface StatsGridProps {
  stats: MentorStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        icon={<Calendar className="w-5 h-5" />}
        value={stats.totalClasses}
        label="Total Classes"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        icon={<Users className="w-5 h-5" />}
        value={stats.totalStudents}
        label="Students Guided"
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        icon={<Star className="w-5 h-5" />}
        value={stats.averageRating.toFixed(1)}
        label="Avg Rating"
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard
        icon={<FileText className="w-5 h-5" />}
        value={stats.pendingReviews}
        label="Pending Reviews"
      />
      <StatCard
        icon={<DollarSign className="w-5 h-5" />}
        value={`$${stats.pendingPayments.toLocaleString()}`}
        label="Pending Payments"
      />
    </div>
  );
}

