"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { StatCard } from '@/components/provider/common/StatCard';
import {
  ArrowLeft,
  Edit,
  Users,
  Wallet,
  Calendar,
  FileText,
  Award,
} from 'lucide-react';
import { providerService, campaignService, applicationService, Campaign } from '@/data/mock/providerData';

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [campaign, setCampaign] = useState<Campaign | null>(null);

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

    const foundCampaign = campaignService.getById(campaignId);
    setCampaign(foundCampaign);
  }, [provider, router, campaignId]);

  if (!campaign) {
    return (
      <Layout title="Campaign Details" role="provider">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Campaign not found</p>
        </div>
      </Layout>
    );
  }

  const applications = applicationService.getAll(provider?.id, campaignId);
  const pendingApplications = applications.filter(
    a => a.status === 'submitted' || a.status === 'under_verification' || a.status === 'review_pending'
  ).length;

  return (
    <Layout title={campaign.title} role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{campaign.title}</h1>
              <p className="text-muted-foreground mt-1">Campaign Details</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/portal/provider/campaigns/${campaignId}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
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
            value={`₹${(campaign.fundedAmount / 100000).toFixed(1)}L`}
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

        {/* Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Campaign Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <StatusBadge status={campaign.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="text-foreground capitalize">{campaign.campaignType.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Award Type</p>
                <p className="text-foreground capitalize">{campaign.awardType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-foreground">{campaign.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Application Window</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Open Date
                </p>
                <p className="text-foreground">
                  {new Date(campaign.applicationOpenDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Close Date
                </p>
                <p className="text-foreground">
                  {new Date(campaign.applicationCloseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligibility Rules</p>
                <div className="space-y-2">
                  {campaign.eligibilityRules.minCGPA && (
                    <p className="text-sm text-foreground">
                      Min CGPA: {campaign.eligibilityRules.minCGPA}
                    </p>
                  )}
                  {campaign.eligibilityRules.meritBased && (
                    <p className="text-sm text-foreground">Merit-Based</p>
                  )}
                  {campaign.eligibilityRules.needBased && (
                    <p className="text-sm text-foreground">Need-Based</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <Card className="p-6">
          <div className="flex gap-4">
            <Button
              onClick={() => router.push(`/portal/provider/applications?campaign=${campaignId}`)}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Applications
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/portal/provider/scholars?campaign=${campaignId}`)}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              View Scholars
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

