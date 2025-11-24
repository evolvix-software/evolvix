"use client";

import { useFormContext } from 'react-hook-form';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { Card, CardContent } from '@/components/common/forms/Card';
import { useEffect } from 'react';

export function Step4SelectionCriteria() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const academicWeight = watch('academicWeight') || 0;
  const financialNeedWeight = watch('financialNeedWeight') || 0;
  const motivationWeight = watch('motivationWeight') || 0;
  const totalWeight = academicWeight + financialNeedWeight + motivationWeight;

  // Auto-adjust weights to sum to 100
  useEffect(() => {
    if (totalWeight !== 100 && totalWeight > 0) {
      // Normalize weights proportionally
      const scale = 100 / totalWeight;
      setValue('academicWeight', Math.round(academicWeight * scale));
      setValue('financialNeedWeight', Math.round(financialNeedWeight * scale));
      setValue('motivationWeight', Math.round(motivationWeight * scale));
    }
  }, [academicWeight, financialNeedWeight, motivationWeight, totalWeight, setValue]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Scoring Weights</h3>
        <p className="text-sm text-muted-foreground">
          Set the weight for each scoring criterion. Total must equal 100.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Academic Weight
              </label>
              <span className="text-sm font-semibold text-foreground">{academicWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={academicWeight}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const remaining = 100 - value;
                const otherTotal = financialNeedWeight + motivationWeight;
                if (otherTotal > 0) {
                  const scale = remaining / otherTotal;
                  setValue('academicWeight', value);
                  setValue('financialNeedWeight', Math.round(financialNeedWeight * scale));
                  setValue('motivationWeight', Math.round(motivationWeight * scale));
                } else {
                  setValue('academicWeight', value);
                  setValue('financialNeedWeight', Math.floor(remaining / 2));
                  setValue('motivationWeight', Math.ceil(remaining / 2));
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Financial Need Weight
              </label>
              <span className="text-sm font-semibold text-foreground">{financialNeedWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={financialNeedWeight}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const remaining = 100 - value;
                const otherTotal = academicWeight + motivationWeight;
                if (otherTotal > 0) {
                  const scale = remaining / otherTotal;
                  setValue('financialNeedWeight', value);
                  setValue('academicWeight', Math.round(academicWeight * scale));
                  setValue('motivationWeight', Math.round(motivationWeight * scale));
                } else {
                  setValue('financialNeedWeight', value);
                  setValue('academicWeight', Math.floor(remaining / 2));
                  setValue('motivationWeight', Math.ceil(remaining / 2));
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">
                Motivation Weight
              </label>
              <span className="text-sm font-semibold text-foreground">{motivationWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={motivationWeight}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const remaining = 100 - value;
                const otherTotal = academicWeight + financialNeedWeight;
                if (otherTotal > 0) {
                  const scale = remaining / otherTotal;
                  setValue('motivationWeight', value);
                  setValue('academicWeight', Math.round(academicWeight * scale));
                  setValue('financialNeedWeight', Math.round(financialNeedWeight * scale));
                } else {
                  setValue('motivationWeight', value);
                  setValue('academicWeight', Math.floor(remaining / 2));
                  setValue('financialNeedWeight', Math.ceil(remaining / 2));
                }
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg ${totalWeight === 100 ? 'bg-green-50 dark:bg-green-950' : 'bg-yellow-50 dark:bg-yellow-950'}`}>
          <p className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
            Total Weight: {totalWeight}% {totalWeight === 100 ? '✓' : '(Must equal 100%)'}
          </p>
        </div>

        {errors.academicWeight && (
          <p className="text-sm text-destructive">{errors.academicWeight.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Selection Process</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('interviewRequired')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">Interview Required</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('mentorRecommendationRequired')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">
              Mentor Recommendation Required
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('manualReviewRequired')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">Manual Review Required</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Auto-Award Threshold (Optional)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="85"
            {...register('autoAwardThreshold', { valueAsNumber: true })}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Automatically award scholarships to applicants scoring above this threshold (0-100)
          </p>
        </div>
      </div>

      {/* Preview Scoring Calculation */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Scoring Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Academic (40%):</span>
              <span className="font-semibold text-foreground">40 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Financial Need (30%):</span>
              <span className="font-semibold text-foreground">30 points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Motivation (30%):</span>
              <span className="font-semibold text-foreground">30 points</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total Score:</span>
              <span className="font-semibold text-foreground">100 points</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

