"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { BalanceWidget } from './components/BalanceWidget';
import { TransferHistory } from './components/TransferHistory';
import { DisbursementLedger } from './components/DisbursementLedger';
import { ReportsTab } from './components/ReportsTab';
import { PaymentMethodsTab } from './components/PaymentMethodsTab';
import { TransferModal } from './components/TransferModal';
import { Wallet, ArrowUpCircle, ArrowDownCircle, FileText, CreditCard, Download } from 'lucide-react';
import { providerService } from '@/data/mock/providerData';

type Tab = 'overview' | 'transfers' | 'disbursements' | 'reports' | 'payment-methods';

export function FundManagementPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
        return;
      }
    }
    setLoading(false);
  }, [provider, router]);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: <Wallet className="w-4 h-4" /> },
    { id: 'transfers' as Tab, label: 'Transfers', icon: <ArrowUpCircle className="w-4 h-4" /> },
    { id: 'disbursements' as Tab, label: 'Disbursements', icon: <ArrowDownCircle className="w-4 h-4" /> },
    { id: 'reports' as Tab, label: 'Transparency', icon: <FileText className="w-4 h-4" /> },
    { id: 'payment-methods' as Tab, label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <Layout title="Fund Management" role="provider" noCard>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Fund Management" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fund Management</h1>
            <p className="text-muted-foreground mt-1">
              Track your fund transactions and view transparency information
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowTransferModal(true)} className="bg-gradient-to-r from-primary to-purple-600">
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Transfer Funds
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <BalanceWidget provider={provider} />}
          {activeTab === 'transfers' && <TransferHistory providerId={provider?.id || ''} />}
          {activeTab === 'disbursements' && <DisbursementLedger providerId={provider?.id || ''} />}
          {activeTab === 'reports' && <ReportsTab providerId={provider?.id || ''} />}
          {activeTab === 'payment-methods' && <PaymentMethodsTab />}
        </div>

        {/* Transfer Modal */}
        {showTransferModal && (
          <TransferModal
            providerId={provider?.id || ''}
            onClose={() => setShowTransferModal(false)}
            onSuccess={() => {
              setShowTransferModal(false);
              // Refresh data
            }}
          />
        )}
      </div>
    </Layout>
  );
}

