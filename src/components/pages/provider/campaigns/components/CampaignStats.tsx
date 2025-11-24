"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

interface CampaignStatsProps {
  stats: {
    total: number;
    draft: number;
    open: number;
    closed: number;
    completed: number;
  };
}

export function CampaignStats({ stats }: CampaignStatsProps) {
  const statItems = [
    {
      label: 'Total Campaigns',
      value: stats.total,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Draft',
      value: stats.draft,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900',
    },
    {
      label: 'Open',
      value: stats.open,
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Closed',
      value: stats.closed,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
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
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

