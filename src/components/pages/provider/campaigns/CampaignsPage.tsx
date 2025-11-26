"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { Grid3x3, List, Filter } from 'lucide-react';
import { CampaignCard } from './components/CampaignCard';
import { CampaignFilters } from './components/CampaignFilters';
import { CampaignStats } from './components/CampaignStats';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { providerService, campaignService, Campaign } from '@/data/mock/providerData';

type ViewMode = 'grid' | 'list';
type CampaignStatus = 'draft' | 'open' | 'closed' | 'completed' | 'cancelled' | 'all';
type CampaignType = 'course-specific' | 'pooled' | 'general' | 'all';

interface Filters {
  search: string;
  status: CampaignStatus;
  campaignType: CampaignType;
  dateRange?: {
    start?: string;
    end?: string;
  };
  linkedCourses?: string[];
}

export function CampaignsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
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
    const loadData = async () => {
      console.log('[CampaignsPage] Starting data load...');
      let currentProvider = provider;
      
      if (!currentProvider) {
        console.log('[CampaignsPage] No provider found, checking registration data...');
        const registrationData = localStorage.getItem('evolvix_registration');
        if (registrationData) {
          const regData = JSON.parse(registrationData);
          console.log('[CampaignsPage] Creating provider from registration data:', regData);
          currentProvider = providerService.createProvider({
            organizationName: regData.fullName || 'My Organization',
            organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
            contactEmail: regData.email || '',
            userId: regData.email || '',
          });
          console.log('[CampaignsPage] Created provider:', currentProvider);
          setProvider(currentProvider);
        } else {
          console.log('[CampaignsPage] No registration data found, redirecting to signin');
          router.push('/auth/signin');
          return;
        }
      }

      if (currentProvider) {
        console.log('[CampaignsPage] Provider found:', currentProvider.id);
        
        // Ensure data is assigned to this provider
        console.log('[CampaignsPage] Ensuring data is assigned to provider...');
        providerService.ensureDataAssigned(currentProvider.id);
        
        // Get all campaigns first to check what exists
        const allCampaigns = campaignService.getAll();
        console.log('[CampaignsPage] All campaigns in storage:', allCampaigns.length, allCampaigns);
        
        // Get campaigns for this provider
        const providerCampaigns = campaignService.getAll(currentProvider.id);
        console.log('[CampaignsPage] Provider campaigns:', providerCampaigns.length, providerCampaigns);
        
        setCampaigns(providerCampaigns);
        setFilteredCampaigns(providerCampaigns);
        setLoading(false);
      }
    };

    loadData();
  }, [provider, router]);

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

  // Campaigns are created by admin/organizer portal, not by providers
  // Providers can only view and manage campaigns assigned to them

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
      <Layout title="Scholarship Campaigns" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Scholarship Campaigns" role="provider" noCard>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scholarship Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              View and manage scholarship campaigns assigned to your organization
            </p>
          </div>
        
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <CampaignFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'draft', 'open', 'closed', 'completed'] as CampaignStatus[]).map((status) => (
            <Button
              key={status}
              variant={filters.status === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, status })}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-background/50 text-xs">
                  {stats[status as keyof typeof stats] || 0}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Campaigns List/Grid */}
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            description={
              filters.search || filters.status !== 'all'
                ? "Try adjusting your filters to see more campaigns."
                : "Campaigns are created by Evolvix administrators. Contact support to request a new campaign."
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
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                viewMode={viewMode}
                selected={selectedCampaigns.includes(campaign.id)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                  } else {
                    setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                  }
                }}
                onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}`)}
              />
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedCampaigns.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4">
            <span className="text-sm text-foreground">
              {selectedCampaigns.length} campaign(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('close')}
              >
                Close Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
              >
                Delete Selected
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCampaigns([])}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

