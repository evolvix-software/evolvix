"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { CountryCode } from '@/lib/api/verification';

interface InvestorVerificationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface InvestorFormData {
  country: CountryCode;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
  };
  idProof: {
    type: string;
    number: string;
  };
  investorInfo: {
    investmentPreferences: string[];
    trackRecord?: string;
    portfolioCompanies?: string[];
    investmentAmountRange?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  taxCompliance: {
    panNumber?: string;
    w9FormUrl?: string;
    w8benFormUrl?: string;
    tinNumber?: string;
    vatNumber?: string;
  };
  investmentBankDetails: {
    accountNumber: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
    ifscCode?: string;
    bankName: string;
    accountHolderName: string;
  };
}

export function InvestorVerificationForm({ onSubmit, isLoading }: InvestorVerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<InvestorFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [investmentPreferences, setInvestmentPreferences] = useState<string[]>([]);
  const [portfolioCompanies, setPortfolioCompanies] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const selectedCountry = watch('country') as CountryCode || 'IN';

  const handleDocumentUpload = (field: string) => (url: string) => {
    setUploadedDocuments(prev => ({ ...prev, [field]: url }));
    setValue(field as any, url);
  };

  const addPreference = () => {
    if (newPreference.trim() && !investmentPreferences.includes(newPreference.trim())) {
      const updated = [...investmentPreferences, newPreference.trim()];
      setInvestmentPreferences(updated);
      setValue('investorInfo.investmentPreferences', updated);
      setNewPreference('');
    }
  };

  const addCompany = () => {
    if (newCompany.trim() && !portfolioCompanies.includes(newCompany.trim())) {
      const updated = [...portfolioCompanies, newCompany.trim()];
      setPortfolioCompanies(updated);
      setValue('investorInfo.portfolioCompanies', updated);
      setNewCompany('');
    }
  };

  const handleFormSubmit = (data: InvestorFormData) => {
    const formData = {
      ...data,
      idProof: {
        ...data.idProof,
        documentUrl: uploadedDocuments.idProof,
        country: data.country,
      },
      investorInfo: {
        ...data.investorInfo,
        investmentPreferences,
        portfolioCompanies,
      },
      taxCompliance: {
        ...data.taxCompliance,
        country: data.country,
      },
      investmentBankDetails: {
        ...data.investmentBankDetails,
        country: data.country,
      },
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('personalInfo.fullName', { required: 'Full name is required' })}
              error={errors.personalInfo?.fullName?.message}
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
              label="Date of Birth"
              type="date"
              {...register('personalInfo.dateOfBirth', { required: 'Date of birth is required' })}
              error={errors.personalInfo?.dateOfBirth?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register('personalInfo.gender', { required: 'Gender is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Proof */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Identity Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('idProof.type', { required: 'ID type is required' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select ID Type</option>
                {selectedCountry === 'IN' && (
                  <>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="passport">Passport</option>
                  </>
                )}
                {selectedCountry === 'US' && (
                  <>
                    <option value="us_passport">US Passport</option>
                    <option value="us_driving_license">US Driving License</option>
                  </>
                )}
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <Input
              label="ID Number"
              {...register('idProof.number', { required: 'ID number is required' })}
              error={errors.idProof?.number?.message}
              required
            />
          </div>

          <DocumentUpload
            label="ID Document"
            description="Upload a clear photo or scan of your ID document"
            acceptedTypes="image/*,.pdf"
            maxSize={5}
            onUploadComplete={handleDocumentUpload('idProof')}
            required
          />
        </CardContent>
      </Card>

      {/* Investment Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Investment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Investment Preferences <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="e.g., SaaS, FinTech, Healthcare"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Button type="button" onClick={addPreference} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {investmentPreferences.map((pref, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-full text-sm"
                >
                  {pref}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = investmentPreferences.filter((_, i) => i !== index);
                      setInvestmentPreferences(updated);
                      setValue('investorInfo.investmentPreferences', updated);
                    }}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Track Record
            </label>
            <textarea
              {...register('investorInfo.trackRecord')}
              placeholder="Describe your investment experience and track record"
              rows={4}
              className="flex h-auto w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Portfolio Companies
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Company name"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Button type="button" onClick={addCompany} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {portfolioCompanies.map((company, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                >
                  {company}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = portfolioCompanies.filter((_, i) => i !== index);
                      setPortfolioCompanies(updated);
                      setValue('investorInfo.portfolioCompanies', updated);
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Min Investment Amount"
              type="number"
              {...register('investorInfo.investmentAmountRange.min', { valueAsNumber: true })}
            />
            <Input
              label="Max Investment Amount"
              type="number"
              {...register('investorInfo.investmentAmountRange.max', { valueAsNumber: true })}
            />
            <Input
              label="Currency"
              {...register('investorInfo.investmentAmountRange.currency')}
              placeholder="USD, INR, etc."
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Compliance */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Tax Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCountry === 'IN' && (
            <Input
              label="PAN Number"
              {...register('taxCompliance.panNumber')}
            />
          )}
          {selectedCountry === 'US' && (
            <>
              <DocumentUpload
                label="W-9 Form"
                description="Upload W-9 form for US tax compliance"
                acceptedTypes="image/*,.pdf"
                maxSize={5}
                onUploadComplete={handleDocumentUpload('w9Form')}
              />
              <DocumentUpload
                label="W-8BEN Form"
                description="Upload W-8BEN form if applicable"
                acceptedTypes="image/*,.pdf"
                maxSize={5}
                onUploadComplete={handleDocumentUpload('w8benForm')}
              />
            </>
          )}
          {(selectedCountry === 'GB' || selectedCountry === 'EU') && (
            <>
              <Input
                label="TIN Number"
                {...register('taxCompliance.tinNumber')}
              />
              <Input
                label="VAT Number"
                {...register('taxCompliance.vatNumber')}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Investment Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Account Holder Name"
              {...register('investmentBankDetails.accountHolderName', { required: 'Account holder name is required' })}
              error={errors.investmentBankDetails?.accountHolderName?.message}
              required
            />
            <Input
              label="Account Number"
              {...register('investmentBankDetails.accountNumber', { required: 'Account number is required' })}
              error={errors.investmentBankDetails?.accountNumber?.message}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              {...register('investmentBankDetails.bankName', { required: 'Bank name is required' })}
              error={errors.investmentBankDetails?.bankName?.message}
              required
            />
            {selectedCountry === 'IN' && (
              <Input
                label="IFSC Code"
                {...register('investmentBankDetails.ifscCode')}
              />
            )}
            {selectedCountry === 'US' && (
              <Input
                label="Routing Number"
                {...register('investmentBankDetails.routingNumber')}
              />
            )}
            {(selectedCountry === 'GB' || selectedCountry === 'EU') && (
              <>
                <Input
                  label="IBAN"
                  {...register('investmentBankDetails.iban')}
                />
                <Input
                  label="SWIFT Code"
                  {...register('investmentBankDetails.swiftCode')}
                />
              </>
            )}
          </div>
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

