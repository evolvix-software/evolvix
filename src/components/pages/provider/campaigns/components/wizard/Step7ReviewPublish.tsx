"use client";

import { useFormContext } from 'react-hook-form';
import { CampaignWizardFormData } from '../CampaignCreationWizard';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { CheckCircle, Calendar, Users, Wallet, Award, FileText } from 'lucide-react';

export function Step7ReviewPublish() {
  const { watch } = useFormContext<CampaignWizardFormData>();

  const formData = watch();

  const sections = [
    {
      title: 'Campaign Basics',
      icon: <FileText className="w-5 h-5" />,
      data: [
        { label: 'Title', value: formData.title },
        { label: 'Type', value: formData.campaignType?.replace('-', ' ') },
        { label: 'Slug', value: formData.campaignSlug },
      ],
    },
    {
      title: 'Scholarship Details',
      icon: <Award className="w-5 h-5" />,
      data: [
        { label: 'Total Slots', value: formData.totalSlots },
        { label: 'Award Type', value: formData.awardType },
        { label: 'Funding Model', value: formData.fundingModel?.replace('-', ' ') },
        { label: 'Required Amount', value: `₹${(formData.requiredAmount || 0).toLocaleString('en-IN')}` },
      ],
    },
    {
      title: 'Eligibility Rules',
      icon: <Users className="w-5 h-5" />,
      data: [
        { label: 'Min CGPA', value: formData.minCGPA || 'Not specified' },
        { label: 'Max CGPA', value: formData.maxCGPA || 'Not specified' },
        { label: 'Merit-Based', value: formData.meritBased ? 'Yes' : 'No' },
        { label: 'Need-Based', value: formData.needBased ? 'Yes' : 'No' },
        { label: 'Financial Need Required', value: formData.financialNeedRequired ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Selection Criteria',
      icon: <Award className="w-5 h-5" />,
      data: [
        { label: 'Academic Weight', value: `${formData.academicWeight}%` },
        { label: 'Financial Need Weight', value: `${formData.financialNeedWeight}%` },
        { label: 'Motivation Weight', value: `${formData.motivationWeight}%` },
        { label: 'Interview Required', value: formData.interviewRequired ? 'Yes' : 'No' },
        { label: 'Manual Review', value: formData.manualReviewRequired ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Application Window',
      icon: <Calendar className="w-5 h-5" />,
      data: [
        { label: 'Open Date', value: formData.applicationOpenDate ? new Date(formData.applicationOpenDate).toLocaleDateString() : 'Not set' },
        { label: 'Close Date', value: formData.applicationCloseDate ? new Date(formData.applicationCloseDate).toLocaleDateString() : 'Not set' },
        { label: 'Auto-close', value: formData.autoCloseWhenSlotsFilled ? 'Yes' : 'No' },
        { label: 'Timezone', value: formData.timezone },
      ],
    },
    {
      title: 'Funding & Budget',
      icon: <Wallet className="w-5 h-5" />,
      data: [
        { label: 'Required Amount', value: `₹${(formData.requiredAmount || 0).toLocaleString('en-IN')}` },
        { label: 'Payment Schedule', value: formData.paymentSchedule?.replace('-', ' ') },
        { label: 'Reserve Funds', value: formData.reserveFunds ? `₹${formData.reserveFunds.toLocaleString('en-IN')}` : 'None' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
        <h2 className="text-2xl font-semibold text-foreground">Review Your Campaign</h2>
        <p className="text-muted-foreground">
          Please review all details before publishing. You can go back to edit any section.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-2 pb-3">
              {section.icon}
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.data.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {String(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description Preview */}
      {formData.description && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">Campaign Description</h3>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-foreground whitespace-pre-wrap">{formData.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publishing Options */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Publishing Options</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="publish-now"
              name="publishOption"
              value="now"
              defaultChecked
              className="w-4 h-4"
            />
            <label htmlFor="publish-now" className="text-sm font-medium text-foreground cursor-pointer">
              Publish Now
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="publish-schedule"
              name="publishOption"
              value="schedule"
              className="w-4 h-4"
            />
            <label htmlFor="publish-schedule" className="text-sm font-medium text-foreground cursor-pointer">
              Schedule Publication
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="save-draft"
              name="publishOption"
              value="draft"
              className="w-4 h-4"
            />
            <label htmlFor="save-draft" className="text-sm font-medium text-foreground cursor-pointer">
              Save as Draft
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

