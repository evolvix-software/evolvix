"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { FileText, Search, Filter } from 'lucide-react';
import { applicationService } from '@/data/mock/providerData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ApplicationsTabProps {
  campaignId: string;
  providerId: string;
}

export function ApplicationsTab({ campaignId, providerId }: ApplicationsTabProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const applications = applicationService.getAll(providerId, campaignId);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.studentSnapshot.name.toLowerCase().includes(search.toLowerCase()) ||
      app.studentSnapshot.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    under_verification: applications.filter((a) => a.status === 'under_verification').length,
    review_pending: applications.filter((a) => a.status === 'review_pending').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    awarded: applications.filter((a) => a.status === 'awarded').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses ({statusCounts.all})</option>
              <option value="submitted">Submitted ({statusCounts.submitted})</option>
              <option value="under_verification">Under Verification ({statusCounts.under_verification})</option>
              <option value="review_pending">Review Pending ({statusCounts.review_pending})</option>
              <option value="shortlisted">Shortlisted ({statusCounts.shortlisted})</option>
              <option value="awarded">Awarded ({statusCounts.awarded})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
            <p className="text-muted-foreground">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No applications have been submitted yet for this campaign'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card
              key={app.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/portal/provider/applications/${app.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {app.studentSnapshot.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{app.studentSnapshot.email}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-muted-foreground">
                        CGPA: {app.cgpa}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'awarded' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                      app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}>
                      {app.status.replace('_', ' ')}
                    </span>
                    {app.totalScore && (
                      <span className="text-sm font-semibold text-foreground">
                        Score: {app.totalScore}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

