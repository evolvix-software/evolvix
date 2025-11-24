"use client";

import { AdminCampaignEditPage } from '@/components/pages/admin/campaigns/AdminCampaignEditPage';

export default function EditCampaignPage({ params }: { params: { campaignId: string } }) {
  return <AdminCampaignEditPage campaignId={params.campaignId} />;
}

