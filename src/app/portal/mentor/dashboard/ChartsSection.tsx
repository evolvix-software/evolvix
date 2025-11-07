"use client";

import { AnimatedBarChart } from '@/components/dashboard/common/AnimatedBarChart';
import { LineChart } from '@/components/dashboard/common/LineChart';

export function ChartsSection() {
  const attendanceData = [
    { label: 'Jan', value: 45, maxValue: 60 },
    { label: 'Feb', value: 52, maxValue: 60 },
    { label: 'Mar', value: 48, maxValue: 60 },
    { label: 'Apr', value: 58, maxValue: 60 },
    { label: 'May', value: 55, maxValue: 60 },
    { label: 'Jun', value: 62, maxValue: 60 },
  ];

  const satisfactionData = [
    { label: 'Jan', value: 4.2 },
    { label: 'Feb', value: 4.5 },
    { label: 'Mar', value: 4.3 },
    { label: 'Apr', value: 4.7 },
    { label: 'May', value: 4.6 },
    { label: 'Jun', value: 4.9 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <LineChart
        title="Class Attendance Trend"
        description="Last 6 months"
        data={attendanceData}
        height={200}
        color="green"
      />
      <LineChart
        title="Student Satisfaction"
        description="Average rating trend"
        data={satisfactionData}
        height={200}
        color="blue"
      />
    </div>
  );
}



