/**
 * Similar Jobs Section Component
 */

'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Skeleton } from '@/components/common/ui/SkeletonLoader';
import { getSimilarJobs } from '@/services/jobService';
import { Job } from '@/data/mock/jobsData';
import { formatTimeAgo } from '@/data/mock/jobsData';
import { cn } from '@/utils';

interface SimilarJobsSectionProps {
  jobId: string;
  onJobSelect: (job: Job) => void;
}

export function SimilarJobsSection({ jobId, onJobSelect }: SimilarJobsSectionProps) {
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSimilarJobs = async () => {
      setIsLoading(true);
      try {
        const jobs = await getSimilarJobs(jobId, 5);
        setSimilarJobs(jobs);
      } catch (error) {
        console.error('Failed to load similar jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadSimilarJobs();
    }
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Similar Jobs</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} />
          ))}
        </div>
      </div>
    );
  }

  if (similarJobs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Similar Jobs</h3>
      <div className="space-y-3">
        {similarJobs.map(job => (
          <Card 
            key={job.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onJobSelect(job)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {job.company.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {job.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(job.postedAt)}
                    </span>
                  </div>
                  {job.remote && (
                    <Badge variant="default" className="mt-2 text-xs">Remote</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

