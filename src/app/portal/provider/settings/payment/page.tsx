"use client";

import { SettingsLayout } from '@/components/pages/provider/settings/SettingsLayout';
import { PaymentMethodsTab } from '@/components/pages/provider/settings/components/PaymentMethodsTab';
import { providerService } from '@/data/mock/providerData';
import { useState, useEffect } from 'react';

export default function PaymentSettingsPage() {
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, []);

  if (loading) {
    return <SettingsLayout activeSection="payment" loading />;
  }

  return (
    <SettingsLayout activeSection="payment">
      <PaymentMethodsTab provider={provider} />
    </SettingsLayout>
  );
}

