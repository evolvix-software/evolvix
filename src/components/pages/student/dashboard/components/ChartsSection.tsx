"use client";

import { AnimatedBarChart } from '@/components/common/dashboard/common/AnimatedBarChart';
import { LineChart } from '@/components/common/dashboard/common/LineChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Brain } from 'lucide-react';

export function ChartsSection() {
  // Skill Progress Over Time
  const skillProgressData = [
    { label: 'Jan', value: 65, maxValue: 100 },
    { label: 'Feb', value: 72, maxValue: 100 },
    { label: 'Mar', value: 68, maxValue: 100 },
    { label: 'Apr', value: 85, maxValue: 100 },
    { label: 'May', value: 80, maxValue: 100 },
    { label: 'Jun', value: 92, maxValue: 100 },
  ];

  // Course Completion Percentage
  const courseCompletionData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 58 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 72 },
    { label: 'Jun', value: 78 },
  ];

  // Interview Readiness Score
  const interviewReadinessData = [
    { label: 'Jan', value: 3.2 },
    { label: 'Feb', value: 3.5 },
    { label: 'Mar', value: 3.8 },
    { label: 'Apr', value: 4.1 },
    { label: 'May', value: 4.3 },
    { label: 'Jun', value: 4.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <AnimatedBarChart
          title="Skill Progress Over Time"
          description="Last 6 months"
          data={skillProgressData}
          height={200}
        />
        <LineChart
          title="Course Completion Percentage"
          description="Completion rate trend"
          data={courseCompletionData}
          height={200}
          color="green"
        />
      </div>

      {/* Interview Readiness - Full Width */}
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
            <Brain className="w-5 h-5 text-primary" />
            <span>Interview Readiness Score</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Your interview preparation progress</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            title=""
            description=""
            data={interviewReadinessData}
            height={180}
            color="purple"
          />
          <div className="mt-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.6</div>
              <div className="text-sm text-muted-foreground">Current Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

