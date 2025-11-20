"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Save, Building2, Mail, Phone, Globe } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

export default function SettingsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [formData, setFormData] = useState({
    organizationName: provider?.organizationName || '',
    contactEmail: provider?.contactEmail || '',
    contactPhone: provider?.contactPhone || '',
    website: provider?.website || '',
  });

  useEffect(() => {
    // If no provider exists, create one from registration data
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
        return;
      }
    }
    setFormData({
      organizationName: provider.organizationName,
      contactEmail: provider.contactEmail,
      contactPhone: provider.contactPhone || '',
      website: provider.website || '',
    });
  }, [provider, router]);

  const handleSave = () => {
    if (!provider) return;
    providerService.updateProvider(formData);
    setProvider(providerService.getCurrentProvider());
  };

  return (
    <Layout title="Settings" role="provider">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Organization Profile</h2>
          <div className="space-y-4">
            <Input
              label="Organization Name"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              icon={<Building2 className="w-4 h-4" />}
            />
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              icon={<Phone className="w-4 h-4" />}
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              icon={<Globe className="w-4 h-4" />}
            />
            <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-purple-600">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

