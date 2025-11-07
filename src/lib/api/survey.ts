/**
 * Survey API Service
 */

import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import {
  SurveyQuestion,
  SurveyStatus,
  SurveyResponse,
  SaveAnswerRequest,
  SubmitSurveyRequest,
  SurveyAnswer,
} from './types';

export const surveyApi = {
  /**
   * Get survey questions for a role
   */
  async getQuestions(role: string): Promise<{ role: string; questions: SurveyQuestion[] }> {
    const response = await apiClient.get<{ role: string; questions: SurveyQuestion[] }>(
      `${API_ENDPOINTS.SURVEY.QUESTIONS}/${role}`
    );
    return response.data!;
  },

  /**
   * Get survey status for a role
   */
  async getStatus(role: string): Promise<SurveyStatus> {
    const response = await apiClient.get<SurveyStatus>(
      `${API_ENDPOINTS.SURVEY.STATUS}/${role}`
    );
    return response.data!;
  },

  /**
   * Get all surveys for current user
   */
  async getMySurveys(): Promise<{ surveys: SurveyStatus[] }> {
    const response = await apiClient.get<{ surveys: SurveyStatus[] }>(
      API_ENDPOINTS.SURVEY.MY_SURVEYS
    );
    return response.data!;
  },

  /**
   * Get survey answers for a role
   */
  async getSurvey(role: string): Promise<SurveyResponse> {
    const response = await apiClient.get<SurveyResponse>(
      `${API_ENDPOINTS.SURVEY.SURVEY_BY_ROLE}/${role}`
    );
    return response.data!;
  },

  /**
   * Save a single answer
   */
  async saveAnswer(data: SaveAnswerRequest): Promise<{ role: string; answer: SurveyAnswer }> {
    const response = await apiClient.post<{ role: string; answer: SurveyAnswer }>(
      API_ENDPOINTS.SURVEY.SAVE_ANSWER,
      data
    );
    return response.data!;
  },

  /**
   * Submit complete survey
   */
  async submitSurvey(data: SubmitSurveyRequest): Promise<SurveyStatus> {
    const response = await apiClient.post<SurveyStatus>(
      API_ENDPOINTS.SURVEY.SUBMIT,
      data
    );
    return response.data!;
  },
};

