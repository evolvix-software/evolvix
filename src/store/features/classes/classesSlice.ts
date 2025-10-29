import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  joinedAt?: string;
  attended?: boolean;
}

export interface ClassRecording {
  id: string;
  url: string;
  duration: string;
  createdAt: string;
}

export interface ClassFeedback {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MentorClass {
  id: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  category: string;
  courseId?: string;
  courseName?: string;
  classType: 'recorded' | 'live' | 'one-to-one'; // New field
  platform?: 'zoom' | 'jitsi'; // Optional for recorded classes
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  videoUrl?: string; // For recorded classes
  enrolledStudents: EnrolledStudent[];
  status: 'upcoming' | 'live' | 'past';
  recordings: ClassRecording[];
  feedback: ClassFeedback[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface Attendance {
  classId: string;
  studentId: string;
  studentName: string;
  joinedAt?: string;
  leftAt?: string;
  duration?: number;
}

export interface ClassesState {
  classes: MentorClass[];
  currentLiveClass: string | null;
  chatMessages: ChatMessage[];
  attendance: Attendance[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  currentLiveClass: null,
  chatMessages: [],
  attendance: [],
  isLoading: false,
  error: null,
};

// Load from localStorage on initialization
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('evolvix_mentor_classes');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      initialState.classes = parsed.classes || [];
      initialState.chatMessages = parsed.chatMessages || [];
      initialState.attendance = parsed.attendance || [];
    } catch (e) {
      console.error('Failed to load classes from localStorage:', e);
    }
  }
}

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addClass: (state, action: PayloadAction<MentorClass>) => {
      state.classes.push(action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: state.classes,
          chatMessages: state.chatMessages,
          attendance: state.attendance,
        }));
      }
    },
    updateClass: (state, action: PayloadAction<Partial<MentorClass> & { id: string }>) => {
      const index = state.classes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = { ...state.classes[index], ...action.payload, updatedAt: new Date().toISOString() };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
            classes: state.classes,
            chatMessages: state.chatMessages,
            attendance: state.attendance,
          }));
        }
      }
    },
    deleteClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter(c => c.id !== action.payload);
      state.chatMessages = state.chatMessages.filter(m => m.classId !== action.payload);
      state.attendance = state.attendance.filter(a => a.classId !== action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: state.classes,
          chatMessages: state.chatMessages,
          attendance: state.attendance,
        }));
      }
    },
    enrollStudent: (state, action: PayloadAction<{ classId: string; student: EnrolledStudent }>) => {
      const classItem = state.classes.find(c => c.id === action.payload.classId);
      if (classItem) {
        if (!classItem.enrolledStudents.find(s => s.id === action.payload.student.id)) {
          classItem.enrolledStudents.push(action.payload.student);
          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
              classes: state.classes,
              chatMessages: state.chatMessages,
              attendance: state.attendance,
            }));
          }
        }
      }
    },
    setCurrentLiveClass: (state, action: PayloadAction<string | null>) => {
      state.currentLiveClass = action.payload;
    },
    updateClassStatus: (state, action: PayloadAction<{ classId: string; status: 'upcoming' | 'live' | 'past' }>) => {
      const classItem = state.classes.find(c => c.id === action.payload.classId);
      if (classItem) {
        classItem.status = action.payload.status;
        classItem.updatedAt = new Date().toISOString();
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
            classes: state.classes,
            chatMessages: state.chatMessages,
            attendance: state.attendance,
          }));
        }
      }
    },
    addRecording: (state, action: PayloadAction<{ classId: string; recording: ClassRecording }>) => {
      const classItem = state.classes.find(c => c.id === action.payload.classId);
      if (classItem) {
        classItem.recordings.push(action.payload.recording);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
            classes: state.classes,
            chatMessages: state.chatMessages,
            attendance: state.attendance,
          }));
        }
      }
    },
    addFeedback: (state, action: PayloadAction<{ classId: string; feedback: ClassFeedback }>) => {
      const classItem = state.classes.find(c => c.id === action.payload.classId);
      if (classItem) {
        classItem.feedback.push(action.payload.feedback);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
            classes: state.classes,
            chatMessages: state.chatMessages,
            attendance: state.attendance,
          }));
        }
      }
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: state.classes,
          chatMessages: state.chatMessages,
          attendance: state.attendance,
        }));
      }
    },
    updateAttendance: (state, action: PayloadAction<Attendance>) => {
      const index = state.attendance.findIndex(
        a => a.classId === action.payload.classId && a.studentId === action.payload.studentId
      );
      if (index !== -1) {
        state.attendance[index] = action.payload;
      } else {
        state.attendance.push(action.payload);
      }
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('evolvix_mentor_classes', JSON.stringify({
          classes: state.classes,
          chatMessages: state.chatMessages,
          attendance: state.attendance,
        }));
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addClass,
  updateClass,
  deleteClass,
  enrollStudent,
  setCurrentLiveClass,
  updateClassStatus,
  addRecording,
  addFeedback,
  addChatMessage,
  updateAttendance,
} = classesSlice.actions;

export default classesSlice.reducer;

