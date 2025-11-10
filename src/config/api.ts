/**
 * API Configuration
 * Base URL and configuration for API requests
 * 
 * Security Note: Never hardcode production URLs in code.
 * Always use environment variables for configuration.
 */

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // Always check for environment variable first
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // In production, environment variable is required
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.error(
      '⚠️  NEXT_PUBLIC_API_BASE_URL is not set in production environment. ' +
      'Please set this environment variable in your deployment platform.'
    );
    throw new Error(
      'API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL environment variable.'
    );
  }
  
  // Default to localhost only for local development
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    SELECT_ROLE: '/auth/select-role',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  // Survey
  SURVEY: {
    QUESTIONS: '/survey/questions',
    STATUS: '/survey/status',
    MY_SURVEYS: '/survey/my-surveys',
    SURVEY_BY_ROLE: '/survey',
    SAVE_ANSWER: '/survey/save-answer',
    SUBMIT: '/survey/submit',
  },
  // Admin
  ADMIN: {
    LOGIN: '/admin/login',
    VERIFY: '/admin/verify',
    STATS: '/admin/stats',
    USERS: '/admin/users',
    VERIFICATIONS: '/admin/verifications',
  },
  // Verification
  VERIFICATION: {
    SUBMIT: '/verification/submit',
    STATUS: '/verification/status',
  },
} as const;

