"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { TrendingUp, TrendingDown, Minus, Clock, Users, ArrowRight } from 'lucide-react';
import { PipelineStageMetrics } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

interface StageStatisticsProps {
  stageId: string;
  stageName: string;
  metrics?: PipelineStageMetrics;
  applicantCount: number;
  maxApplicants?: number;
}

export function StageStatistics({
  stageId,
  stageName,
  metrics,
  applicantCount,
  maxApplicants,
}: StageStatisticsProps) {
  const capacityPercentage = maxApplicants ? (applicantCount / maxApplicants) * 100 : 0;
  const isNearCapacity = capacityPercentage >= 80;
  const isAtCapacity = capacityPercentage >= 100;

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const stageColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    new: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    reviewed: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
    shortlisted: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-600 dark:text-green-400', dot: 'bg-green-500' },
    interviewed: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
    offered: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    hired: { bg: 'bg-green-600/10', border: 'border-green-600/30', text: 'text-green-700 dark:text-green-500', dot: 'bg-green-600' },
    rejected: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  };

  const stageColor = stageColors[stageId] || stageColors.new;

  return (
    <Card className={cn("border-2 transition-all hover:shadow-md", stageColor.border)}>
      <CardContent className={cn("p-4", stageColor.bg)}>
        <div className="space-y-3">
          {/* Stage Name & Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", stageColor.dot)} />
              <h3 className={cn("font-semibold text-sm", stageColor.text)}>{stageName}</h3>
            </div>
            <Badge 
              variant="default" 
              className={cn(
                "text-xs font-bold min-w-[32px] justify-center",
                stageColor.bg,
                stageColor.text,
                "border-0"
              )}
            >
              {applicantCount}
            </Badge>
          </div>

          {/* Capacity Warning */}
          {maxApplicants && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Capacity</span>
                <span className={cn(
                  "font-medium",
                  isAtCapacity ? "text-destructive" : isNearCapacity ? "text-warning" : "text-foreground"
                )}>
                  {applicantCount} / {maxApplicants}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    isAtCapacity ? "bg-destructive" : isNearCapacity ? "bg-warning" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
              {isNearCapacity && (
                <p className={cn(
                  "text-xs",
                  isAtCapacity ? "text-destructive" : "text-warning"
                )}>
                  {isAtCapacity ? 'Stage is full' : 'Stage is nearly full'}
                </p>
              )}
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className={cn("space-y-2.5 pt-3 border-t", stageColor.border)}>
              {/* Average Time in Stage */}
              {metrics.averageTimeInStage !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Avg. Time</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {Math.round(metrics.averageTimeInStage)}h
                  </span>
                </div>
              )}

              {/* Conversion Rate */}
              {metrics.conversionRate !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Conversion</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      {metrics.conversionRate.toFixed(1)}%
                    </span>
                    {getTrendIcon(metrics.trend)}
                  </div>
                </div>
              )}

              {/* Drop-off Rate */}
              {metrics.dropOffRate !== undefined && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Drop-off</span>
                  </div>
                  <span className={cn(
                    "text-xs font-semibold",
                    metrics.dropOffRate > 30 ? "text-destructive" : "text-foreground"
                  )}>
                    {metrics.dropOffRate.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

