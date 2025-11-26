"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Briefcase, Users, FileText, TrendingUp, Clock, Eye, Percent, Award, ArrowRight } from 'lucide-react';
import { EmployerStats } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

interface StatsGridProps {
  stats: EmployerStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
  bgGradient: string;
  link?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, trend, color, bgGradient, link, subtitle }: StatCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <Card 
      className={cn(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
        link && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {subtitle && (
                <span className="text-xs text-muted-foreground">({subtitle})</span>
              )}
            </div>
            <p className={cn("text-3xl font-bold", color)}>{value}</p>
            {trend && (
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp
                  className={cn(
                    "w-4 h-4",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
            {link && (
              <div className="flex items-center gap-1 mt-3 text-sm text-primary hover:underline">
                <span>View details</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", bgGradient)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({ stats }: StatsGridProps) {
  // Calculate new applications in last 7 days (mock data)
  const newApplicationsLast7Days = Math.floor(stats.totalApplications * 0.15);
  
  // Calculate jobs expiring soon (mock data)
  const jobsExpiringSoon = Math.max(0, stats.activeJobs - Math.floor(stats.activeJobs * 0.8));

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: <Briefcase className="w-7 h-7 text-white" />,
      trend: { value: 8, isPositive: true },
      color: 'text-green-600 dark:text-green-400',
      bgGradient: 'bg-gradient-to-br from-green-500 to-green-600',
      link: '/portal/employer/jobs/manage?status=active',
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: <Users className="w-7 h-7 text-white" />,
      trend: { value: 24, isPositive: true },
      color: 'text-purple-600 dark:text-purple-400',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      link: '/portal/employer/applicants',
    },
    {
      title: 'New Applications',
      value: newApplicationsLast7Days,
      icon: <FileText className="w-7 h-7 text-white" />,
      trend: { value: 12, isPositive: true },
      color: 'text-blue-600 dark:text-blue-400',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      link: '/portal/employer/applicants?status=new',
      subtitle: 'Last 7 days',
    },
    {
      title: 'Jobs Expiring Soon',
      value: jobsExpiringSoon,
      icon: <Clock className="w-7 h-7 text-white" />,
      color: 'text-orange-600 dark:text-orange-400',
      bgGradient: 'bg-gradient-to-br from-orange-500 to-orange-600',
      link: '/portal/employer/jobs/manage?expiring=true',
      subtitle: 'Next 7 days',
    },
    {
      title: 'Avg. Time to Fill',
      value: `${stats.averageTimeToHire} days`,
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      trend: { value: -5, isPositive: true },
      color: 'text-indigo-600 dark:text-indigo-400',
      bgGradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      link: '/portal/employer/analytics',
    },
    {
      title: 'Hire Rate',
      value: `${((stats.hiredCount / Math.max(stats.totalApplications, 1)) * 100).toFixed(1)}%`,
      icon: <Award className="w-7 h-7 text-white" />,
      trend: { value: 15, isPositive: true },
      color: 'text-emerald-600 dark:text-emerald-400',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      link: '/portal/employer/analytics',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
