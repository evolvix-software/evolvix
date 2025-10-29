import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

export interface SurveyState {
  [role: string]: {
    answers: SurveyAnswer[];
    completed: boolean;
    completedAt?: string;
  };
}

const initialState: SurveyState = {};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    saveAnswer: (
      state,
      action: PayloadAction<{ role: string; answer: SurveyAnswer }>
    ) => {
      const { role, answer } = action.payload;
      if (!state[role]) {
        state[role] = { answers: [], completed: false };
      }
      const existingIndex = state[role].answers.findIndex(
        (a) => a.questionId === answer.questionId
      );
      if (existingIndex >= 0) {
        state[role].answers[existingIndex] = answer;
      } else {
        state[role].answers.push(answer);
      }
    },
    completeSurvey: (state, action: PayloadAction<{ role: string }>) => {
      const { role } = action.payload;
      if (state[role]) {
        state[role].completed = true;
        state[role].completedAt = new Date().toISOString();
      }
    },
    resetSurvey: (state, action: PayloadAction<{ role: string }>) => {
      const { role } = action.payload;
      delete state[role];
    },
  },
});

export const { saveAnswer, completeSurvey, resetSurvey } = surveySlice.actions;
export default surveySlice.reducer;

