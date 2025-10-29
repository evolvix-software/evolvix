"use client";

import { AnimatedBarChart } from '@/components/dashboard/common/AnimatedBarChart';
import { LineChart } from '@/components/dashboard/common/LineChart';

export function ChartsSection() {
  const progressData = [
    { label: 'Jan', value: 65, maxValue: 100 },
    { label: 'Feb', value: 72, maxValue: 100 },
    { label: 'Mar', value: 68, maxValue: 100 },
    { label: 'Apr', value: 85, maxValue: 100 },
    { label: 'May', value: 80, maxValue: 100 },
    { label: 'Jun', value: 92, maxValue: 100 },
  ];

  const learningData = [
    { label: 'Jan', value: 4.2 },
    { label: 'Feb', value: 4.5 },
    { label: 'Mar', value: 4.3 },
    { label: 'Apr', value: 4.7 },
    { label: 'May', value: 4.6 },
    { label: 'Jun', value: 4.9 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <AnimatedBarChart
        title="Learning Progress"
        description="Last 6 months"
        data={progressData}
        height={200}
      />
      <LineChart
        title="Course Ratings"
        description="Average rating trend"
        data={learningData}
        height={200}
        color="blue"
      />
    </div>
  );
}

