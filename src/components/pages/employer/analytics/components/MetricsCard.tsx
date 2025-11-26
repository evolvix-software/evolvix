"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function MetricsCard({
  title,
  value,
  previousValue,
  change,
  icon,
  onClick,
}: MetricsCardProps) {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-4 h-4" />;
    return change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-muted-foreground';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card
      className={cn(
        "border border-border hover:shadow-lg transition-all",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change !== undefined && previousValue !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {getTrendIcon()}
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {Math.abs(change)}% {change > 0 ? 'increase' : change < 0 ? 'decrease' : ''}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs previous period
                </span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

