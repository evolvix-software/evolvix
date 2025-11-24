"use client";

import { useParams } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { ApplicationsTab } from '@/components/pages/provider/campaigns/components/tabs/ApplicationsTab';
import { providerService } from '@/data/mock/providerData';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;
  const [provider, setProvider] = useState(providerService.getCurrentProvider());

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
  }, [provider, router]);

  if (!provider) {
    return null;
  }

  return (
    <Layout title="Campaign Applications" role="provider" noCard>
      <ApplicationsTab campaignId={campaignId} providerId={provider.id} />
    </Layout>
  );
}

