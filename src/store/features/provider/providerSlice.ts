import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadProviderData } from './providerThunks';
import { DashboardData, ImpactMetrics, FundStatus, ScholarHealth } from '@/interfaces/providerDashboard';

interface ProviderState {
  dashboardData: DashboardData | null;
  impactMetrics: ImpactMetrics | null;
  fundStatus: FundStatus | null;
  scholarHealth: ScholarHealth | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  dashboardData: null,
  impactMetrics: null,
  fundStatus: null,
  scholarHealth: null,
  isLoading: false,
  error: null,
};

const providerSlice = createSlice({
  name: 'provider',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<DashboardData>) => {
      state.dashboardData = action.payload;
      state.impactMetrics = action.payload.impactMetrics;
      state.fundStatus = action.payload.fundStatus;
      state.scholarHealth = action.payload.scholarHealth;
    },
    setImpactMetrics: (state, action: PayloadAction<ImpactMetrics>) => {
      state.impactMetrics = action.payload;
      if (state.dashboardData) {
        state.dashboardData.impactMetrics = action.payload;
      }
    },
    setFundStatus: (state, action: PayloadAction<FundStatus>) => {
      state.fundStatus = action.payload;
      if (state.dashboardData) {
        state.dashboardData.fundStatus = action.payload;
      }
    },
    setScholarHealth: (state, action: PayloadAction<ScholarHealth>) => {
      state.scholarHealth = action.payload;
      if (state.dashboardData) {
        state.dashboardData.scholarHealth = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProviderData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadProviderData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.impactMetrics = action.payload.impactMetrics;
        state.fundStatus = action.payload.fundStatus;
        state.scholarHealth = action.payload.scholarHealth;
      })
      .addCase(loadProviderData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setDashboardData,
  setImpactMetrics,
  setFundStatus,
  setScholarHealth,
} = providerSlice.actions;

export default providerSlice.reducer;

