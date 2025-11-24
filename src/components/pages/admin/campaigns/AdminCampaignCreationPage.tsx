"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { CampaignCreationWizard } from '@/components/pages/provider/campaigns/components/CampaignCreationWizard';
import { ArrowLeft } from 'lucide-react';
import { campaignService, providerService } from '@/data/mock/providerData';
import { CampaignWizardFormData } from '@/components/pages/provider/campaigns/components/CampaignCreationWizard';

export function AdminCampaignCreationPage() {
  const router = useRouter();
  const [providers, setProviders] = useState(providerService.getAll());

  const handleComplete = async (data: CampaignWizardFormData & { providerId?: string }) => {
    if (!data.providerId) {
      alert('Please select a provider');
      return;
    }

    try {
      const campaign = campaignService.create({
        providerId: data.providerId,
        title: data.title,
        description: data.description,
        campaignType: data.campaignType,
        campaignSlug: data.campaignSlug || data.title.toLowerCase().replace(/\s+/g, '-'),
        linkedCourseIds: data.linkedCourseIds || [],
        totalSlots: data.totalSlots,
        slotsAvailable: data.totalSlots,
        slotsAwarded: 0,
        slotsReserved: 0,
        awardType: data.awardType,
        partialAmount: data.awardType === 'partial' ? data.partialAmount : undefined,
        requiredAmount: data.requiredAmount,
        fundedAmount: 0,
        reservedFunds: data.reserveFunds || 0,
        fundingModel: data.fundingModel,
        eligibilityRules: {
          minCGPA: data.minCGPA,
          maxCGPA: data.maxCGPA,
          financialNeedRequired: data.financialNeedRequired,
          meritBased: data.meritBased,
          needBased: data.needBased,
          specificCourses: data.specificCourses,
          geographicRestrictions: data.geographicRestrictions,
          otherCriteria: data.otherCriteria,
        },
        applicationOpenDate: new Date(data.applicationOpenDate).toISOString(),
        applicationCloseDate: new Date(data.applicationCloseDate).toISOString(),
        isOpen: new Date(data.applicationOpenDate) <= new Date() && new Date(data.applicationCloseDate) >= new Date(),
        status: 'open', // Admin can directly publish campaigns
      });

      router.push(`/admin/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  return (
    <Layout title="Create Campaign" role="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new scholarship campaign step by step
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <CampaignCreationWizard onComplete={handleComplete} />
      </div>
    </Layout>
  );
}

