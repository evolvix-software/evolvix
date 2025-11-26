"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Sparkles, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/common/ui/Badge';

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'success',
    title: 'High Match Rate Detected',
    description: 'Your "Senior Software Engineer" posting has a 92% average match score. Consider reviewing top candidates.',
    action: {
      label: 'View Candidates',
      href: '/portal/employer/applicants?job=1',
    },
  },
  {
    id: '2',
    type: 'tip',
    title: 'Optimize Job Posting',
    description: 'Adding remote work option could increase applications by 40% based on similar roles.',
    action: {
      label: 'Edit Job',
      href: '/portal/employer/jobs/manage?edit=1',
    },
  },
  {
    id: '3',
    type: 'warning',
    title: 'Application Response Time',
    description: 'Average response time is 5 days. Responding within 24 hours improves candidate experience by 60%.',
    action: {
      label: 'Review Applications',
      href: '/portal/employer/applicants',
    },
  },
  {
    id: '4',
    type: 'info',
    title: 'Market Trends',
    description: 'Software engineering roles in your area have seen a 15% increase in applications this month.',
  },
];

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'success':
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-amber-600" />;
    case 'info':
      return <Users className="w-5 h-5 text-blue-600" />;
    case 'tip':
      return <Sparkles className="w-5 h-5 text-purple-600" />;
    default:
      return <Sparkles className="w-5 h-5 text-gray-600" />;
  }
};

const getInsightBadgeColor = (type: Insight['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'warning':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'tip':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

export function AIInsights() {
  return (
    <Card className="border border-border hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Insights
          </CardTitle>
          <Badge variant="info" className="text-xs">
            Powered by AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{insight.title}</h4>
                  <Badge className={`text-xs ${getInsightBadgeColor(insight.type)}`}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                {insight.action && (
                  <a
                    href={insight.action.href}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {insight.action.label}
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

