"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';

interface BarData {
  label: string;
  value: number;
  maxValue: number;
}

interface AnimatedBarChartProps {
  title: string;
  description?: string;
  data: BarData[];
  height?: number;
}

export function AnimatedBarChart({ title, description, data, height = 200 }: AnimatedBarChartProps) {
  const [animatedData, setAnimatedData] = useState<BarData[]>([]);

  useEffect(() => {
    // Animate bars appearing
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const maxValue = Math.max(...data.map(d => d.maxValue));

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{title}</CardTitle>
        {description && (
          <CardDescription className="text-slate-600 dark:text-slate-400">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4" style={{ minHeight: `${height}px` }}>
          {animatedData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-slate-500 dark:text-slate-400">No data available</p>
            </div>
          ) : (
            animatedData.map((item, index) => {
              const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animatedData.length > 0 ? `${percentage}%` : '0%',
                        transition: `width 1s ease-out ${index * 0.15}s`
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

