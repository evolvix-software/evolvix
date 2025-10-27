import { createAsyncThunk } from '@reduxjs/toolkit';
import { VerificationData, mockVerificationData } from '@/data/mock/verificationData';
import { setUploadProgress } from './verificationSlice';

// Load verification data for current user
export const loadVerificationData = createAsyncThunk(
  'verification/loadVerificationData',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would fetch from API based on userId and role
      const storedData = localStorage.getItem('evolvix_registration');
      if (!storedData) {
        throw new Error('No registration data found');
      }
      
      const registrationData = JSON.parse(storedData);
      const role = registrationData.role;
      
      // Return mock data based on role
      const mockData = mockVerificationData[role] || {
        id: `ver_${Date.now()}`,
        userId,
        role,
        verificationLevel: 0,
        status: 'incomplete'
      };
      
      return mockData as VerificationData;
    } catch (error) {
      return rejectWithValue('Failed to load verification data');
    }
  }
);

// Submit verification data
export const submitVerificationData = createAsyncThunk(
  'verification/submitVerificationData',
  async (verificationData: Partial<VerificationData>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would submit to API
      const completeVerificationData: VerificationData = {
        ...verificationData,
        id: verificationData.id || `ver_${Date.now()}`,
        userId: verificationData.userId || 'current_user',
        role: verificationData.role || 'student',
        verificationLevel: verificationData.verificationLevel || 1,
        status: 'pending',
        submittedAt: new Date().toISOString()
      } as VerificationData;
      
      // Store in localStorage for demo
      localStorage.setItem('evolvix_verification', JSON.stringify(completeVerificationData));
      
      return completeVerificationData;
    } catch (error) {
      return rejectWithValue('Failed to submit verification data');
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
export const checkVerificationStatus = createAsyncThunk(
  'verification/checkVerificationStatus',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would check with backend
      const storedData = localStorage.getItem('evolvix_verification');
      if (!storedData) {
        return { verificationLevel: 0, status: 'incomplete' };
      }
      
      const verificationData = JSON.parse(storedData);
      return {
        verificationLevel: verificationData.verificationLevel,
        status: verificationData.status
      };
    } catch (error) {
      return rejectWithValue('Failed to check verification status');
    }
  }
);

