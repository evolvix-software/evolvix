/**
 * useAccessControl Hook
 * Provides access control based on course types
 */

import { useMemo } from 'react';
import { Course } from '@/interfaces/course';
import { Mentor } from '@/interfaces/mentor';
import {
  getStudentAccessControl,
  getMentorAccessControl,
  AccessControlResult,
} from '@/utils/accessControl';

interface UseStudentAccessControlProps {
  enrolledCourses: Course[];
}

interface UseMentorAccessControlProps {
  mentor: Mentor;
}

export function useStudentAccessControl({
  enrolledCourses,
}: UseStudentAccessControlProps): AccessControlResult {
  return useMemo(
    () => getStudentAccessControl(enrolledCourses),
    [enrolledCourses]
  );
}

export function useMentorAccessControl({
  mentor,
}: UseMentorAccessControlProps): AccessControlResult {
  return useMemo(() => getMentorAccessControl(mentor), [mentor]);
}

/**
 * Check if specific feature is accessible
 */
export function useFeatureAccess(
  enrolledCourses: Course[],
  feature: 'hackathons' | 'scholarships' | 'ai-interview' | 'manual-interview'
): boolean {
  const accessControl = useStudentAccessControl({ enrolledCourses });

  switch (feature) {
    case 'hackathons':
      return accessControl.canAccessHackathons;
    case 'scholarships':
      return accessControl.canAccessScholarships;
    case 'ai-interview':
      return accessControl.canAccessAIInterview;
    case 'manual-interview':
      return accessControl.canAccessManualInterview;
    default:
      return false;
  }
}

