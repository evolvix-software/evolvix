import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, User as ApiUser } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  roles: string[];
  primaryRole: string;
  verificationLevel?: 0 | 1 | 2 | 3;
  isVerified?: boolean;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  bio?: string;
  location?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Convert API user to local user format
const mapApiUserToUser = (apiUser: ApiUser): User => ({
  id: apiUser.id || apiUser._id || '',
  email: apiUser.email,
  phone: apiUser.phone,
  fullName: apiUser.fullName,
  roles: apiUser.roles || [],
  primaryRole: apiUser.primaryRole || apiUser.roles[0] || '',
  avatar: apiUser.avatar,
  isEmailVerified: apiUser.isEmailVerified || false,
  isPhoneVerified: apiUser.isPhoneVerified || false,
  bio: apiUser.bio,
  location: apiUser.location,
});

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string } | undefined, { rejectWithValue }) => {
    try {
      // If credentials provided, sign in with Firebase first
      if (credentials) {
        const { signIn } = await import('@/lib/firebase');
        await signIn(credentials.identifier, credentials.password);
      }
      
      // Then sync with backend
      const response = await authApi.login({});
      return {
        user: mapApiUserToUser(response.user),
        survey: response.survey,
        surveys: response.surveys,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: {
    fullName: string;
    email: string;
    password: string;
    role?: 'student' | 'mentor' | 'employer' | 'investor' | 'sponsor' | 'entrepreneur';
  }, { rejectWithValue }) => {
    try {
      // Firebase handles password separately
      // First create Firebase account
      const { signUp } = await import('@/lib/firebase');
      const userCredential = await signUp(data.email, data.password, data.fullName);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Then create user in backend (without password - Firebase handles it)
      const response = await authApi.signup({
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
      
      return {
        user: mapApiUserToUser(response.user),
        emailVerificationToken: response.emailVerificationToken,
        survey: response.survey,
      };
    } catch (error: any) {
      // Handle Firebase errors
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return mapApiUserToUser(user);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user');
    }
  }
);

export const selectRole = createAsyncThunk(
  'auth/selectRole',
  async (role: string, { rejectWithValue }) => {
    try {
      const response = await authApi.selectRole({ role: role as any });
      return {
        user: mapApiUserToUser(response.user),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to select role');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Select Role
      .addCase(selectRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(selectRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(selectRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
