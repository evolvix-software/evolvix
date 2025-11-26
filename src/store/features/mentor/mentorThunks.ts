import { createAsyncThunk } from '@reduxjs/toolkit';
import { MentorStats, Notification, UpcomingSession } from './mentorSlice';

const defaultStats: MentorStats = {
  totalClasses: 0,
  totalStudents: 0,
  activeStudents: 0,
  averageRating: 0,
  pendingReviews: 0,
  pendingPayments: 0,
  totalRevenue: {
    thisMonth: 0,
    thisYear: 0,
    allTime: 0,
  },
  upcomingClasses: 0,
  pendingGrading: 0,
  completionRate: 0,
  responseTime: 0,
  retentionRate: 0,
};

const verifiedStats: MentorStats = {
  totalClasses: 156,
  totalStudents: 24,
  activeStudents: 18,
  averageRating: 4.9,
  pendingReviews: 5,
  pendingPayments: 2340,
  totalRevenue: {
    thisMonth: 12500,
    thisYear: 145000,
    allTime: 425000,
  },
  upcomingClasses: 7,
  pendingGrading: 12,
  completionRate: 78,
  responseTime: 2.5,
  retentionRate: 85,
};

const defaultNotifications: Notification[] = [];

const verifiedNotifications: Notification[] = [
  {
    id: '1',
    type: 'enrollment',
    title: 'New student enrollment',
    description: 'Michael Brown enrolled in Live Full-Stack Web Development Bootcamp',
    time: '30 minutes ago',
  },
  {
    id: '2',
    type: 'assignment_submission',
    title: 'Assignment submitted',
    description: 'Alex Johnson submitted "Personal Portfolio Page" assignment',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'test_completion',
    title: 'Test completed',
    description: 'Sarah Chen completed "JavaScript Fundamentals" test',
    time: '2 hours ago',
  },
  {
    id: '4',
    type: 'message',
    title: 'Message requires response',
    description: 'David Wilson sent a message about project requirements',
    time: '3 hours ago',
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment notification',
    description: 'Your payout for last week has been processed ($2,340)',
    time: '1 day ago',
  },
  {
    id: '6',
    type: 'announcement',
    title: 'System announcement',
    description: 'New feature: Enhanced grading system now available',
    time: '2 days ago',
  },
];

const defaultSessions: UpcomingSession[] = [];

const verifiedSessions: UpcomingSession[] = [
  {
    id: '1',
    title: 'React Development',
    student: 'Alex Johnson',
    date: 'Today',
    time: '3:00 PM',
  },
  {
    id: '2',
    title: 'Career Guidance',
    student: 'Sarah Chen',
    date: 'Tomorrow',
    time: '2:00 PM',
  },
];

export const loadMentorData = createAsyncThunk(
  'mentor/loadMentorData',
  async (isVerified: boolean, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      return {
        stats: isVerified ? verifiedStats : defaultStats,
        notifications: isVerified ? verifiedNotifications : defaultNotifications,
        upcomingSessions: isVerified ? verifiedSessions : defaultSessions,
      };
    } catch (error) {
      return rejectWithValue('Failed to load mentor data');
    }
  }
);

