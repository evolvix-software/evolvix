import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  mockStats, 
  mockFeaturedCourses, 
  mockUpcomingEvents, 
  mockQuickActions, 
  mockRecentActivity 
} from '@/data/mock/studentData';

export const loadStudentData = createAsyncThunk(
  'student/loadStudentData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      return {
        stats: mockStats,
        featuredCourses: mockFeaturedCourses,
        upcomingEvents: mockUpcomingEvents,
        quickActions: mockQuickActions,
        recentActivity: mockRecentActivity
      };
    } catch (error) {
      return rejectWithValue('Failed to load student data');
    }
  }
);

