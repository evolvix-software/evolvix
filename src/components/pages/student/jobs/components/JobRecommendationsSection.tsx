/**
 * Job Recommendations Section Component
 */

'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Briefcase, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Skeleton } from '@/components/common/ui/SkeletonLoader';
import { EmptyState } from '@/components/common/ui/EmptyState';
import { getJobRecommendations } from '@/services/jobService';
import { JobRecommendation } from '@/interfaces/jobs';
import { Job } from '@/data/mock/jobsData';
import { formatTimeAgo } from '@/data/mock/jobsData';
import { cn } from '@/utils';

interface JobRecommendationsSectionProps {
  onJobSelect: (job: Job) => void;
}

export function JobRecommendationsSection({ onJobSelect }: JobRecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const recs = await getJobRecommendations(5);
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={100} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.job.id}
              className="p-4 border border-border rounded-lg hover:shadow-md transition-all cursor-pointer hover:bg-muted/50"
              onClick={() => onJobSelect(rec.job)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {rec.job.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                        {rec.job.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">{rec.job.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {rec.job.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(rec.job.postedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {rec.job.remote && (
                          <Badge variant="default" className="text-xs">Remote</Badge>
                        )}
                        <Badge variant="primary" className="text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {rec.matchScore}% match
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    {rec.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

