import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VerificationData, BaseVerificationData } from '@/data/mock/verificationData';
import { loadVerificationData, submitVerificationData, uploadDocument, checkVerificationStatus } from './verificationThunks';

export interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected';
  idUploaded: boolean;
  verificationDate?: string;
}

interface VerificationState {
  currentVerification: VerificationData | null;
  verificationHistory: VerificationData[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: Record<string, number>;
  verificationStatus: {
    level: 0 | 1 | 2;
    status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  } | null;
  kycStatus: KYCStatus;
}

const initialState: VerificationState = {
  currentVerification: null,
  verificationHistory: [],
  isLoading: false,
  error: null,
  uploadProgress: {},
  verificationStatus: null,
  kycStatus: {
    status: 'pending',
    idUploaded: false,
    verificationDate: undefined
  }
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentVerification: (state, action: PayloadAction<VerificationData>) => {
      state.currentVerification = action.payload;
    },
    updateVerificationLevel: (state, action: PayloadAction<{ level: 0 | 1 | 2; status: 'pending' | 'approved' | 'rejected' | 'incomplete' }>) => {
      if (state.currentVerification) {
        state.currentVerification.verificationLevel = action.payload.level;
        state.currentVerification.status = action.payload.status;
      }
    },
    setUploadProgress: (state, action: PayloadAction<{ fileId: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileId] = action.payload.progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    addVerificationHistory: (state, action: PayloadAction<VerificationData>) => {
      state.verificationHistory.unshift(action.payload);
    },
    resetVerification: (state) => {
      state.currentVerification = null;
      state.error = null;
      state.uploadProgress = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Load verification data
      .addCase(loadVerificationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadVerificationData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVerification = action.payload;
      })
      .addCase(loadVerificationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Submit verification data
      .addCase(submitVerificationData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitVerificationData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVerification = action.payload;
        state.verificationHistory.unshift(action.payload);
      })
      .addCase(submitVerificationData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        // Document uploaded successfully
        delete state.uploadProgress[action.payload.fileId];
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Check verification status
      .addCase(checkVerificationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkVerificationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationStatus = {
          level: action.payload.verificationLevel,
          status: action.payload.status
        };
      })
      .addCase(checkVerificationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setLoading,
  setError,
  setCurrentVerification,
  updateVerificationLevel,
  setUploadProgress,
  clearUploadProgress,
  addVerificationHistory,
  resetVerification
} = verificationSlice.actions;

export default verificationSlice.reducer;
