/**
 * Admin API Service
 */

import { adminApiClient } from './adminClient';
import { API_ENDPOINTS } from '@/config/api';
import { ApiResponse } from './types';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  token: string;
  isAdmin: boolean;
}

export interface AdminUser {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  roles: string[];
  primaryRole?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  isSuspended: boolean;
  bannedAt?: string;
  suspendedAt?: string;
  banReason?: string;
  suspendReason?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  usersByRole: Record<string, number>;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UpdateUserStatusRequest {
  reason?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password?: string;
  roles?: string[];
  primaryRole?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  password?: string;
  roles?: string[];
  primaryRole?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export interface VerificationData {
  _id: string;
  id?: string;
  userId: string | { _id: string; fullName: string; email: string; roles: string[]; primaryRole?: string; avatar?: string };
  role: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
  verificationLevel: 0 | 1 | 2;
  status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  personalInfo?: any;
  idProof?: any;
  educationInfo?: any;
  professionalCredentials?: any;
  experienceProof?: any;
  bankDetails?: any;
  profilePicture?: string;
  additionalDocuments?: any[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string | { _id: string; fullName: string; email: string };
  rejectionReason?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationsResponse {
  verifications: VerificationData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApproveVerificationRequest {
  adminNotes?: string;
}

export interface RejectVerificationRequest {
  rejectionReason: string;
  adminNotes?: string;
}

export const adminApi = {
  /**
   * Admin login (email/password only)
   */
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const response = await adminApiClient.post<AdminLoginResponse>(API_ENDPOINTS.ADMIN.LOGIN, {
      email,
      password,
    });
    const data = response.data!;
    // Store token in admin client
    adminApiClient.setToken(data.token);
    return data;
  },

  /**
   * Verify admin token
   */
  async verifyToken(): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(API_ENDPOINTS.ADMIN.VERIFY);
    return response.data!.user;
  },

  /**
   * Logout admin
   */
  logout(): void {
    adminApiClient.clearToken();
  },

  /**
   * Get admin dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    const response = await adminApiClient.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS);
    return response.data!;
  },

  /**
   * Get all users with pagination and filters
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    isEmailVerified?: boolean;
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.isEmailVerified !== undefined) queryParams.append('isEmailVerified', params.isEmailVerified.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.USERS}?${queryString}` : API_ENDPOINTS.ADMIN.USERS;

    const response = await adminApiClient.get<UsersResponse>(endpoint);
    return response.data!;
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserRequest): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(API_ENDPOINTS.ADMIN.USERS, data);
    return response.data!.user;
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<AdminUser> {
    const response = await adminApiClient.get<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
    return response.data!.user;
  },

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<AdminUser> {
    const response = await adminApiClient.put<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, data);
    return response.data!.user;
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    await adminApiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  /**
   * Ban user
   */
  async banUser(id: string, reason?: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/ban`, { reason });
    return response.data!.user;
  },

  /**
   * Unban user
   */
  async unbanUser(id: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/unban`);
    return response.data!.user;
  },

  /**
   * Suspend user
   */
  async suspendUser(id: string, reason?: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/suspend`, { reason });
    return response.data!.user;
  },

  /**
   * Unsuspend user
   */
  async unsuspendUser(id: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/unsuspend`);
    return response.data!.user;
  },

  /**
   * Activate user
   */
  async activateUser(id: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/activate`);
    return response.data!.user;
  },

  /**
   * Deactivate user
   */
  async deactivateUser(id: string): Promise<AdminUser> {
    const response = await adminApiClient.post<{ user: AdminUser }>(`${API_ENDPOINTS.ADMIN.USERS}/${id}/deactivate`);
    return response.data!.user;
  },

  /**
   * Get all verifications
   */
  async getVerifications(params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected' | 'incomplete';
    role?: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
  }): Promise<VerificationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADMIN.VERIFICATIONS}?${queryString}` : API_ENDPOINTS.ADMIN.VERIFICATIONS;

    const response = await adminApiClient.get<VerificationsResponse>(endpoint);
    return response.data!;
  },

  /**
   * Get verification by ID
   */
  async getVerificationById(id: string): Promise<VerificationData> {
    const response = await adminApiClient.get<{ verification: VerificationData }>(`${API_ENDPOINTS.ADMIN.VERIFICATIONS}/${id}`);
    return response.data!.verification;
  },

  /**
   * Approve verification
   */
  async approveVerification(id: string, data?: ApproveVerificationRequest): Promise<VerificationData> {
    const response = await adminApiClient.post<{ verification: VerificationData }>(`${API_ENDPOINTS.ADMIN.VERIFICATIONS}/${id}/approve`, data);
    return response.data!.verification;
  },

  /**
   * Reject verification
   */
  async rejectVerification(id: string, data: RejectVerificationRequest): Promise<VerificationData> {
    const response = await adminApiClient.post<{ verification: VerificationData }>(`${API_ENDPOINTS.ADMIN.VERIFICATIONS}/${id}/reject`, data);
    return response.data!.verification;
  },
};

