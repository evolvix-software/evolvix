"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { StudentStats } from '@/store/features/student/studentSlice';

interface StatsCardsProps {
  stats: StudentStats;
}

const statItems = [
  {
    key: 'coursesEnrolled' as keyof StudentStats,
    label: 'Courses Enrolled',
    icon: BookOpen,
    color: 'orange',
    bgColor: 'bg-[#635bff]/10 dark:bg-[#635bff]/20',
    textColor: 'text-[#635bff] dark:text-[#735fff]'
  },
  {
    key: 'mentorsConnected' as keyof StudentStats,
    label: 'Mentors Connected',
    icon: Users,
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400'
  },
  {
    key: 'certificatesEarned' as keyof StudentStats,
    label: 'Certificates Earned',
    icon: Award,
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    key: 'progressScore' as keyof StudentStats,
    label: 'Progress Score',
    icon: TrendingUp,
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400'
  }
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        const displayValue = item.key === 'progressScore' ? `${value}%` : value.toString();
        
        return (
          <Card key={item.key} className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${item.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${item.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayValue}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

