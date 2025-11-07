import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClassNotification {
  id: string;
  type: 'class_scheduled' | 'class_starting' | 'class_link';
  classId: string;
  courseId: string;
  courseName: string;
  classTopic: string;
  meetingLink?: string;
  meetingId?: string;
  date: string;
  time: string;
  duration: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsState {
  notifications: ClassNotification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

// Load from localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('evolvix_student_notifications');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      initialState.notifications = parsed || [];
    } catch (e) {
      console.error('Failed to load notifications from localStorage:', e);
    }
  }
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<ClassNotification>) {
      state.notifications.unshift(action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_student_notifications', JSON.stringify(state.notifications));
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_student_notifications', JSON.stringify(state.notifications));
        }
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach(n => n.read = true);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_student_notifications', JSON.stringify(state.notifications));
      }
    },
    deleteNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_student_notifications', JSON.stringify(state.notifications));
      }
    },
    clearAllNotifications(state) {
      state.notifications = [];
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_student_notifications', JSON.stringify([]));
      }
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

