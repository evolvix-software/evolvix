"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react';
import { Step1Basics } from './wizard/Step1Basics';
import { Step2ScholarshipDetails } from './wizard/Step2ScholarshipDetails';
import { Step3EligibilityRules } from './wizard/Step3EligibilityRules';
import { Step4SelectionCriteria } from './wizard/Step4SelectionCriteria';
import { Step5ApplicationWindow } from './wizard/Step5ApplicationWindow';
import { Step6FundingBudget } from './wizard/Step6FundingBudget';
import { Step7ReviewPublish } from './wizard/Step7ReviewPublish';

const campaignWizardSchema = z.object({
  // Step 1: Campaign Basics
  providerId: z.string().optional(), // Required for admin, auto-filled for provider
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  campaignType: z.enum(['course-specific', 'pooled', 'general']),
  linkedCourseIds: z.array(z.string()).optional(),
  campaignSlug: z.string().optional(),

  // Step 2: Scholarship Details
  totalSlots: z.number().min(1, 'Must have at least 1 slot'),
  awardType: z.enum(['full', 'partial']),
  partialAmount: z.number().optional(),
  fundingModel: z.enum(['per-student', 'pooled', 'variable']),
  requiredAmount: z.number().min(0, 'Required amount must be positive'),

  // Step 3: Eligibility Rules
  minCGPA: z.number().min(0).max(10).optional(),
  maxCGPA: z.number().min(0).max(10).optional(),
  specificCourses: z.array(z.string()).optional(),
  specificPrograms: z.array(z.string()).optional(),
  financialNeedRequired: z.boolean(),
  meritBased: z.boolean(),
  needBased: z.boolean(),
  geographicRestrictions: z.array(z.string()).optional(),
  ageRange: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
  otherCriteria: z.string().optional(),

  // Step 4: Selection Criteria
  academicWeight: z.number().min(0).max(100),
  financialNeedWeight: z.number().min(0).max(100),
  motivationWeight: z.number().min(0).max(100),
  interviewRequired: z.boolean(),
  mentorRecommendationRequired: z.boolean(),
  autoAwardThreshold: z.number().min(0).max(100).optional(),
  manualReviewRequired: z.boolean(),

  // Step 5: Application Window
  applicationOpenDate: z.string(),
  applicationCloseDate: z.string(),
  autoCloseWhenSlotsFilled: z.boolean(),
  timezone: z.string().default('UTC'),

  // Step 6: Funding & Budget
  fundingGoal: z.number().optional(),
  paymentSchedule: z.enum(['one-time', 'monthly', 'quarterly']),
  reserveFunds: z.number().optional(),
}).refine((data) => {
  // Validate that weights sum to 100
  return data.academicWeight + data.financialNeedWeight + data.motivationWeight === 100;
}, {
  message: 'Selection criteria weights must sum to 100',
  path: ['academicWeight'],
}).refine((data) => {
  // Validate dates
  if (data.applicationOpenDate && data.applicationCloseDate) {
    return new Date(data.applicationCloseDate) > new Date(data.applicationOpenDate);
  }
  return true;
}, {
  message: 'Close date must be after open date',
  path: ['applicationCloseDate'],
}).refine((data) => {
  // Validate course-specific campaigns have linked courses
  if (data.campaignType === 'course-specific') {
    return data.linkedCourseIds && data.linkedCourseIds.length > 0;
  }
  return true;
}, {
  message: 'Course-specific campaigns must have at least one linked course',
  path: ['linkedCourseIds'],
});

export type CampaignWizardFormData = z.infer<typeof campaignWizardSchema>;

interface CampaignCreationWizardProps {
  campaignId?: string; // For editing
  onComplete?: () => void;
}

export function CampaignCreationWizard({ campaignId, onComplete }: CampaignCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const methods = useForm<CampaignWizardFormData>({
    resolver: zodResolver(campaignWizardSchema),
    mode: 'onChange',
    defaultValues: {
      campaignType: 'general',
      awardType: 'full',
      fundingModel: 'per-student',
      totalSlots: 1,
      requiredAmount: 0,
      financialNeedRequired: false,
      meritBased: false,
      needBased: false,
      academicWeight: 40,
      financialNeedWeight: 30,
      motivationWeight: 30,
      interviewRequired: false,
      mentorRecommendationRequired: false,
      manualReviewRequired: true,
      autoCloseWhenSlotsFilled: false,
      applicationOpenDate: new Date().toISOString().split('T')[0],
      applicationCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timezone: 'UTC',
      paymentSchedule: 'one-time',
      linkedCourseIds: [],
    },
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const steps = [
    { number: 1, title: 'Campaign Basics', component: Step1Basics },
    { number: 2, title: 'Scholarship Details', component: Step2ScholarshipDetails },
    { number: 3, title: 'Eligibility Rules', component: Step3EligibilityRules },
    { number: 4, title: 'Selection Criteria', component: Step4SelectionCriteria },
    { number: 5, title: 'Application Window', component: Step5ApplicationWindow },
    { number: 6, title: 'Funding & Budget', component: Step6FundingBudget },
    { number: 7, title: 'Review & Publish', component: Step7ReviewPublish },
  ];

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof CampaignWizardFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['title', 'description', 'campaignType', 'linkedCourseIds'];
        break;
      case 2:
        fieldsToValidate = ['totalSlots', 'awardType', 'fundingModel', 'requiredAmount'];
        break;
      case 3:
        fieldsToValidate = ['minCGPA', 'maxCGPA', 'financialNeedRequired', 'meritBased', 'needBased'];
        break;
      case 4:
        fieldsToValidate = ['academicWeight', 'financialNeedWeight', 'motivationWeight'];
        break;
      case 5:
        fieldsToValidate = ['applicationOpenDate', 'applicationCloseDate'];
        break;
      case 6:
        fieldsToValidate = ['requiredAmount', 'paymentSchedule'];
        break;
      case 7:
        // Final step - validate all
        return await trigger();
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    // Save as draft without validation
    const data = methods.getValues();
    // Implement draft save logic
    console.log('Saving draft:', data);
  };

  const onSubmit = async (data: CampaignWizardFormData) => {
    // Implement campaign creation/update logic
    console.log('Submitting campaign:', data);
    // After successful submission, redirect or call onComplete
    if (onComplete) {
      onComplete();
    } else {
      router.push('/portal/provider/campaigns');
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const isCompleted = index + 1 < currentStep;
              const isCurrent = index + 1 === currentStep;
              const isAccessible = index + 1 <= currentStep;

              return (
                <div
                  key={step.number}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-foreground">
                {steps[currentStep - 1].title}
              </h2>
            </CardHeader>
            <CardContent>
              <CurrentStepComponent />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    Publish Campaign
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

