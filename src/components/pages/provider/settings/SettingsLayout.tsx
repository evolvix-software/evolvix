"use client";

import { Layout } from '@/components/common/layout/Layout';
import { Shield } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';
import { useEffect, useState } from 'react';

type SettingsSection = 'profile' | 'security' | 'payment' | 'notifications' | 'preferences' | 'privacy';

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  children: React.ReactNode;
  loading?: boolean;
}

export function SettingsLayout({ activeSection, children, loading = false }: SettingsLayoutProps) {
  const [provider, setProvider] = useState(providerService.getCurrentProvider());

  useEffect(() => {
    const currentProvider = providerService.getCurrentProvider();
    if (!currentProvider) {
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
      }
    } else {
      setProvider(currentProvider);
    }
  }, []);

  if (loading) {
    return (
      <Layout title="Settings" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings" role="provider" noCard>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your organization profile, account security, and preferences
            </p>
          </div>
          {provider && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Verified Provider</span>
            </div>
          )}
        </div>

        {/* Main Content - Full Width */}
        <div>
          {children}
        </div>
      </div>
    </Layout>
  );
}

