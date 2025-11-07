"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  description?: string;
  data: LineChartData[];
  height?: number;
  color?: string;
}

export function LineChart({ title, description, data, height = 200, color = 'green' }: LineChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{title}</CardTitle>
          {description && <CardDescription className="text-slate-600 dark:text-slate-400">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <p className="text-sm text-slate-500 dark:text-slate-400">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return { x, y, value: item.value, label: item.label };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">{title}</CardTitle>
        {description && <CardDescription className="text-slate-600 dark:text-slate-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }} className="relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={`url(#gradient-${color})`}
              className={`transition-opacity duration-1000 ${animated ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'}
              strokeWidth="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-1000 ${animated ? 'opacity-100' : 'opacity-0'}`}
              style={{
                strokeDasharray: animated ? '1000' : '0',
                strokeDashoffset: animated ? '0' : '1000',
              }}
            />
            {/* Points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="1"
                fill={color === 'green' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'}
                className={`transition-all duration-500 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              />
            ))}
          </svg>
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            {data.slice(0, 5).map((item, i) => (
              <span key={i} className="truncate">{item.label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



