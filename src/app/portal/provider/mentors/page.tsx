"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { UsersRound } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

export default function MentorsPage() {
  const router = useRouter();
  const provider = providerService.getCurrentProvider();

  useEffect(() => {
    // If no provider exists, create one from registration data
    if (!provider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
      } else {
        router.push('/auth/signin');
      }
    }
  }, [provider, router]);

  return (
    <Layout title="Mentors" role="provider">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mentors & Payroll</h1>
          <p className="text-muted-foreground mt-1">Manage mentors and track payroll</p>
        </div>
        <EmptyState
          icon={<UsersRound className="w-12 h-12 text-muted-foreground" />}
          title="Mentor Management"
          description="Mentor management features coming soon"
        />
      </div>
    </Layout>
  );
}

