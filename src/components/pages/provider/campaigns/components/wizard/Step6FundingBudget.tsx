"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common/forms/Input';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Wallet, AlertCircle } from 'lucide-react';

export function Step6FundingBudget() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const requiredAmount = watch('requiredAmount') || 0;
  const totalSlots = watch('totalSlots') || 0;
  const fundingGoal = watch('fundingGoal') || 0;
  const reserveFunds = watch('reserveFunds') || 0;
  const paymentSchedule = watch('paymentSchedule');

  const perStudentCost = totalSlots > 0 ? requiredAmount / totalSlots : 0;
  const totalWithReserve = requiredAmount + reserveFunds;
  const fundingGap = fundingGoal > 0 ? fundingGoal - requiredAmount : 0;

  return (
    <div className="space-y-6">
      <div>
        <Input
          label="Total Required Amount (₹) *"
          type="number"
          min={0}
          placeholder="1000000"
          error={errors.requiredAmount?.message}
          {...register('requiredAmount', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Total funding needed for this campaign (auto-calculated from Step 2)
        </p>
      </div>

      <div>
        <Input
          label="Funding Goal (Optional)"
          type="number"
          min={0}
          placeholder="1200000"
          {...register('fundingGoal', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Target funding amount (can be higher than required amount)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Payment Schedule *
        </label>
        <select
          {...register('paymentSchedule')}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="one-time">One-time Payment</option>
          <option value="monthly">Monthly Installments</option>
          <option value="quarterly">Quarterly Installments</option>
        </select>
        {errors.paymentSchedule && (
          <p className="text-sm text-destructive mt-1">{errors.paymentSchedule.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          How funds will be disbursed to scholars
        </p>
      </div>

      <div>
        <Input
          label="Reserve Funds (Optional)"
          type="number"
          min={0}
          placeholder="100000"
          {...register('reserveFunds', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Additional funds to reserve for unexpected expenses or emergencies
        </p>
      </div>

      {/* Budget Breakdown */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Budget Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Slots:</span>
              <span className="font-semibold text-foreground">{totalSlots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Per Student Cost:</span>
              <span className="font-semibold text-foreground">
                ₹{perStudentCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Required Amount:</span>
              <span className="font-semibold text-foreground">
                ₹{requiredAmount.toLocaleString('en-IN')}
              </span>
            </div>
            {reserveFunds > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reserve Funds:</span>
                <span className="font-semibold text-foreground">
                  ₹{reserveFunds.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {reserveFunds > 0 && (
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Total Budget:</span>
                <span className="font-semibold text-foreground">
                  ₹{totalWithReserve.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {fundingGoal > 0 && (
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Funding Goal:</span>
                <span className="font-semibold text-foreground">
                  ₹{fundingGoal.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            {fundingGap > 0 && (
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Funding Gap:</span>
                <span className="font-semibold text-foreground text-green-600">
                  ₹{fundingGap.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Balance Check */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Available Balance Check
              </h3>
              <p className="text-xs text-muted-foreground">
                Ensure you have sufficient funds in your provider account before publishing this campaign.
                You can transfer funds from the Fund Management page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

