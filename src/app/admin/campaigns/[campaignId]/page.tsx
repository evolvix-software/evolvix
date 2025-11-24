"use client";

import { AdminCampaignDetailsPage } from '@/components/pages/admin/campaigns/AdminCampaignDetailsPage';

export default function CampaignDetailsPage({ params }: { params: { campaignId: string } }) {
  return <AdminCampaignDetailsPage campaignId={params.campaignId} />;
}

