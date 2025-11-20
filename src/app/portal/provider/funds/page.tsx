"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatCard } from '@/components/provider/common/StatCard';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { EmptyState } from '@/components/provider/common/EmptyState';
import { Input } from '@/components/common/forms/Input';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  FileText,
} from 'lucide-react';
import { providerService, transferService, Transfer } from '@/data/mock/providerData';

export default function FundsPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMethod, setTransferMethod] = useState('bank_transfer');

  useEffect(() => {
    // Get or create provider
    let currentProvider = provider;
    
    if (!currentProvider) {
      const registrationData = localStorage.getItem('evolvix_registration');
      if (registrationData) {
        const regData = JSON.parse(registrationData);
        currentProvider = providerService.createProvider({
          organizationName: regData.fullName || 'My Organization',
          organizationSlug: (regData.fullName || 'my-organization').toLowerCase().replace(/\s+/g, '-'),
          contactEmail: regData.email || '',
          userId: regData.email || '',
        });
        setProvider(currentProvider);
      } else {
        router.push('/auth/signin');
        return;
      }
    }

    if (!currentProvider) return;

    const allTransfers = transferService.getAll(currentProvider.id);
    setTransfers(allTransfers);
  }, [provider, router]);

  const handleTransfer = () => {
    const currentProvider = providerService.getCurrentProvider();
    if (!currentProvider || !transferAmount) return;

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;

    const transfer = transferService.create({
      providerId: currentProvider.id,
      amount,
      currency: 'INR',
      transferMethod,
      status: 'initiated',
    });

    // Update provider balance
    providerService.updateProvider({
      balance: currentProvider.balance + amount,
      totalTransferred: currentProvider.totalTransferred + amount,
    });

    setTransfers(transferService.getAll(currentProvider.id));
    setShowTransferModal(false);
    setTransferAmount('');
    setProvider(providerService.getCurrentProvider());
  };

  const currentProvider = providerService.getCurrentProvider();
  const totalTransferred = transfers.reduce((sum, t) => sum + t.amount, 0);
  const pendingTransfers = transfers.filter(t => t.status === 'initiated' || t.status === 'in-transit').length;
  const confirmedTransfers = transfers.filter(t => t.status === 'confirmed').length;

  return (
    <Layout title="Fund Management" role="provider">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fund Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage fund transfers and track disbursements
            </p>
          </div>
          <Button
            onClick={() => setShowTransferModal(true)}
            className="bg-gradient-to-r from-primary to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Transfer Funds
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Current Balance"
            value={`₹${currentProvider ? (currentProvider.balance / 100000).toFixed(1) : 0}L`}
            icon={<Wallet className="w-6 h-6" />}
          />
          <StatCard
            title="Total Transferred"
            value={`₹${(totalTransferred / 100000).toFixed(1)}L`}
            icon={<ArrowUpRight className="w-6 h-6" />}
          />
          <StatCard
            title="Pending Transfers"
            value={pendingTransfers}
            icon={<ArrowDownRight className="w-6 h-6" />}
          />
        </div>

        {/* Transfer History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Transfer History</h2>
          {transfers.length === 0 ? (
            <EmptyState
              icon={<Wallet className="w-12 h-12 text-muted-foreground" />}
              title="No transfers yet"
              description="Transfer funds to Evolvix to start awarding scholarships"
              action={{
                label: 'Transfer Funds',
                onClick: () => setShowTransferModal(true),
              }}
            />
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        ₹{transfer.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={transfer.status} />
                    <span className="text-sm text-muted-foreground capitalize">
                      {transfer.transferMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Transfer Funds</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount (₹)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Method
                  </label>
                  <select
                    value={transferMethod}
                    onChange={(e) => setTransferMethod(e.target.value)}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTransferModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                    onClick={handleTransfer}
                  >
                    Transfer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

