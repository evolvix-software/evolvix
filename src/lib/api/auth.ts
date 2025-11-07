/**
 * Authentication API Service
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from '@/config/api';
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  User,
  SelectRoleRequest,
} from './types';
import {
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  getIdToken,
} from '../firebase';

export const authApi = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    // Note: Firebase account should already be created before calling this
    // Get Firebase ID token
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error('No authentication token available. Please sign in first.');
    }
    
    // Create user in backend (MongoDB)
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    
    return response.data!;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Firebase handles authentication on client side
    // This endpoint syncs user data with backend
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error('No authentication token available. Please sign in first.');
    }
    
    // Sync user data with backend
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    
    return response.data!;
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    // Sign in with Firebase Google provider
    const userCredential = await firebaseSignInWithGoogle();
    
    // Get Firebase ID token
    const idToken = await userCredential.user.getIdToken();
    
    // Sync user data with backend
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.GOOGLE,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    
    return response.data!;
  },

  /**
   * Select or update user role
   */
  async selectRole(data: SelectRoleRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SELECT_ROLE, data);
    return response.data!;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data!.user;
  },

  /**
   * Verify Firebase token (no refresh needed with Firebase)
   */
  async verifyToken(): Promise<void> {
    const idToken = await getIdToken();
    if (!idToken) {
      throw new Error('No authentication token available');
    }
    
    await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {}, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Sign out from Firebase
      await firebaseSignOut();
    }
  },
};

