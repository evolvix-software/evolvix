"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { ImpactMetrics } from './components/ImpactMetrics';
import { GrowthCharts } from './components/GrowthCharts';
import { JobPlacementStats } from './components/JobPlacementStats';
import { GraduationRates } from './components/GraduationRates';
import { ROIAnalysis } from './components/ROIAnalysis';
import { SuccessStories } from './components/SuccessStories';
import { CohortAnalysis } from './components/CohortAnalysis';
import { RiskRetentionAnalysis } from './components/RiskRetentionAnalysis';
import { TopPerformersLeaderboard } from './components/TopPerformersLeaderboard';
import { BarChart3, TrendingUp, Users, Award, GraduationCap, Briefcase, DollarSign, Download, Filter, List, Grid } from 'lucide-react';
import { providerService, campaignService, scholarService } from '@/data/mock/providerData';
import { Button } from '@/components/common/forms/Button';

type Tab = 'overview' | 'growth' | 'jobs' | 'graduation' | 'roi' | 'impact' | 'cohort' | 'risk';
type ViewMode = 'overview' | 'detailed';

export function AnalyticsPage() {
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    if (provider?.id) {
      const providerCampaigns = campaignService.getAll(provider.id);
      setCampaigns(providerCampaigns);
    }
  }, [provider]);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'growth' as Tab, label: 'Growth', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'jobs' as Tab, label: 'Job Placement', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'graduation' as Tab, label: 'Graduation', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'roi' as Tab, label: 'ROI Analysis', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'cohort' as Tab, label: 'Cohort Analysis', icon: <Users className="w-4 h-4" /> },
    { id: 'risk' as Tab, label: 'Risk & Retention', icon: <Award className="w-4 h-4" /> },
    { id: 'impact' as Tab, label: 'Impact', icon: <Award className="w-4 h-4" /> },
  ];

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // TODO: Implement export functionality
    console.log(`Exporting analytics as ${format}`);
    alert(`Export functionality will be implemented. Format: ${format}`);
  };

  return (
    <Layout title="Scholar Growth & Impact Analytics" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scholar Growth & Impact</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive analytics on scholar progress, job placements, and impact metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setViewMode('overview')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'overview'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                title="Overview View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'detailed'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                title="Detailed View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Impact Metrics Overview */}
        <ImpactMetrics providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <GrowthCharts providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JobPlacementStats providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
                <GraduationRates providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
              </div>
              <TopPerformersLeaderboard providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
            </div>
          )}
          {activeTab === 'growth' && (
            <GrowthCharts providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} detailed={viewMode === 'detailed'} />
          )}
          {activeTab === 'jobs' && (
            <JobPlacementStats providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} detailed={viewMode === 'detailed'} />
          )}
          {activeTab === 'graduation' && (
            <GraduationRates providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} detailed={viewMode === 'detailed'} />
          )}
          {activeTab === 'roi' && (
            <ROIAnalysis providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
          )}
          {activeTab === 'cohort' && (
            <CohortAnalysis providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
          )}
          {activeTab === 'risk' && (
            <RiskRetentionAnalysis providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
          )}
          {activeTab === 'impact' && (
            <SuccessStories providerId={provider?.id} campaignId={selectedCampaign !== 'all' ? selectedCampaign : undefined} />
          )}
        </div>
      </div>
    </Layout>
  );
}

