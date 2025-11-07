"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { CountryCode } from '@/lib/api/verification';

interface EmployerVerificationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface EmployerFormData {
  country: CountryCode;
  companyInfo: {
    companyName: string;
    industry: string;
    authorizedRepresentative: {
      name: string;
      designation: string;
      email: string;
    };
    phoneNumber: string;
    companyEmail: string;
    website?: string;
    linkedinCompanyPage?: string;
  };
  companyKYC: {
    registrationNumber: string;
    documentType: 'gst' | 'cin' | 'pan_business' | 'ein' | 'vat' | 'companies_house' | 'business_registration' | 'trade_license' | 'other';
    gstNumber?: string;
    panNumber?: string;
    cinNumber?: string;
    einNumber?: string;
    vatNumber?: string;
    companiesHouseNumber?: string;
    businessRegistrationNumber?: string;
    tradeLicenseNumber?: string;
  };
}

const countryDocumentTypes: Record<CountryCode, string[]> = {
  IN: ['gst', 'cin', 'pan_business'],
  US: ['ein'],
  GB: ['vat', 'companies_house'],
  CA: ['business_registration'],
  AU: ['business_registration'],
  SG: ['business_registration'],
  AE: ['trade_license'],
  EU: ['vat'],
  OTHER: ['business_registration', 'other'],
};

export function EmployerVerificationForm({ onSubmit, isLoading }: EmployerVerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<EmployerFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const selectedCountry = watch('country') as CountryCode || 'IN';

  const handleDocumentUpload = (field: string) => (url: string) => {
    setUploadedDocuments(prev => ({ ...prev, [field]: url }));
    setValue(field as any, url);
  };

  const handleFormSubmit = (data: EmployerFormData) => {
    const formData = {
      ...data,
      companyKYC: {
        ...data.companyKYC,
        registrationDocumentUrl: uploadedDocuments.registration,
        country: data.country,
      },
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Company Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Company Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your company details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              {...register('companyInfo.companyName', { required: 'Company name is required' })}
              error={errors.companyInfo?.companyName?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                {...register('country', { required: 'Country is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              label="Industry"
              {...register('companyInfo.industry', { required: 'Industry is required' })}
              error={errors.companyInfo?.industry?.message}
              required
            />
            <Input
              label="Company Email"
              type="email"
              {...register('companyInfo.companyEmail', { 
                required: 'Company email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              error={errors.companyInfo?.companyEmail?.message}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              {...register('companyInfo.phoneNumber', { required: 'Phone number is required' })}
              error={errors.companyInfo?.phoneNumber?.message}
              required
            />
            <Input
              label="Website"
              {...register('companyInfo.website')}
              placeholder="https://example.com"
            />
          </div>

          <Input
            label="LinkedIn Company Page"
            {...register('companyInfo.linkedinCompanyPage')}
            placeholder="https://linkedin.com/company/example"
          />
        </CardContent>
      </Card>

      {/* Authorized Representative */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Authorized Representative</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Details of the authorized person representing the company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('companyInfo.authorizedRepresentative.name', { required: 'Name is required' })}
              error={errors.companyInfo?.authorizedRepresentative?.name?.message}
              required
            />
            <Input
              label="Designation"
              {...register('companyInfo.authorizedRepresentative.designation', { required: 'Designation is required' })}
              error={errors.companyInfo?.authorizedRepresentative?.designation?.message}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            {...register('companyInfo.authorizedRepresentative.email', { 
              required: 'Email is required',
              validate: (value) => {
                const companyEmail = watch('companyInfo.companyEmail');
                if (companyEmail && !value.endsWith(companyEmail.split('@')[1])) {
                  return 'Email must match company domain';
                }
                return true;
              }
            })}
            error={errors.companyInfo?.authorizedRepresentative?.email?.message}
            required
          />
        </CardContent>
      </Card>

      {/* Company KYC Documents */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Company KYC Documents</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload company registration and tax documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register('companyKYC.documentType', { required: 'Document type is required' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {countryDocumentTypes[selectedCountry]?.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Registration Number"
            {...register('companyKYC.registrationNumber', { required: 'Registration number is required' })}
            error={errors.companyKYC?.registrationNumber?.message}
            required
          />

          {selectedCountry === 'IN' && (
            <>
              <Input
                label="GST Number"
                {...register('companyKYC.gstNumber')}
              />
              <Input
                label="PAN Number"
                {...register('companyKYC.panNumber')}
              />
              <Input
                label="CIN Number"
                {...register('companyKYC.cinNumber')}
              />
            </>
          )}

          {selectedCountry === 'US' && (
            <Input
              label="EIN Number"
              {...register('companyKYC.einNumber')}
            />
          )}

          {selectedCountry === 'GB' && (
            <>
              <Input
                label="VAT Number"
                {...register('companyKYC.vatNumber')}
              />
              <Input
                label="Companies House Number"
                {...register('companyKYC.companiesHouseNumber')}
              />
            </>
          )}

          <DocumentUpload
            label="Registration Document"
            description="Upload company registration certificate"
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

