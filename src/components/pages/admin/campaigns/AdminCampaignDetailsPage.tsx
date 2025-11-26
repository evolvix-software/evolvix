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
} from 'lucide-react';
import { campaignService, applicationService, Campaign, providerService } from '@/data/mock/providerData';
import { OverviewTab } from '@/components/pages/provider/campaigns/components/tabs/OverviewTab';
import { ApplicationsTab } from '@/components/pages/provider/campaigns/components/tabs/ApplicationsTab';
import { ScholarsTab } from '@/components/pages/provider/campaigns/components/tabs/ScholarsTab';
import { AnalyticsTab } from '@/components/pages/provider/campaigns/components/tabs/AnalyticsTab';
import { SettingsTab } from '@/components/pages/provider/campaigns/components/tabs/SettingsTab';

type Tab = 'overview' | 'applications' | 'scholars' | 'analytics' | 'settings';

interface AdminCampaignDetailsPageProps {
  campaignId: string;
}

export function AdminCampaignDetailsPage({ campaignId }: AdminCampaignDetailsPageProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCampaign = campaignService.getById(campaignId);
    if (foundCampaign) {
      setCampaign(foundCampaign);
    }
    setLoading(false);
  }, [campaignId]);

  if (loading) {
    return (
      <Layout noCard title="Campaign Details" role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!campaign) {
    return (
      <Layout noCard title="Campaign Details" role="admin">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </Layout>
    );
  }

  const provider = providerService.getById(campaign.providerId);
  const applications = applicationService.getAll(campaign.providerId, campaignId);
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
    <Layout noCard title={campaign.title} role="admin">
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
              <p className="text-muted-foreground mt-1">
                {provider ? `Provider: ${provider.organizationName}` : 'Campaign Details'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/campaigns/${campaignId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
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
            <ApplicationsTab campaignId={campaignId} providerId={campaign.providerId} />
          )}
          {activeTab === 'scholars' && (
            <ScholarsTab campaignId={campaignId} providerId={campaign.providerId} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab campaignId={campaignId} providerId={campaign.providerId} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab campaign={campaign} onUpdate={(updated) => setCampaign(updated)} />
          )}
        </div>
      </div>
    </Layout>
  );
}

