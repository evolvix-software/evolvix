"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';

interface MentorVerificationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface MentorFormData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
  };
  professionalInfo: {
    currentPosition: string;
    company: string;
    experience: number;
    specialization: string[];
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  educationInfo: {
    degree: string;
    institution: string;
    graduationYear: string;
    certifications: string[];
  };
  idProof: {
    type: 'passport' | 'aadhar' | 'driving_license';
    number: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  profilePicture?: string;
}

export function MentorVerificationForm({ onSubmit, isLoading }: MentorVerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MentorFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleDocumentUpload = (field: string) => (url: string) => {
    setUploadedDocuments(prev => ({ ...prev, [field]: url }));
    setValue(field as any, url);
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      const updated = [...specializations, newSpecialization.trim()];
      setSpecializations(updated);
      setValue('professionalInfo.specialization', updated);
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    const updated = specializations.filter((_, i) => i !== index);
    setSpecializations(updated);
    setValue('professionalInfo.specialization', updated);
  };

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      const updated = [...certifications, newCertification.trim()];
      setCertifications(updated);
      setValue('educationInfo.certifications', updated);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index);
    setCertifications(updated);
    setValue('educationInfo.certifications', updated);
  };

  const handleFormSubmit = (data: MentorFormData) => {
    const formData = {
      ...data,
      professionalInfo: {
        ...data.professionalInfo,
        specialization: specializations
      },
      educationInfo: {
        ...data.educationInfo,
        certifications
      },
      idProof: {
        ...data.idProof,
        documentUrl: uploadedDocuments.idProof
      },
      profilePicture: uploadedDocuments.profilePicture
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your basic personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Full Name"
              {...register('personalInfo.fullName', { required: 'Full name is required' })}
              error={errors.personalInfo?.fullName?.message}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              {...register('personalInfo.dateOfBirth', { required: 'Date of birth is required' })}
              error={errors.personalInfo?.dateOfBirth?.message}
              required
            />
            <Input
              label="Nationality"
              {...register('personalInfo.nationality', { required: 'Nationality is required' })}
              error={errors.personalInfo?.nationality?.message}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Professional Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Share your professional background and expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Current Position"
              {...register('professionalInfo.currentPosition', { required: 'Current position is required' })}
              error={errors.professionalInfo?.currentPosition?.message}
              required
            />
            <Input
              label="Company"
              {...register('professionalInfo.company', { required: 'Company is required' })}
              error={errors.professionalInfo?.company?.message}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Years of Experience"
              type="number"
              {...register('professionalInfo.experience', { 
                required: 'Experience is required',
                min: { value: 1, message: 'Must have at least 1 year of experience' }
              })}
              error={errors.professionalInfo?.experience?.message}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Specializations <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  placeholder="Add specialization"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <Button type="button" onClick={addSpecialization} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-full text-sm"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="LinkedIn Profile"
              {...register('professionalInfo.linkedinUrl')}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <Input
              label="Portfolio Website"
              {...register('professionalInfo.portfolioUrl')}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Education Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Education & Certifications</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your educational background and certifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Highest Degree"
              {...register('educationInfo.degree', { required: 'Degree is required' })}
              error={errors.educationInfo?.degree?.message}
              required
            />
            <Input
              label="Institution"
              {...register('educationInfo.institution', { required: 'Institution is required' })}
              error={errors.educationInfo?.institution?.message}
              required
            />
            <Input
              label="Graduation Year"
              {...register('educationInfo.graduationYear', { required: 'Graduation year is required' })}
              error={errors.educationInfo?.graduationYear?.message}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Professional Certifications
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Button type="button" onClick={addCertification} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ID Proof */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Identity Verification</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload a valid government-issued ID
          </CardDescription>
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
                <option value="passport">Passport</option>
                <option value="aadhar">Aadhaar Card</option>
                <option value="driving_license">Driving License</option>
              </select>
              {errors.idProof?.type && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.idProof.type.message}
                </p>
              )}
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

      {/* Bank Details */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Bank Details</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your bank account details for payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Account Holder Name"
              {...register('bankDetails.accountHolderName', { required: 'Account holder name is required' })}
              error={errors.bankDetails?.accountHolderName?.message}
              required
            />
            <Input
              label="Account Number"
              {...register('bankDetails.accountNumber', { required: 'Account number is required' })}
              error={errors.bankDetails?.accountNumber?.message}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              {...register('bankDetails.bankName', { required: 'Bank name is required' })}
              error={errors.bankDetails?.bankName?.message}
              required
            />
            <Input
              label="IFSC Code"
              {...register('bankDetails.ifscCode', { required: 'IFSC code is required' })}
              error={errors.bankDetails?.ifscCode?.message}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Picture */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Profile Picture</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload a professional profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUpload
            label="Profile Picture"
            description="Upload a clear, professional photo of yourself"
            acceptedTypes="image/*"
            maxSize={5}
            onUploadComplete={handleDocumentUpload('profilePicture')}
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



