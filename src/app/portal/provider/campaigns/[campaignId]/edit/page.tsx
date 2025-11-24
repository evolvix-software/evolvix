"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { providerService, campaignService } from '@/data/mock/providerData';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.campaignId as string;
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [campaign, setCampaign] = useState(campaignService.getById(campaignId));

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
      }
    }

    if (!campaign) {
      router.push('/portal/provider/campaigns');
    }
  }, [provider, router, campaign, campaignId]);

  if (!provider || !campaign) {
    return null;
  }

  return (
    <Layout title="Edit Campaign" role="provider" noCard>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Campaign editing is managed by Evolvix administrators
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Campaign Editing Restricted
            </h3>
            <p className="text-muted-foreground mb-4">
              Campaign creation and editing are managed by Evolvix administrators through the organizer portal.
              Please contact support if you need to modify campaign details.
            </p>
            <p className="text-sm text-muted-foreground">
              You can view campaign details, manage applications, track scholars, and monitor progress
              from the campaign details page.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

