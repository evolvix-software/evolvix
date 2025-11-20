"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/common/layout/Layout';
import { Card } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { ArrowLeft, Save } from 'lucide-react';
import { providerService, campaignService, courseService } from '@/data/mock/providerData';

const campaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  campaignType: z.enum(['course-specific', 'pooled', 'general']),
  totalSlots: z.number().min(1, 'Must have at least 1 slot'),
  awardType: z.enum(['full', 'partial']),
  partialAmount: z.number().optional(),
  requiredAmount: z.number().min(0),
  fundingModel: z.enum(['per-student', 'pooled', 'variable']),
  minCGPA: z.number().min(0).max(10).optional(),
  maxCGPA: z.number().min(0).max(10).optional(),
  financialNeedRequired: z.boolean(),
  meritBased: z.boolean(),
  needBased: z.boolean(),
  applicationOpenDate: z.string(),
  applicationCloseDate: z.string(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

export default function NewCampaignPage() {
  const router = useRouter();
  const [provider, setProvider] = useState(providerService.getCurrentProvider());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses] = useState(courseService.getAll());

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignType: 'general',
      awardType: 'full',
      fundingModel: 'per-student',
      financialNeedRequired: false,
      meritBased: false,
      needBased: false,
      applicationOpenDate: new Date().toISOString().split('T')[0],
      applicationCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const awardType = watch('awardType');
  const campaignType = watch('campaignType');

  useEffect(() => {
    // If no provider exists, create one from registration data
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
      }
    }
  }, [provider, router]);

  const onSubmit = async (data: CampaignFormData) => {
    const currentProvider = providerService.getCurrentProvider();
    if (!currentProvider) return;

    setIsSubmitting(true);
    try {
      const campaign = campaignService.create({
        providerId: currentProvider.id,
        title: data.title,
        description: data.description,
        campaignType: data.campaignType,
        campaignSlug: data.title.toLowerCase().replace(/\s+/g, '-'),
        totalSlots: data.totalSlots,
        awardType: data.awardType,
        partialAmount: data.awardType === 'partial' ? data.partialAmount : undefined,
        requiredAmount: data.requiredAmount,
        fundingModel: data.fundingModel,
        eligibilityRules: {
          minCGPA: data.minCGPA,
          maxCGPA: data.maxCGPA,
          financialNeedRequired: data.financialNeedRequired,
          meritBased: data.meritBased,
          needBased: data.needBased,
        },
        applicationOpenDate: new Date(data.applicationOpenDate).toISOString(),
        applicationCloseDate: new Date(data.applicationCloseDate).toISOString(),
        isOpen: true,
        status: 'draft',
      });

      router.push(`/portal/provider/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!provider) {
    return null;
  }

  return (
    <Layout title="Create Campaign" role="provider">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
            <p className="text-muted-foreground mt-1">
              Set up a new scholarship campaign
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Campaign Title"
                  placeholder="e.g., Tech Scholarship 2024"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your scholarship campaign..."
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Campaign Type
                  </label>
                  <select
                    {...register('campaignType')}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="general">General Scholarship</option>
                    <option value="course-specific">Course-Specific</option>
                    <option value="pooled">Pooled Scholarship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scholarship Details */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Scholarship Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Total Slots"
                  type="number"
                  placeholder="50"
                  error={errors.totalSlots?.message}
                  {...register('totalSlots', { valueAsNumber: true })}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Award Type
                  </label>
                  <select
                    {...register('awardType')}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="full">Full Scholarship</option>
                    <option value="partial">Partial Scholarship</option>
                  </select>
                </div>

                {awardType === 'partial' && (
                  <Input
                    label="Partial Amount (₹)"
                    type="number"
                    placeholder="25000"
                    error={errors.partialAmount?.message}
                    {...register('partialAmount', { valueAsNumber: true })}
                  />
                )}

                <Input
                  label="Required Amount (₹)"
                  type="number"
                  placeholder="1000000"
                  error={errors.requiredAmount?.message}
                  {...register('requiredAmount', { valueAsNumber: true })}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Funding Model
                  </label>
                  <select
                    {...register('fundingModel')}
                    className="w-full p-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="per-student">Per Student</option>
                    <option value="pooled">Pooled</option>
                    <option value="variable">Variable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Eligibility Rules */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Eligibility Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum CGPA (Optional)"
                  type="number"
                  step="0.1"
                  placeholder="7.0"
                  error={errors.minCGPA?.message}
                  {...register('minCGPA', { valueAsNumber: true })}
                />

                <Input
                  label="Maximum CGPA (Optional)"
                  type="number"
                  step="0.1"
                  placeholder="10.0"
                  error={errors.maxCGPA?.message}
                  {...register('maxCGPA', { valueAsNumber: true })}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('meritBased')}
                    className="w-4 h-4 rounded border-input"
                  />
                  <label className="text-sm font-medium text-foreground">Merit-Based</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('needBased')}
                    className="w-4 h-4 rounded border-input"
                  />
                  <label className="text-sm font-medium text-foreground">Need-Based</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('financialNeedRequired')}
                    className="w-4 h-4 rounded border-input"
                  />
                  <label className="text-sm font-medium text-foreground">Financial Need Required</label>
                </div>
              </div>
            </div>

            {/* Application Window */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Application Window</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Open Date"
                  type="date"
                  error={errors.applicationOpenDate?.message}
                  {...register('applicationOpenDate')}
                />

                <Input
                  label="Close Date"
                  type="date"
                  error={errors.applicationCloseDate?.message}
                  {...register('applicationCloseDate')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                className="bg-gradient-to-r from-primary to-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </Layout>
  );
}

