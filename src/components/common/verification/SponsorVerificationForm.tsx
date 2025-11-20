"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { CountryCode } from '@/lib/api/verification';

interface SponsorVerificationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface SponsorFormData {
  country: CountryCode;
  sponsorInfo: {
    organizationName: string;
    representativeName: string;
    designation: string;
    organizationEmail: string;
    phoneNumber: string;
    csrReportsUrl?: string;
    websiteUrl?: string;
  };
  sponsorKYC: {
    registrationNumber: string;
    gstNumber?: string;
    panNumber?: string;
  };
}

export function SponsorVerificationForm({ onSubmit, isLoading }: SponsorVerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SponsorFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const selectedCountry = watch('country') as CountryCode || 'IN';

  const handleDocumentUpload = (field: string) => (url: string) => {
    setUploadedDocuments(prev => ({ ...prev, [field]: url }));
    setValue(field as any, url);
  };

  const handleFormSubmit = (data: SponsorFormData) => {
    const formData = {
      ...data,
      sponsorKYC: {
        ...data.sponsorKYC,
        registrationDocumentUrl: uploadedDocuments.registration,
        country: data.country,
      },
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Organization Information */}
      <Card className="border-0 shadow-sm bg-card dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-foreground">Organization Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your organization details for CSR/Sponsorship
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              {...register('sponsorInfo.organizationName', { required: 'Organization name is required' })}
              error={errors.sponsorInfo?.organizationName?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-foreground mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                {...register('country', { required: 'Country is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-foreground focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
                <option value="AE">UAE</option>
                <option value="EU">European Union</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Organization Email"
              type="email"
              {...register('sponsorInfo.organizationEmail', { 
                required: 'Organization email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              error={errors.sponsorInfo?.organizationEmail?.message}
              required
            />
            <Input
              label="Phone Number"
              {...register('sponsorInfo.phoneNumber', { required: 'Phone number is required' })}
              error={errors.sponsorInfo?.phoneNumber?.message}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Website"
              {...register('sponsorInfo.websiteUrl')}
              placeholder="https://example.com"
            />
            <Input
              label="CSR Reports URL"
              {...register('sponsorInfo.csrReportsUrl')}
              placeholder="https://example.com/csr-reports"
            />
          </div>
        </CardContent>
      </Card>

      {/* Authorized Representative */}
      <Card className="border-0 shadow-sm bg-card dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-foreground">Authorized Representative</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Details of the authorized person representing the organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('sponsorInfo.representativeName', { required: 'Name is required' })}
              error={errors.sponsorInfo?.representativeName?.message}
              required
            />
            <Input
              label="Designation"
              {...register('sponsorInfo.designation', { required: 'Designation is required' })}
              error={errors.sponsorInfo?.designation?.message}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization KYC Documents */}
      <Card className="border-0 shadow-sm bg-card dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-foreground">Organization KYC Documents</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload organization registration and tax documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Registration Number"
            {...register('sponsorKYC.registrationNumber', { required: 'Registration number is required' })}
            error={errors.sponsorKYC?.registrationNumber?.message}
            required
          />

          {selectedCountry === 'IN' && (
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="GST Number"
                {...register('sponsorKYC.gstNumber')}
              />
              <Input
                label="PAN Number"
                {...register('sponsorKYC.panNumber')}
              />
            </div>
          )}

          <DocumentUpload
            label="Registration Document"
            description="Upload organization registration certificate"
            acceptedTypes="image/*,.pdf"
            maxSize={10}
            onUploadComplete={handleDocumentUpload('registration')}
            required
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Verification'}
        </Button>
      </div>
    </form>
  );
}

