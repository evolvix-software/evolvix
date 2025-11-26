import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData } from '@/interfaces/providerDashboard';
import { mockDashboardData } from '@/data/mock/providerDashboardData';

export const loadProviderData = createAsyncThunk(
  'provider/loadProviderData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      return mockDashboardData as DashboardData;
    } catch (error) {
      return rejectWithValue('Failed to load provider data');
    }
  }
);

