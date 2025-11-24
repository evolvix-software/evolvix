"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { CreditCard, Plus, Edit, Trash2, Check, X, Upload, Shield } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'bank-transfer' | 'upi' | 'credit-card' | 'paypal';
  accountDetails: string;
  isDefault: boolean;
  status: 'active' | 'pending' | 'inactive';
  last4?: string;
  bankName?: string;
  accountHolderName?: string;
}

export function PaymentMethodsTab() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'bank-transfer',
      accountDetails: '****1234',
      isDefault: true,
      status: 'active',
      last4: '1234',
      bankName: 'State Bank of India',
      accountHolderName: 'Tech Education Foundation',
    },
    {
      id: 'pm_2',
      type: 'upi',
      accountDetails: 'techfoundation@paytm',
      isDefault: false,
      status: 'active',
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'bank-transfer' as PaymentMethod['type'],
    accountDetails: '',
    isDefault: false,
    bankName: '',
    accountHolderName: '',
  });

  const handleAddMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: formData.type,
      accountDetails: formData.accountDetails,
      isDefault: formData.isDefault,
      status: 'pending',
      bankName: formData.bankName,
      accountHolderName: formData.accountHolderName,
      last4: formData.accountDetails.slice(-4),
    };

    if (formData.isDefault) {
      setPaymentMethods(paymentMethods.map(pm => ({ ...pm, isDefault: false })));
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    setFormData({
      type: 'bank-transfer',
      accountDetails: '',
      isDefault: false,
      bankName: '',
      accountHolderName: '',
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
  };

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bank-transfer':
        return 'Bank Transfer';
      case 'credit-card':
        return 'Credit Card';
      case 'upi':
        return 'UPI';
      case 'paypal':
        return 'PayPal';
      default:
        return type;
    }
  };

  const maskAccountDetails = (details: string, type: string) => {
    if (type === 'upi') return details;
    if (type === 'bank-transfer' && details.length > 4) {
      return `****${details.slice(-4)}`;
    }
    return details;
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Payment Methods</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No payment methods added</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      method.type === 'bank-transfer' ? 'bg-blue-50 dark:bg-blue-950' :
                      method.type === 'upi' ? 'bg-green-50 dark:bg-green-950' :
                      method.type === 'credit-card' ? 'bg-purple-50 dark:bg-purple-950' :
                      'bg-gray-50 dark:bg-gray-950'
                    }`}>
                      <CreditCard className={`w-5 h-5 ${
                        method.type === 'bank-transfer' ? 'text-blue-600' :
                        method.type === 'upi' ? 'text-green-600' :
                        method.type === 'credit-card' ? 'text-purple-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{getTypeLabel(method.type)}</h3>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Default
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          method.status === 'active' ? 'bg-green-100 text-green-700' :
                          method.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {method.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {maskAccountDetails(method.accountDetails, method.type)}
                      </p>
                      {method.bankName && (
                        <p className="text-xs text-muted-foreground mt-1">{method.bankName}</p>
                      )}
                      {method.accountHolderName && (
                        <p className="text-xs text-muted-foreground">{method.accountHolderName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMethod(method)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(method.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Security & Privacy</h3>
              <p className="text-sm text-muted-foreground">
                All payment information is encrypted and stored securely. We follow PCI DSS compliance standards
                to ensure your financial data is protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Add Payment Method</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod['type'] })}
                  className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  required
                >
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {formData.type === 'bank-transfer' && (
                <>
                  <Input
                    label="Bank Name *"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                  <Input
                    label="Account Holder Name *"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    required
                  />
                  <Input
                    label="Account Number *"
                    type="text"
                    value={formData.accountDetails}
                    onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                    placeholder="Enter account number"
                    required
                  />
                </>
              )}

              {formData.type === 'upi' && (
                <Input
                  label="UPI ID *"
                  value={formData.accountDetails}
                  onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                  placeholder="yourname@paytm"
                  required
                />
              )}

              {formData.type === 'credit-card' && (
                <>
                  <Input
                    label="Card Number *"
                    type="text"
                    value={formData.accountDetails}
                    onChange={(e) => setFormData({ ...formData, accountDetails: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                  <Input
                    label="Card Holder Name *"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    required
                  />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Verification Documents</label>
                <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="verification-upload"
                  />
                  <label htmlFor="verification-upload" className="cursor-pointer text-sm text-primary">
                    Click to upload verification documents
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">PDF, JPG, or PNG (Max 5MB)</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="default-payment"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-input"
                />
                <label htmlFor="default-payment" className="text-sm text-foreground">
                  Set as default payment method
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddMethod} className="flex-1">
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

