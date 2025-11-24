"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { StatCard } from '@/components/provider/common/StatCard';
import {
  ArrowLeft,
  Edit,
  Copy,
  Users,
  Wallet,
  Calendar,
  FileText,
  Award,
  BarChart3,
  Settings,
  X,
  Trash2,
} from 'lucide-react';
import { providerService, campaignService, applicationService, Campaign } from '@/data/mock/providerData';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ApplicationsTab } from './components/tabs/ApplicationsTab';
import { ScholarsTab } from './components/tabs/ScholarsTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { SettingsTab } from './components/tabs/SettingsTab';

type Tab = 'overview' | 'applications' | 'scholars' | 'analytics' | 'settings';

interface CampaignDetailsPageProps {
  campaignId: string;
}

export function CampaignDetailsPage({ campaignId }: CampaignDetailsPageProps) {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const foundCampaign = campaignService.getById(campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
    }
    setLoading(false);
  }, [provider, router, campaignId]);

  if (loading) {
    return (
      <Layout title="Campaign Details" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout title="Campaign Details" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </Layout>
    );
  }

  const applications = applicationService.getAll(provider?.id, campaignId);
  const pendingApplications = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under_verification' || a.status === 'review_pending'
  ).length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
    { id: 'scholars', label: 'Scholars', icon: <Award className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <Layout title={campaign.title} role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{campaign.title}</h1>
                <StatusBadge status={campaign.status} />
              </div>
              <p className="text-muted-foreground mt-1">Campaign Details</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Campaign editing is managed by Evolvix administrators
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Slots"
            value={`${campaign.slotsAwarded} / ${campaign.totalSlots}`}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Funded Amount"
            value={`₹${(campaign.fundedAmount / 100000).toFixed(1)}L / ₹${(campaign.requiredAmount / 100000).toFixed(1)}L`}
            icon={<Wallet className="w-6 h-6" />}
          />
          <StatCard
            title="Applications"
            value={applications.length}
            icon={<FileText className="w-6 h-6" />}
          />
          <StatCard
            title="Pending Review"
            value={pendingApplications}
            icon={<Award className="w-6 h-6" />}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab campaign={campaign} />}
          {activeTab === 'applications' && (
            <ApplicationsTab campaignId={campaignId} providerId={provider?.id || ''} />
          )}
          {activeTab === 'scholars' && (
            <ScholarsTab campaignId={campaignId} providerId={provider?.id || ''} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab campaignId={campaignId} providerId={provider?.id || ''} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab campaign={campaign} onUpdate={(updated) => setCampaign(updated)} />
          )}
        </div>
      </div>
    </Layout>
  );
}

