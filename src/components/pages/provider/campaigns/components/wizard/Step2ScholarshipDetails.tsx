"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common/forms/Input';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';

export function Step2ScholarshipDetails() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const totalSlots = watch('totalSlots') || 0;
  const awardType = watch('awardType');
  const partialAmount = watch('partialAmount') || 0;
  const fundingModel = watch('fundingModel');
  const requiredAmount = watch('requiredAmount') || 0;

  // Auto-calculate required amount
  useEffect(() => {
    if (totalSlots > 0) {
      let calculated = 0;
      if (awardType === 'full') {
        // Assume average course price for full scholarship
        calculated = totalSlots * 50000; // Default ₹50k per student
      } else if (awardType === 'partial' && partialAmount > 0) {
        calculated = totalSlots * partialAmount;
      }

      if (fundingModel === 'per-student' && calculated > 0) {
        setValue('requiredAmount', calculated);
      }
    }
  }, [totalSlots, awardType, partialAmount, fundingModel, setValue]);

  const perStudentCost =
    totalSlots > 0 && requiredAmount > 0 ? requiredAmount / totalSlots : 0;

  return (
    <div className="space-y-6">
      <div>
        <Input
          label="Total Slots *"
          type="number"
          min={1}
          placeholder="50"
          error={errors.totalSlots?.message}
          {...register('totalSlots', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Number of scholarship slots available in this campaign
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Award Type *
        </label>
        <select
          {...register('awardType')}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="full">Full Scholarship</option>
          <option value="partial">Partial Scholarship</option>
        </select>
        {errors.awardType && (
          <p className="text-sm text-destructive mt-1">{errors.awardType.message}</p>
        )}
      </div>

      {awardType === 'partial' && (
        <div>
          <Input
            label="Partial Amount (₹) *"
            type="number"
            min={0}
            placeholder="25000"
            error={errors.partialAmount?.message}
            {...register('partialAmount', { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Fixed amount per student for partial scholarships
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Funding Model *
        </label>
        <select
          {...register('fundingModel')}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="per-student">Per Student</option>
          <option value="pooled">Pooled</option>
          <option value="variable">Variable</option>
        </select>
        {errors.fundingModel && (
          <p className="text-sm text-destructive mt-1">{errors.fundingModel.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {fundingModel === 'per-student' && 'Fixed amount per student'}
          {fundingModel === 'pooled' && 'Total amount shared across all students'}
          {fundingModel === 'variable' && 'Variable amount based on need'}
        </p>
      </div>

      <div>
        <Input
          label="Required Amount (₹) *"
          type="number"
          min={0}
          placeholder="1000000"
          error={errors.requiredAmount?.message}
          {...register('requiredAmount', { valueAsNumber: true })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Total funding required for this campaign
        </p>
      </div>

      {/* Funding Breakdown */}
      {totalSlots > 0 && requiredAmount > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Funding Breakdown</h3>
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
                <span className="text-muted-foreground">Total Required:</span>
                <span className="font-semibold text-foreground">
                  ₹{requiredAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

