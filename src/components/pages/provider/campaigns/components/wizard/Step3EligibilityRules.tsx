"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common/forms/Input';
import { CampaignWizardFormData } from '../CampaignCreationWizard';

export function Step3EligibilityRules() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const financialNeedRequired = watch('financialNeedRequired');
  const meritBased = watch('meritBased');
  const needBased = watch('needBased');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Academic Criteria</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum CGPA (Optional)"
            type="number"
            step="0.1"
            min={0}
            max={10}
            placeholder="7.0"
            error={errors.minCGPA?.message}
            {...register('minCGPA', { valueAsNumber: true })}
          />

          <Input
            label="Maximum CGPA (Optional)"
            type="number"
            step="0.1"
            min={0}
            max={10}
            placeholder="10.0"
            error={errors.maxCGPA?.message}
            {...register('maxCGPA', { valueAsNumber: true })}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Leave blank if no CGPA restrictions apply
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Financial Criteria</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('meritBased')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">Merit-Based</span>
          </label>
          <p className="text-xs text-muted-foreground ml-6">
            Award based on academic performance and achievements
          </p>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('needBased')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">Need-Based</span>
          </label>
          <p className="text-xs text-muted-foreground ml-6">
            Award based on financial need and circumstances
          </p>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('financialNeedRequired')}
              className="w-4 h-4 rounded border-input"
            />
            <span className="text-sm font-medium text-foreground">
              Financial Need Required
            </span>
          </label>
          <p className="text-xs text-muted-foreground ml-6">
            Applicants must demonstrate financial need
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Other Criteria</h3>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Geographic Restrictions (Optional)
          </label>
          <input
            type="text"
            {...register('geographicRestrictions')}
            placeholder="e.g., India, Karnataka, Bangalore"
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Comma-separated list of locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Age (Optional)"
            type="number"
            min={0}
            placeholder="18"
            {...register('ageRange.min', { valueAsNumber: true })}
          />

          <Input
            label="Maximum Age (Optional)"
            type="number"
            min={0}
            placeholder="30"
            {...register('ageRange.max', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Custom Criteria (Optional)
          </label>
          <textarea
            {...register('otherCriteria')}
            rows={4}
            placeholder="Any additional eligibility requirements..."
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

