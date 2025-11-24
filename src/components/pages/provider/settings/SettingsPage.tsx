"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { OrganizationProfileTab } from './components/OrganizationProfileTab';
import { AccountSecurityTab } from './components/AccountSecurityTab';
import { PaymentMethodsTab } from './components/PaymentMethodsTab';
import { NotificationPreferencesTab } from './components/NotificationPreferencesTab';
import { PreferencesTab } from './components/PreferencesTab';
import { PrivacySecurityTab } from './components/PrivacySecurityTab';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Palette,
  Lock,
} from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

type SettingsSection = 'profile' | 'security' | 'payment' | 'notifications' | 'preferences' | 'privacy';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
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

  const sections = [
    { id: 'profile' as SettingsSection, label: 'Organization Profile', icon: <User className="w-5 h-5" /> },
    { id: 'security' as SettingsSection, label: 'Account & Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'payment' as SettingsSection, label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'notifications' as SettingsSection, label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'preferences' as SettingsSection, label: 'Preferences', icon: <Palette className="w-5 h-5" /> },
    { id: 'privacy' as SettingsSection, label: 'Privacy & Security', icon: <Lock className="w-5 h-5" /> },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {section.icon}
                      <span>{section.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'profile' && <OrganizationProfileTab provider={provider} onUpdate={setProvider} />}
            {activeSection === 'security' && <AccountSecurityTab provider={provider} />}
            {activeSection === 'payment' && <PaymentMethodsTab provider={provider} />}
            {activeSection === 'notifications' && <NotificationPreferencesTab />}
            {activeSection === 'preferences' && <PreferencesTab />}
            {activeSection === 'privacy' && <PrivacySecurityTab provider={provider} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}

