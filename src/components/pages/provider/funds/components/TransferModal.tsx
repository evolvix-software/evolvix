"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { X, Upload } from 'lucide-react';

interface TransferModalProps {
  providerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransferModal({ providerId, onClose, onSuccess }: TransferModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    campaign: '',
    paymentMethod: 'bank-transfer',
    transactionReference: '',
    notes: '',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implement transfer logic
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Transfer Funds</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Amount (₹)"
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                required
              >
                <option value="bank-transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="credit-card">Credit Card</option>
              </select>
            </div>

            <Input
              label="Transaction Reference"
              required
              value={formData.transactionReference}
              onChange={(e) => setFormData({ ...formData, transactionReference: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Proof Document
              </label>
              <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="proof-upload"
                  required
                />
                <label htmlFor="proof-upload" className="cursor-pointer text-sm text-primary">
                  Click to upload proof
                </label>
                {proofFile && <p className="text-xs text-muted-foreground mt-2">{proofFile.name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                Submit Transfer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

