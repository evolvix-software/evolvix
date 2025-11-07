/**
 * API Types and Interfaces
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface SignupRequest {
  fullName: string;
  email: string;
  role?: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
}

export interface LoginRequest {
  // Empty - Firebase handles authentication on client side
}

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  roles: string[];
  primaryRole: string;
  avatar?: string;
  bio?: string;
  location?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  emailVerificationToken?: string; // Only in signup response
  survey?: SurveyStatus;
  surveys?: Record<string, SurveyStatus>;
}

export interface RefreshTokenRequest {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SelectRoleRequest {
  role: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
}

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string; // Only in development
  resetUrl?: string; // Only in development
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Survey Types
export type SurveyQuestionType = 'single' | 'multiple' | 'text';

export interface SurveyQuestion {
  id: string;
  question: string;
  type: SurveyQuestionType;
  options?: string[];
  required: boolean;
}

export interface SurveyStatus {
  role: string;
  completed: boolean;
  completedAt?: string | null;
  hasStarted?: boolean;
  progress?: number;
  answersCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string | string[]; // string for single/text, string[] for multiple
}

export interface SaveAnswerRequest {
  role: string;
  questionId: string;
  answer: string | string[];
}

export interface SubmitSurveyRequest {
  role: string;
  answers: SurveyAnswer[];
}

export interface SurveyResponse {
  role: string;
  answers: SurveyAnswer[];
  completed: boolean;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

