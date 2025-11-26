"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { Users, ArrowRight, User } from 'lucide-react';
import { Application } from '@/store/features/employer/employerSlice';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils';

interface RecentApplicationsProps {
  applications: Application[];
}

const statusColors = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  reviewed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  shortlisted: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  interviewed: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  offered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  hired: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const router = useRouter();

  if (applications.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
        <button
          onClick={() => router.push('/portal/employer/applicants')}
          className="text-sm text-primary hover:underline flex items-center"
        >
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {applications.map((application) => (
            <div
              key={application.id}
              className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-all cursor-pointer group"
              onClick={() => router.push(`/portal/employer/applicants/${application.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {application.candidateName}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {application.jobTitle}
                    </p>
                    {application.matchScore && (
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-1.5">
                            <div
                              className={cn(
                                "h-1.5 rounded-full transition-all",
                                application.matchScore >= 80
                                  ? "bg-green-500"
                                  : application.matchScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              )}
                              style={{ width: `${application.matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {application.matchScore}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  variant="default"
                  className={cn('border text-xs', statusColors[application.status])}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

