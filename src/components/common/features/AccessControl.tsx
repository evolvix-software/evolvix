/**
 * Access Control Component
 * Conditionally renders children based on access permissions
 */

import React from 'react';
import { useStudentAccessControl } from '@/hooks/useAccessControl';
import { Course } from '@/interfaces/course';

export interface AccessControlProps {
  enrolledCourses: Course[];
  requiredFeature?: 'hackathons' | 'scholarships' | 'ai-interview' | 'manual-interview';
  requiredCourseType?: 'bootcamp';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const AccessControl: React.FC<AccessControlProps> = ({
  enrolledCourses,
  requiredFeature,
  requiredCourseType,
  fallback,
  children,
}) => {
  const accessControl = useStudentAccessControl({ enrolledCourses });

  // Check course type requirement
  if (requiredCourseType === 'bootcamp') {
    const hasBootcamp = enrolledCourses.some(
      course => course.courseType === 'bootcamp'
    );
    if (!hasBootcamp) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  // Check feature requirement
  if (requiredFeature) {
    const hasAccess =
      requiredFeature === 'hackathons' && accessControl.canAccessHackathons ||
      requiredFeature === 'scholarships' && accessControl.canAccessScholarships ||
      requiredFeature === 'ai-interview' && accessControl.canAccessAIInterview ||
      requiredFeature === 'manual-interview' && accessControl.canAccessManualInterview;

    if (!hasAccess) {
      return fallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
};

