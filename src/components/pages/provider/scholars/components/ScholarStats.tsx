"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Users, Award, GraduationCap, Briefcase, AlertTriangle } from 'lucide-react';

interface ScholarStatsProps {
  stats: {
    total: number;
    active: number;
    graduated: number;
    placed: number;
    atRisk: number;
  };
}

export function ScholarStats({ stats }: ScholarStatsProps) {
  const statItems = [
    {
      label: 'Total Scholars',
      value: stats.total,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: <Award className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Graduated',
      value: stats.graduated,
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      label: 'Job Placed',
      value: stats.placed,
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'At Risk',
      value: stats.atRisk,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

