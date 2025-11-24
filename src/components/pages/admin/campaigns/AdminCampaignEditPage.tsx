"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { CampaignCreationWizard } from '@/components/pages/provider/campaigns/components/CampaignCreationWizard';
import { ArrowLeft } from 'lucide-react';
import { providerService, campaignService } from '@/data/mock/providerData';
import { CampaignWizardFormData } from '@/components/pages/provider/campaigns/components/CampaignCreationWizard';

interface AdminCampaignEditPageProps {
  campaignId: string;
}

export function AdminCampaignEditPage({ campaignId }: AdminCampaignEditPageProps) {
  const router = useRouter();
  const [campaign, setCampaign] = useState(campaignService.getById(campaignId));

  useEffect(() => {
    if (!campaign) {
      router.push('/admin/campaigns');
    }
  }, [campaign, router, campaignId]);

  const handleComplete = async (data: CampaignWizardFormData) => {
    if (!campaign) return;

    try {
      campaignService.update(campaignId, {
        title: data.title,
        description: data.description,
        campaignType: data.campaignType,
        campaignSlug: data.campaignSlug,
        linkedCourseIds: data.linkedCourseIds || [],
        totalSlots: data.totalSlots,
        awardType: data.awardType,
        partialAmount: data.awardType === 'partial' ? data.partialAmount : undefined,
        requiredAmount: data.requiredAmount,
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
      });

      router.push(`/admin/campaigns/${campaignId}`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    }
  };

  if (!campaign) {
    return null;
  }

  return (
    <Layout title="Edit Campaign" role="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Update scholarship campaign details
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <CampaignCreationWizard campaignId={campaignId} onComplete={handleComplete} />
      </div>
    </Layout>
  );
}

