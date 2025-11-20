"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { Input } from '@/components/common/forms/Input';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  Award,
} from 'lucide-react';
import { providerService, applicationService, Application } from '@/data/mock/providerData';

export default function ApplicationsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Get or create provider
    let currentProvider = provider;
    
    if (!currentProvider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        currentProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(currentProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    if (!currentProvider) return;

    const allApplications = applicationService.getAll(currentProvider.id);
    setApplications(allApplications);
  }, [provider, router]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentSnapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentSnapshot.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAward = (applicationId: string) => {
    // Update application status
    applicationService.update(applicationId, { status: 'awarded' });
    setApplications(applicationService.getAll(provider?.id || ''));
  };

  const handleReject = (applicationId: string) => {
    // Update application status
    applicationService.update(applicationId, { status: 'rejected' });
    setApplications(applicationService.getAll(provider?.id || ''));
  };

  return (
    <Layout title="Applications" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Applications Queue</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage scholarship applications
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_verification">Under Verification</option>
                <option value="review_pending">Review Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="awarded">Awarded</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12 text-muted-foreground" />}
            title={applications.length === 0 ? 'No applications yet' : 'No applications found'}
            description={
              applications.length === 0
                ? 'Applications will appear here once students start applying to your campaigns'
                : 'Try adjusting your search or filters'
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {application.studentSnapshot.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {application.studentSnapshot.email}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CGPA</p>
                        <p className="text-sm font-medium text-foreground">
                          {application.cgpa.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Priority</p>
                        <p className="text-sm font-medium text-foreground capitalize">
                          {application.priority}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Score</p>
                        <p className="text-sm font-medium text-foreground">
                          {application.totalScore ? application.totalScore.toFixed(1) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {application.scholarshipJustification && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Justification</p>
                        <p className="text-sm text-foreground line-clamp-2">
                          {application.scholarshipJustification}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/portal/provider/applications/${application.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {application.status !== 'awarded' && application.status !== 'rejected' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-success border-success hover:bg-success/10"
                        onClick={() => handleAward(application.id)}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Award
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(application.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

