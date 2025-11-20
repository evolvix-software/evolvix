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
  User,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Eye,
  Award,
} from 'lucide-react';
import { providerService, scholarService, Scholar } from '@/data/mock/providerData';

export default function ScholarsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // If no provider exists, create one from registration data
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        const newProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(newProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    if (provider) {
      const allScholars = scholarService.getAll(provider.id);
      setScholars(allScholars);
    }
  }, [provider, router]);

  const filteredScholars = scholars.filter((scholar) => {
    const matchesSearch =
      scholar.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholar.profile.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scholar.awardStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Scholars" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Awarded Scholars</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your scholarship recipients
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search scholars..."
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
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Scholars Grid */}
        {filteredScholars.length === 0 ? (
          <EmptyState
            icon={<User className="w-12 h-12 text-muted-foreground" />}
            title={scholars.length === 0 ? 'No scholars yet' : 'No scholars found'}
            description={
              scholars.length === 0
                ? 'Scholars will appear here once you award scholarships'
                : 'Try adjusting your search or filters'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholars.map((scholar) => (
              <Card key={scholar.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {scholar.profile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {scholar.profile.email}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={scholar.awardStatus} />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      CGPA
                    </span>
                    <span className="font-medium text-foreground">
                      {scholar.currentCGPA?.toFixed(2) || scholar.baselineCGPA.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Award Amount
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{(scholar.awardAmount / 1000).toFixed(0)}K
                    </span>
                  </div>
                  {scholar.graduationStatus === 'graduated' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        Graduated
                      </span>
                      <span className="font-medium text-success">Yes</span>
                    </div>
                  )}
                  {scholar.jobPlacement?.verified && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        Job Placed
                      </span>
                      <span className="font-medium text-success">Yes</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/portal/provider/scholars/${scholar.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

