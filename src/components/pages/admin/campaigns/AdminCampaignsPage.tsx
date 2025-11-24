"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { Plus, Grid3x3, List, Filter } from 'lucide-react';
import { CampaignCard } from '@/components/pages/provider/campaigns/components/CampaignCard';
import { CampaignFilters } from '@/components/pages/provider/campaigns/components/CampaignFilters';
import { CampaignStats } from '@/components/pages/provider/campaigns/components/CampaignStats';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { campaignService, Campaign, providerService } from '@/data/mock/providerData';

type ViewMode = 'grid' | 'list';
type CampaignStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled' | 'all';
type CampaignType = 'course-specific' | 'pooled' | 'general' | 'all';

interface Filters {
  search: string;
  status: CampaignStatus;
  campaignType: CampaignType;
  providerId?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export function AdminCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    campaignType: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all campaigns (admin can see all campaigns)
    const allCampaigns = campaignService.getAll();
    setCampaigns(allCampaigns);
    setFilteredCampaigns(allCampaigns);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = [...campaigns];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        c => c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // Campaign type filter
    if (filters.campaignType !== 'all') {
      filtered = filtered.filter(c => c.campaignType === filters.campaignType);
    }

    // Provider filter
    if (filters.providerId) {
      filtered = filtered.filter(c => c.providerId === filters.providerId);
    }

    // Date range filter
    if (filters.dateRange?.start) {
      filtered = filtered.filter(
        c => new Date(c.applicationOpenDate) >= new Date(filters.dateRange!.start!)
      );
    }
    if (filters.dateRange?.end) {
      filtered = filtered.filter(
        c => new Date(c.applicationCloseDate) <= new Date(filters.dateRange!.end!)
      );
    }

    setFilteredCampaigns(filtered);
  }, [filters, campaigns]);

  const handleCreateCampaign = () => {
    router.push('/admin/campaigns/new');
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk actions
    console.log('Bulk action:', action, selectedCampaigns);
  };

  const stats = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    open: campaigns.filter(c => c.status === 'open').length,
    closed: campaigns.filter(c => c.status === 'closed').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
  };

  if (loading) {
    return (
      <Layout title="Scholarship Campaigns" role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Scholarship Campaigns" role="admin" noCard>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scholarship Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage all scholarship campaigns
            </p>
          </div>
          <Button
            onClick={handleCreateCampaign}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats */}
        <CampaignStats stats={stats} />

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 h-10 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          {showFilters && (
            <div className="absolute z-10 mt-2 w-full max-w-md">
              <CampaignFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <>
                  <List className="w-4 h-4 mr-2" />
                  List
                </>
              ) : (
                <>
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Grid
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Campaign List/Grid */}
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            description={
              filters.search || filters.status !== 'all'
                ? "Try adjusting your filters to see more campaigns."
                : "Create your first scholarship campaign to get started."
            }
            action={
              !filters.search && filters.status === 'all' ? {
                label: 'Create Campaign',
                onClick: handleCreateCampaign
              } : undefined
            }
          />
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredCampaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                viewMode={viewMode}
                onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

