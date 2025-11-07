/**
 * Verification API Service
 * Handles all verification-related API calls
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'incomplete';
export type VerificationRole = 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
export type VerificationLevel = 0 | 1 | 2 | 3;
export type CountryCode = 'IN' | 'US' | 'GB' | 'CA' | 'AU' | 'SG' | 'AE' | 'EU' | 'OTHER';

export interface Verification {
  _id: string;
  userId: string;
  role: VerificationRole;
  verificationLevel: VerificationLevel;
  status: VerificationStatus;
  country: CountryCode;
  emailVerified: boolean;
  
  // Student fields
  personalInfo?: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    nationality: string;
  };
  idProof?: {
    type: string;
    number: string;
    documentUrl?: string;
    expiryDate?: string;
    country: CountryCode;
  };
  educationInfo?: {
    institution: string;
    course: string;
    year: string;
    studentId: string;
    transcriptUrl?: string;
    qualification?: string;
  };
  profilePicture?: string;
  
  // Mentor fields
  professionalCredentials?: any;
  experienceProof?: any;
  bankDetails?: any;
  
  // Employer fields
  companyInfo?: any;
  companyKYC?: any;
  
  // Investor fields
  investorInfo?: any;
  taxCompliance?: any;
  investmentBankDetails?: any;
  
  // Sponsor fields
  sponsorInfo?: any;
  sponsorKYC?: any;
  
  // L3 fields
  videoVerification?: any;
  addressProof?: any;
  
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitVerificationRequest {
  role: VerificationRole;
  verificationLevel?: VerificationLevel;
  country: CountryCode;
  [key: string]: any; // Allow role-specific fields
}

export interface VerificationStatusResponse {
  verifications: Verification[];
}

export const verificationApi = {
  /**
   * Submit verification data
   */
  async submitVerification(data: SubmitVerificationRequest): Promise<{ verification: Verification }> {
    const response = await apiClient.post<{ verification: Verification }>(
      API_ENDPOINTS.VERIFICATION.SUBMIT,
      data
    );
    return response.data!;
  },

  /**
   * Get verification status for current user
   */
  async getVerificationStatus(role?: VerificationRole): Promise<VerificationStatusResponse> {
    const params = role ? `?role=${role}` : '';
    const response = await apiClient.get<VerificationStatusResponse>(
      `${API_ENDPOINTS.VERIFICATION.STATUS}${params}`
    );
    return response.data!;
  },

};
