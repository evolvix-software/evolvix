import { createAsyncThunk } from '@reduxjs/toolkit';
import { VerificationData } from '@/data/mock/verificationData';
import { setUploadProgress } from './verificationSlice';
import { verificationApi } from '@/lib/api';

// Load verification data for current user
export const loadVerificationData = createAsyncThunk<VerificationData, string, { rejectValue: string }>(
  'verification/loadVerificationData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const storedData = localStorage.getItem('evolvix_registration');
      if (!storedData) {
        throw new Error('No registration data found');
      }
      
      const registrationData = JSON.parse(storedData);
      const role = registrationData.role;
      
      // Fetch from API
      const response = await verificationApi.getVerificationStatus(role);
      
      if (response.verifications && response.verifications.length > 0) {
        const verification = response.verifications[0];
        // Convert Verification to VerificationData format
        return {
          id: verification._id,
          userId: verification.userId,
          role: verification.role as 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor',
          verificationLevel: Math.min(verification.verificationLevel, 2) as 0 | 1 | 2, // Cap at 2 for VerificationData
          status: verification.status,
          submittedAt: verification.submittedAt,
          reviewedAt: verification.reviewedAt,
          reviewedBy: verification.reviewedBy,
          rejectionReason: verification.rejectionReason,
          personalInfo: verification.personalInfo,
          idProof: verification.idProof,
          educationInfo: verification.educationInfo,
          professionalCredentials: verification.professionalCredentials,
          experienceProof: verification.experienceProof,
          bankDetails: verification.bankDetails,
          profilePicture: verification.profilePicture,
        } as VerificationData;
      }
      
      // Return incomplete verification if none exists
      return {
        id: `ver_${Date.now()}`,
        userId,
        role,
        verificationLevel: 0,
        status: 'incomplete'
      } as VerificationData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load verification data');
    }
  }
);

// Submit verification data
export const submitVerificationData = createAsyncThunk<VerificationData, Partial<VerificationData>, { rejectValue: string }>(
  'verification/submitVerificationData',
  async (verificationData: Partial<VerificationData>, { rejectWithValue }) => {
    try {
      // Submit to API
      const response = await verificationApi.submitVerification({
        ...verificationData,
        verificationLevel: verificationData.verificationLevel || 1,
      } as any);
      
      const verification = response.verification;
      // Convert Verification to VerificationData format
      return {
        id: verification._id,
        userId: verification.userId,
        role: verification.role as 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor',
        verificationLevel: Math.min(verification.verificationLevel, 2) as 0 | 1 | 2,
        status: verification.status,
        submittedAt: verification.submittedAt,
        reviewedAt: verification.reviewedAt,
        reviewedBy: verification.reviewedBy,
        rejectionReason: verification.rejectionReason,
        personalInfo: verification.personalInfo,
        idProof: verification.idProof,
        educationInfo: verification.educationInfo,
        professionalCredentials: verification.professionalCredentials,
        experienceProof: verification.experienceProof,
        bankDetails: verification.bankDetails,
        profilePicture: verification.profilePicture,
      } as VerificationData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit verification data');
    }
  }
);

// Upload document
export const uploadDocument = createAsyncThunk(
  'verification/uploadDocument',
  async ({ file, documentType }: { file: File; documentType: string }, { rejectWithValue, dispatch }) => {
    try {
      // Simulate file upload with progress
      const fileId = `file_${Date.now()}`;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        dispatch(setUploadProgress({ fileId, progress }));
      }
      
      // Simulate successful upload
      const documentUrl = `https://example.com/documents/${fileId}`;
      
      return {
        fileId,
        documentUrl,
        documentType,
        fileName: file.name,
        fileSize: file.size
      };
    } catch (error) {
      return rejectWithValue('Failed to upload document');
    }
  }
);

// Check verification status
export const checkVerificationStatus = createAsyncThunk<
  { verificationLevel: 0 | 1 | 2; status: 'pending' | 'approved' | 'rejected' | 'incomplete' },
  string,
  { rejectValue: string }
>(
  'verification/checkVerificationStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      const storedData = localStorage.getItem('evolvix_registration');
      if (!storedData) {
        return { verificationLevel: 0, status: 'incomplete' };
      }
      
      const registrationData = JSON.parse(storedData);
      const role = registrationData.role;
      
      // Fetch from API
      const response = await verificationApi.getVerificationStatus(role);
      
      if (response.verifications && response.verifications.length > 0) {
        const verification = response.verifications[0];
        return {
          verificationLevel: (verification.verificationLevel || 0) as 0 | 1 | 2,
          status: (verification.status || 'incomplete') as 'pending' | 'approved' | 'rejected' | 'incomplete'
        };
      }
      
      return { verificationLevel: 0, status: 'incomplete' };
    } catch (error: any) {
      // Fallback to incomplete if API fails
      return { verificationLevel: 0, status: 'incomplete' };
    }
  }
);

