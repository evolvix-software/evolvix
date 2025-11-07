/**
 * Password Reset API Service
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from './types';

export const passwordApi = {
  /**
   * Request password reset token
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data!;
  },

  /**
   * Reset password using token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to reset password');
    }
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to change password');
    }
  },
};

