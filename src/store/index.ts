import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import studentReducer from './features/student/studentSlice';
import verificationReducer from './features/verification/verificationSlice';
import profileReducer from './features/profile/profileSlice';
import coursesReducer from './features/courses/coursesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    verification: verificationReducer,
    profile: profileReducer,
    courses: coursesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
