"use client";

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/common/forms/Input';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Calendar, Clock } from 'lucide-react';
import { useEffect } from 'react';

export function Step5ApplicationWindow() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CampaignWizardFormData>();

  const applicationOpenDate = watch('applicationOpenDate');
  const applicationCloseDate = watch('applicationCloseDate');
  const autoCloseWhenSlotsFilled = watch('autoCloseWhenSlotsFilled');

  const getWindowStatus = () => {
    if (!applicationOpenDate || !applicationCloseDate) return null;

    const now = new Date();
    const openDate = new Date(applicationOpenDate);
    const closeDate = new Date(applicationCloseDate);

    if (now < openDate) {
      const daysUntil = Math.ceil((openDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'upcoming', days: daysUntil };
    } else if (now >= openDate && now <= closeDate) {
      const daysRemaining = Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: 'open', days: daysRemaining };
    } else {
      return { status: 'closed', days: 0 };
    }
  };

  const windowStatus = getWindowStatus();
  const duration = applicationOpenDate && applicationCloseDate
    ? Math.ceil(
        (new Date(applicationCloseDate).getTime() - new Date(applicationOpenDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Application Open Date *"
          type="date"
          error={errors.applicationOpenDate?.message}
          {...register('applicationOpenDate')}
        />

        <Input
          label="Application Close Date *"
          type="date"
          error={errors.applicationCloseDate?.message}
          {...register('applicationCloseDate')}
        />
      </div>

      {errors.applicationCloseDate && (
        <p className="text-sm text-destructive">{errors.applicationCloseDate.message}</p>
      )}

      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('autoCloseWhenSlotsFilled')}
            className="w-4 h-4 rounded border-input"
          />
          <span className="text-sm font-medium text-foreground">
            Auto-close when slots filled
          </span>
        </label>
        <p className="text-xs text-muted-foreground ml-6">
          Automatically close applications when all slots are awarded
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Timezone
        </label>
        <select
          {...register('timezone')}
          className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
        </select>
      </div>

      {/* Preview */}
      {applicationOpenDate && applicationCloseDate && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Application Window Preview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Open Date:</span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(applicationOpenDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Close Date:</span>
                <span className="text-sm font-semibold text-foreground">
                  {new Date(applicationCloseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-semibold text-foreground">
                  {duration} days
                </span>
              </div>
              {windowStatus && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Status:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      windowStatus.status === 'open'
                        ? 'text-green-600'
                        : windowStatus.status === 'upcoming'
                        ? 'text-blue-600'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {windowStatus.status === 'open' && `${windowStatus.days} days remaining`}
                    {windowStatus.status === 'upcoming' && `Opens in ${windowStatus.days} days`}
                    {windowStatus.status === 'closed' && 'Closed'}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {duration > 0 && duration < 7 && (
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ Application window is less than 7 days. Consider extending for better reach.
          </p>
        </div>
      )}
    </div>
  );
}

