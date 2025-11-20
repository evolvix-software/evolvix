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
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Wallet,
  ArrowRight,
  Megaphone,
  Edit,
  Eye,
} from 'lucide-react';
import { providerService, campaignService, Campaign } from '@/data/mock/providerData';

export default function CampaignsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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

    const allCampaigns = campaignService.getAll(currentProvider.id);
    setCampaigns(allCampaigns);
  }, [provider, router]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title="Campaigns" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scholarship Campaigns</h1>
            <p className="text-muted-foreground mt-1">
              Manage your scholarship campaigns and track their performance
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

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
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
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="w-12 h-12 text-muted-foreground" />}
            title={campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns found'}
            description={
              campaigns.length === 0
                ? 'Create your first scholarship campaign to start awarding scholarships'
                : 'Try adjusting your search or filters'
            }
            action={
              campaigns.length === 0
                ? {
                    label: 'Create Campaign',
                    onClick: () => router.push('/portal/provider/campaigns/new'),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {campaign.title}
                    </h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Slots
                    </span>
                    <span className="font-medium text-foreground">
                      {campaign.slotsAwarded} / {campaign.totalSlots}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Wallet className="w-4 h-4 mr-1" />
                      Funded
                    </span>
                    <span className="font-medium text-foreground">
                      ₹{(campaign.fundedAmount / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Closes
                    </span>
                    <span className="font-medium text-foreground">
                      {new Date(campaign.applicationCloseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

