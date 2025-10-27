"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DocumentUpload } from './DocumentUpload';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';

interface StudentVerificationFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface StudentFormData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    nationality: string;
  };
  idProof: {
    type: 'passport' | 'aadhar' | 'student_id' | 'driving_license';
    number: string;
    expiryDate?: string;
  };
  educationInfo: {
    institution: string;
    course: string;
    year: string;
    studentId: string;
  };
  profilePicture?: string;
}

export function StudentVerificationForm({ onSubmit, isLoading }: StudentVerificationFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StudentFormData>();
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});

  const handleDocumentUpload = (field: string) => (url: string) => {
    setUploadedDocuments(prev => ({ ...prev, [field]: url }));
    setValue(field as any, url);
  };

  const handleFormSubmit = (data: StudentFormData) => {
    const formData = {
      ...data,
      idProof: {
        ...data.idProof,
        documentUrl: uploadedDocuments.idProof
      },
      educationInfo: {
        ...data.educationInfo,
        transcriptUrl: uploadedDocuments.transcript
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
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
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
              {errors.personalInfo?.gender && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.personalInfo.gender.message}
                </p>
              )}
            </div>
            <Input
              label="Nationality"
              {...register('personalInfo.nationality', { required: 'Nationality is required' })}
              error={errors.personalInfo?.nationality?.message}
              required
            />
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
                <option value="aadhar">Aadhaar Card</option>
                <option value="passport">Passport</option>
                <option value="student_id">Student ID</option>
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

      {/* Education Information */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Education Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Provide your current education details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Institution Name"
              {...register('educationInfo.institution', { required: 'Institution name is required' })}
              error={errors.educationInfo?.institution?.message}
              required
            />
            <Input
              label="Course/Program"
              {...register('educationInfo.course', { required: 'Course is required' })}
              error={errors.educationInfo?.course?.message}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Year of Study"
              {...register('educationInfo.year', { required: 'Year is required' })}
              error={errors.educationInfo?.year?.message}
              required
            />
            <Input
              label="Student ID"
              {...register('educationInfo.studentId', { required: 'Student ID is required' })}
              error={errors.educationInfo?.studentId?.message}
              required
            />
          </div>
          
          <DocumentUpload
            label="Academic Transcript"
            description="Upload your latest academic transcript or marksheet"
            acceptedTypes="image/*,.pdf"
            maxSize={10}
            onUploadComplete={handleDocumentUpload('transcript')}
          />
        </CardContent>
      </Card>

      {/* Profile Picture */}
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Profile Picture</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload a clear profile picture for your account
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

