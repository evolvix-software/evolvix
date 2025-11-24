"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

export default function NewCampaignPage() {
  const router = useRouter();
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
    <Layout title="Create Campaign" role="provider" noCard>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Campaign creation is managed by Evolvix administrators
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
              Campaign Creation Restricted
            </h3>
            <p className="text-muted-foreground mb-6">
              Scholarship campaigns are created and verified by Evolvix administrators through the organizer portal.
              This ensures proper verification, compliance, and quality control.
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-lg bg-muted text-left">
                <h4 className="font-semibold text-foreground mb-2">To Request a New Campaign:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Contact Evolvix support team</li>
                  <li>Provide campaign requirements and details</li>
                  <li>Admin will create and verify the campaign</li>
                  <li>You'll be notified when the campaign is ready</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support to Create Campaign
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Once campaigns are created, you can manage applications, award scholarships,
              track scholar progress, and monitor impact from your provider portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
