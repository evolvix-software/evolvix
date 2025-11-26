"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Plus, Briefcase, Users, FileBarChart, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Post a Job',
      icon: <Plus className="w-5 h-5" />,
      onClick: () => router.push('/portal/employer/jobs/new'),
      variant: 'default' as const,
      className: 'bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg transition-all',
    },
    {
      label: 'View All Jobs',
      icon: <Briefcase className="w-5 h-5" />,
      onClick: () => router.push('/portal/employer/jobs/manage'),
      variant: 'outline' as const,
    },
    {
      label: 'View Applicants',
      icon: <Users className="w-5 h-5" />,
      onClick: () => router.push('/portal/employer/applicants'),
      variant: 'outline' as const,
    },
    {
      label: 'View Career Page',
      icon: <FileBarChart className="w-5 h-5" />,
      onClick: () => router.push('/portal/employer/career-page'),
      variant: 'outline' as const,
    },
    {
      label: 'Search Talent',
      icon: <Search className="w-5 h-5" />,
      onClick: () => router.push('/portal/employer/search'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className={cn(
                action.className || '',
                "flex flex-col items-center justify-center h-auto py-4 gap-2"
              )}
            >
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
