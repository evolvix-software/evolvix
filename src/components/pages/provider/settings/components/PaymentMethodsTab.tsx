"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Provider } from '@/data/mock/providerData';
import { CreditCard, Plus, Edit, Trash2, CheckCircle, AlertCircle, Building2, Smartphone } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'upi' | 'wallet';
  bankName?: string;
  accountNumber: string;
  ifscCode?: string;
  accountHolderName: string;
  upiId?: string;
  walletType?: string;
  isDefault: boolean;
  status: 'verified' | 'pending' | 'rejected';
  lastUsed?: string;
}

interface PaymentMethodsTabProps {
  provider: Provider | null;
}

export function PaymentMethodsTab({ provider }: PaymentMethodsTabProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank',
      bankName: 'State Bank of India',
      accountNumber: '****1234',
      ifscCode: 'SBIN0001234',
      accountHolderName: provider?.organizationName || 'Organization',
      isDefault: true,
      status: 'verified',
      lastUsed: new Date().toISOString(),
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'bank' as 'bank' | 'upi' | 'wallet',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: provider?.organizationName || '',
    upiId: '',
    walletType: '',
  });

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '****' + accountNumber.slice(-4);
  };

  const handleAddPaymentMethod = () => {
    if (!formData.accountHolderName) {
      alert('Account holder name is required');
      return;
    }

    if (formData.type === 'bank' && (!formData.bankName || !formData.accountNumber || !formData.ifscCode)) {
      alert('Please fill all bank details');
      return;
    }

    if (formData.type === 'upi' && !formData.upiId) {
      alert('UPI ID is required');
      return;
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type,
      bankName: formData.bankName,
      accountNumber: formData.type === 'bank' ? maskAccountNumber(formData.accountNumber) : formData.accountNumber,
      ifscCode: formData.ifscCode,
      accountHolderName: formData.accountHolderName,
      upiId: formData.upiId,
      walletType: formData.walletType,
      isDefault: paymentMethods.length === 0,
      status: 'pending',
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setFormData({
      type: 'bank',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: provider?.organizationName || '',
      upiId: '',
      walletType: '',
    });
    setShowAddForm(false);
    alert('Payment method added. Verification pending.');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };

  const getStatusBadge = (status: PaymentMethod['status']) => {
    const styles = {
      verified: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    };
    const icons = {
      verified: <CheckCircle className="w-3 h-3" />,
      pending: <AlertCircle className="w-3 h-3" />,
      rejected: <AlertCircle className="w-3 h-3" />,
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </h3>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No payment methods added yet</p>
              <Button onClick={() => setShowAddForm(true)}>Add Payment Method</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {method.type === 'bank' ? (
                          <Building2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Smartphone className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {method.type === 'bank'
                              ? `${method.bankName} - ${method.accountNumber}`
                              : method.type === 'upi'
                              ? `UPI: ${method.upiId}`
                              : `${method.walletType} Wallet`}
                          </h4>
                          {method.isDefault && (
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              Default
                            </span>
                          )}
                          {getStatusBadge(method.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Account Holder: {method.accountHolderName}</p>
                          {method.type === 'bank' && method.ifscCode && (
                            <p>IFSC: {method.ifscCode}</p>
                          )}
                          {method.lastUsed && (
                            <p>Last used: {new Date(method.lastUsed).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(method.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(method.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Add Payment Method</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Method Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            {formData.type === 'bank' && (
              <>
                <Input
                  label="Bank Name *"
                  value={formData.bankName}
                  onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  icon={<Building2 className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Account Number *"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  icon={<CreditCard className="w-4 h-4" />}
                  required
                />
                <Input
                  label="IFSC Code *"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  placeholder="SBIN0001234"
                  required
                />
              </>
            )}

            {formData.type === 'upi' && (
              <Input
                label="UPI ID *"
                value={formData.upiId}
                onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
                icon={<Smartphone className="w-4 h-4" />}
                placeholder="yourname@upi"
                required
              />
            )}

            {formData.type === 'wallet' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Wallet Type *</label>
                  <select
                    value={formData.walletType}
                    onChange={(e) => setFormData(prev => ({ ...prev, walletType: e.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select wallet...</option>
                    <option value="Paytm">Paytm</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Google Pay">Google Pay</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                  </select>
                </div>
                <Input
                  label="Wallet ID *"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  icon={<Smartphone className="w-4 h-4" />}
                  required
                />
              </>
            )}

            <Input
              label="Account Holder Name *"
              value={formData.accountHolderName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
              required
            />

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-2">Verification Required</p>
              <p className="text-xs text-muted-foreground">
                After adding a payment method, you may need to upload verification documents (e.g., bank statement) for verification.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

