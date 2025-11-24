"use client";

import { useParams } from 'next/navigation';
import { CampaignDetailsPage } from '@/components/pages/provider/campaigns/CampaignDetailsPage';

export default function Page() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  return <CampaignDetailsPage campaignId={campaignId} />;
}
