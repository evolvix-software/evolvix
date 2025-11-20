/**
 * Access Control Utilities
 * Implements course type-based feature visibility
 */

import { CourseType, Course, DeliveryMethod } from '@/interfaces/course';
import { Student } from '@/types/student';
import { Mentor } from '@/interfaces/mentor';

export interface AccessControlResult {
  canAccessHackathons: boolean;
  canAccessScholarships: boolean;
  canAccessAIInterview: boolean;
  canAccessManualInterview: boolean;
  canAccessLiveClasses: boolean;
  canAccessRecordedContent: boolean;
  visibleMenuItems: string[];
}

/**
 * Check if course type has premium features
 */
export function hasPremiumFeatures(courseType: CourseType): boolean {
  return courseType === 'bootcamp';
}

/**
 * Get access control for student based on enrolled courses
 */
export function getStudentAccessControl(
  enrolledCourses: Course[]
): AccessControlResult {
  const hasBootcampCourse = enrolledCourses.some(
    course => course.courseType === 'bootcamp'
  );
  
  const hasLiveCourse = enrolledCourses.some(
    course => course.deliveryMethod === 'live' || course.deliveryMethod === 'mixed'
  );
  
  const hasRecordedCourse = enrolledCourses.some(
    course => course.deliveryMethod === 'recorded' || course.deliveryMethod === 'mixed'
  );

  const visibleMenuItems = [
    'dashboard',
    'courses',
    'my-courses',
    'assignments',
    'tests',
    'mentors',
    'settings',
    // Always visible for all students
    'jobs',
    'ai-interview',
    'interview-preparation',
  ];

  // Add premium features if bootcamp student
  if (hasBootcampCourse) {
    visibleMenuItems.push('hackathons', 'scholarships');
  }

  // Add live classes if has live course
  if (hasLiveCourse) {
    visibleMenuItems.push('classes');
  }

  // Add recorded content if has recorded course
  if (hasRecordedCourse) {
    visibleMenuItems.push('recordings');
  }

  return {
    canAccessHackathons: hasBootcampCourse,
    canAccessScholarships: hasBootcampCourse,
    canAccessAIInterview: true, // Available to all students
    canAccessManualInterview: true, // Available to all students
    canAccessLiveClasses: hasLiveCourse,
    canAccessRecordedContent: hasRecordedCourse,
    visibleMenuItems,
  };
}

/**
 * Get access control for mentor based on course types taught
 */
export function getMentorAccessControl(mentor: Mentor): AccessControlResult {
  const hasBootcampCourses = mentor.accountType === 'bootcamp' || mentor.accountType === 'both';

  const visibleMenuItems = [
    'dashboard',
    'courses',
    'vacancies',
    'classes',
    'tests',
    'students',
    'assignments',
    'messages',
    'announcements',
    'analytics',
    'calendar',
    'settings',
  ];

  // Add premium features if bootcamp mentor
  if (hasBootcampCourses) {
    visibleMenuItems.push('hackathons', 'scholarships', 'interviews');
  }

  return {
    canAccessHackathons: hasBootcampCourses,
    canAccessScholarships: hasBootcampCourses,
    canAccessAIInterview: hasBootcampCourses,
    canAccessManualInterview: hasBootcampCourses,
    canAccessLiveClasses: true, // Mentors can always manage classes
    canAccessRecordedContent: true, // Mentors can always manage content
    visibleMenuItems,
  };
}

/**
 * Check if course can be created directly (no vacancy required)
 */
export function canCreateDirectly(courseType: CourseType): boolean {
  return courseType === 'crash' || courseType === 'skill-focused';
}

/**
 * Check if course requires vacancy application
 */
export function requiresVacancy(courseType: CourseType): boolean {
  return courseType === 'bootcamp';
}

/**
 * Check if category is allowed for course type
 */
export function isCategoryAllowed(
  category: string,
  courseType: CourseType
): boolean {
  if (courseType === 'bootcamp') {
    // Bootcamp: IT category only
    const itCategories = [
      'development',
      'data-science',
      'cybersecurity',
      'ai-ml',
      'devops',
      'mobile-development',
    ];
    return itCategories.includes(category.toLowerCase());
  }
  
  // Crash/Skill: Any category
  return true;
}

/**
 * Check if free course is valid
 */
export function isValidFreeCourse(
  courseType: CourseType,
  deliveryMethod: DeliveryMethod,
  durationMinutes: number
): { valid: boolean; error?: string } {
  // Free courses: Crash/Skill only
  if (courseType === 'bootcamp') {
    return { valid: false, error: 'Bootcamp courses cannot be free' };
  }

  // Free courses: Recorded only
  if (deliveryMethod !== 'recorded') {
    return { valid: false, error: 'Free courses must be recorded only' };
  }

  // Free courses: 30 minutes to 2 hours
  if (durationMinutes < 30 || durationMinutes > 120) {
    return {
      valid: false,
      error: 'Free courses must be between 30 minutes and 2 hours',
    };
  }

  return { valid: true };
}

/**
 * Calculate time limit end date
 */
export function calculateTimeLimitEndDate(
  startDate: string,
  courseType: CourseType
): string {
  const start = new Date(startDate);
  let daysToAdd = 0;

  if (courseType === 'crash') {
    daysToAdd = 14; // 1-2 weeks
  } else if (courseType === 'skill-focused') {
    daysToAdd = 28; // 1-4 weeks
  }

  const endDate = new Date(start);
  endDate.setDate(start.getDate() + daysToAdd);
  return endDate.toISOString();
}

/**
 * Check if course access has expired
 */
export function isCourseAccessExpired(
  enrollmentDate: string,
  courseType: CourseType,
  timeLimitDays?: number
): boolean {
  if (courseType === 'bootcamp') {
    return false; // Bootcamp has no time limits
  }

  if (!timeLimitDays) {
    return false; // No time limit set
  }

  const enrollment = new Date(enrollmentDate);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - enrollment.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysDiff > timeLimitDays;
}

/**
 * Check if student is enrolled in coding-related bootcamp
 */
export function isCodingBootcampStudent(enrolledCourses: Course[]): boolean {
  const codingCategories = [
    'development',
    'data-science',
    'cybersecurity',
    'ai-ml',
    'devops',
    'mobile-development',
  ];

  return enrolledCourses.some(
    course =>
      course.courseType === 'bootcamp' &&
      codingCategories.includes(course.category.toLowerCase())
  );
}

