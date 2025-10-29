import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

export interface EducationInfo {
  college: string;
  degree: string;
  year: string;
  specialization: string;
  additionalEducation?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Interest {
  id: string;
  name: string;
  category: 'technology' | 'business' | 'creative' | 'academic';
}

export interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected';
  idUploaded: boolean;
  verificationDate?: string;
}

export interface NotificationSettings {
  courseUpdates?: boolean;
  assignmentDeadlines?: boolean;
  mentorMessages?: boolean;
  jobAlerts?: boolean;
  achievements?: boolean;
  // Mentor-specific notifications
  studentMessages?: boolean;
  bookingAlerts?: boolean;
  paymentUpdates?: boolean;
  systemAlerts?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'other';
  last4: string;
  expiry: string;
  cardholder: string;
  isDefault: boolean;
}

export interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dashboardLayout: 'minimal' | 'detailed' | 'compact';
  defaultHomePage: 'dashboard' | 'courses' | 'progress' | 'assignments';
  // Mentor-specific preferences
  defaultDashboardTab?: 'classes' | 'messages' | 'earnings';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'limited';
  dataSharing: boolean;
  // Mentor-specific privacy settings
  reviewsVisibility?: boolean;
}

export interface ProfileState {
  personalInfo: PersonalInfo;
  educationInfo: EducationInfo;
  skills: Skill[];
  interests: Interest[];
  kycStatus: KYCStatus;
  profilePicture: string | null;
  isLoading: boolean;
  error: string | null;
  isEditing: {
    personalInfo: boolean;
    educationInfo: boolean;
    skills: boolean;
    interests: boolean;
  };
  notifications: NotificationSettings;
  paymentMethods: PaymentMethod[];
  preferences: Preferences;
  privacySettings: PrivacySettings;
  twoFactorAuth: boolean;
}

const initialState: ProfileState = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-15',
    gender: 'Male',
    phone: '+919876543210',
    email: 'john.doe@example.com',
  },
  educationInfo: {
    college: 'University of Technology',
    degree: 'B.Tech',
    year: '2022',
    specialization: 'Computer Science',
    additionalEducation: [],
  },
  skills: [
    { id: '1', name: 'React', level: 'advanced' },
    { id: '2', name: 'Node.js', level: 'intermediate' },
    { id: '3', name: 'TypeScript', level: 'intermediate' },
  ],
  interests: [
    { id: '1', name: 'AI & Machine Learning', category: 'technology' },
    { id: '2', name: 'Web Development', category: 'technology' },
  ],
  kycStatus: {
    status: 'verified',
    idUploaded: true,
    verificationDate: '2024-01-15',
  },
  profilePicture: null,
  isLoading: false,
  error: null,
  isEditing: {
    personalInfo: false,
    educationInfo: false,
    skills: false,
    interests: false,
  },
  notifications: {
    courseUpdates: true,
    assignmentDeadlines: true,
    mentorMessages: true,
    jobAlerts: true,
    achievements: true,
  },
  paymentMethods: [
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      cardholder: 'John Doe',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '5555',
      expiry: '08/26',
      cardholder: 'John Doe',
      isDefault: false,
    },
  ],
  preferences: {
    theme: 'light',
    language: 'English',
    dashboardLayout: 'detailed',
    defaultHomePage: 'dashboard',
  },
  privacySettings: {
    profileVisibility: 'public',
    dataSharing: false,
  },
  twoFactorAuth: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    loadProfileData(state, action: PayloadAction<Partial<ProfileState>>) {
      return { ...state, ...action.payload };
    },
    updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateEducationInfo(state, action: PayloadAction<Partial<EducationInfo>>) {
      state.educationInfo = { ...state.educationInfo, ...action.payload };
    },
    addSkill(state, action: PayloadAction<Skill>) {
      state.skills.push(action.payload);
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
    },
    updateSkill(state, action: PayloadAction<Skill>) {
      const index = state.skills.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = action.payload;
      }
    },
    addInterest(state, action: PayloadAction<Interest>) {
      state.interests.push(action.payload);
    },
    removeInterest(state, action: PayloadAction<string>) {
      state.interests = state.interests.filter(interest => interest.id !== action.payload);
    },
    updateKYCStatus(state, action: PayloadAction<Partial<KYCStatus>>) {
      state.kycStatus = { ...state.kycStatus, ...action.payload };
    },
    setProfilePicture(state, action: PayloadAction<string>) {
      state.profilePicture = action.payload;
    },
    setEditingField(state, action: PayloadAction<{ field: keyof ProfileState['isEditing']; value: boolean }>) {
      state.isEditing[action.payload.field] = action.payload.value;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    updateNotifications(state, action: PayloadAction<Partial<NotificationSettings>>) {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    addPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethods.push(action.payload);
    },
    removePaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload);
    },
    setDefaultPaymentMethod(state, action: PayloadAction<string>) {
      state.paymentMethods = state.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === action.payload
      }));
    },
    updatePreferences(state, action: PayloadAction<Partial<Preferences>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updatePrivacySettings(state, action: PayloadAction<Partial<PrivacySettings>>) {
      state.privacySettings = { ...state.privacySettings, ...action.payload };
    },
    setTwoFactorAuth(state, action: PayloadAction<boolean>) {
      state.twoFactorAuth = action.payload;
    },
  },
});

export const {
  loadProfileData,
  updatePersonalInfo,
  updateEducationInfo,
  addSkill,
  removeSkill,
  updateSkill,
  addInterest,
  removeInterest,
  updateKYCStatus,
  setProfilePicture,
  setEditingField,
  setLoading,
  setError,
  updateNotifications,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  updatePreferences,
  updatePrivacySettings,
  setTwoFactorAuth,
} = profileSlice.actions;

export default profileSlice.reducer;

