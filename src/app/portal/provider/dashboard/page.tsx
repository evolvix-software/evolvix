"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { StatCard } from '@/components/provider/common/StatCard';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  Award,
  Wallet,
  Megaphone,
  FileText,
} from 'lucide-react';
import { providerService, campaignService, scholarService, applicationService } from '@/data/mock/providerData';
import { EmptyState } from '@/components/provider/common/EmptyState';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalScholars: 0,
    activeScholars: 0,
    graduatedScholars: 0,
    placedScholars: 0,
    totalInvested: 0,
    graduationRate: 0,
    placementRate: 0,
  });

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

    // Load stats only if we have a provider
    if (!currentProvider) return;

    const campaigns = campaignService.getAll(currentProvider.id);
    const applications = applicationService.getAll(currentProvider.id);
    const scholars = scholarService.getAll(currentProvider.id);

    const activeCampaigns = campaigns.filter(c => c.status === 'open').length;
    const pendingApplications = applications.filter(
      a => a.status === 'submitted' || a.status === 'under_verification' || a.status === 'review_pending'
    ).length;
    const activeScholars = scholars.filter(s => s.awardStatus === 'active').length;
    const graduatedScholars = scholars.filter(s => s.graduationStatus === 'graduated').length;
    const placedScholars = scholars.filter(s => s.jobPlacement?.verified).length;

    const totalInvested = scholars.reduce((sum, s) => sum + s.awardAmount, 0);
    const graduationRate = scholars.length > 0 ? (graduatedScholars / scholars.length) * 100 : 0;
    const placementRate = scholars.length > 0 ? (placedScholars / scholars.length) * 100 : 0;

    setStats({
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalApplications: applications.length,
      pendingApplications,
      totalScholars: scholars.length,
      activeScholars,
      graduatedScholars,
      placedScholars,
      totalInvested,
      graduationRate: Math.round(graduationRate),
      placementRate: Math.round(placementRate),
    });
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  return (
    <Layout title="Dashboard" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {provider.organizationName}
            </p>
          </div>
          <Button
            onClick={() => router.push('/portal/provider/campaigns/new')}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={<Megaphone className="w-6 h-6" />}
            change={stats.activeCampaigns}
            changeLabel="active"
            trend="neutral"
          />
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={<FileText className="w-6 h-6" />}
            change={stats.pendingApplications}
            changeLabel="pending review"
            trend="neutral"
          />
          <StatCard
            title="Total Scholars"
            value={stats.totalScholars}
            icon={<Users className="w-6 h-6" />}
            change={stats.activeScholars}
            changeLabel="active"
            trend="neutral"
          />
          <StatCard
            title="Total Invested"
            value={`₹${(stats.totalInvested / 100000).toFixed(1)}L`}
            icon={<Wallet className="w-6 h-6" />}
            trend="neutral"
          />
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Graduation Rate"
            value={`${stats.graduationRate}%`}
            icon={<GraduationCap className="w-6 h-6" />}
            trend={stats.graduationRate > 50 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Job Placement Rate"
            value={`${stats.placementRate}%`}
            icon={<Briefcase className="w-6 h-6" />}
            trend={stats.placementRate > 50 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Graduated Scholars"
            value={stats.graduatedScholars}
            icon={<Award className="w-6 h-6" />}
            trend="neutral"
          />
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/portal/provider/campaigns/new')}
              className="h-auto flex-col items-start p-4"
            >
              <Plus className="w-5 h-5 mb-2" />
              <span className="font-medium">Create Campaign</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/portal/provider/applications')}
              className="h-auto flex-col items-start p-4"
            >
              <FileText className="w-5 h-5 mb-2" />
              <span className="font-medium">Review Applications</span>
              {stats.pendingApplications > 0 && (
                <span className="text-xs text-primary mt-1">
                  {stats.pendingApplications} pending
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/portal/provider/funds')}
              className="h-auto flex-col items-start p-4"
            >
              <Wallet className="w-5 h-5 mb-2" />
              <span className="font-medium">Transfer Funds</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/portal/provider/analytics')}
              className="h-auto flex-col items-start p-4"
            >
              <TrendingUp className="w-5 h-5 mb-2" />
              <span className="font-medium">View Analytics</span>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Campaigns</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/provider/campaigns')}
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {stats.totalCampaigns === 0 ? (
              <EmptyState
                icon={<Megaphone className="w-12 h-12 text-muted-foreground" />}
                title="No campaigns yet"
                description="Create your first scholarship campaign to get started"
                action={{
                  label: 'Create Campaign',
                  onClick: () => router.push('/portal/provider/campaigns/new'),
                }}
              />
            ) : (
              <p className="text-muted-foreground">Campaigns will appear here</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Applications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/provider/applications')}
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            {stats.totalApplications === 0 ? (
              <EmptyState
                icon={<FileText className="w-12 h-12 text-muted-foreground" />}
                title="No applications yet"
                description="Applications will appear here once students start applying"
              />
            ) : (
              <p className="text-muted-foreground">Applications will appear here</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}


