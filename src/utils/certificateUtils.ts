/**
 * Certificate Generation Utilities
 * Handles certificate generation and issuance
 */

import { CourseProgress, Course } from '@/data/mock/coursesData';
import { isEligibleForCertificate } from './courseUtils';

/**
 * Generate certificate for student
 * In production, this would generate a PDF certificate
 */
export function generateCertificate(
  progress: CourseProgress,
  course: Course
): { certificateUrl: string; certificateIssuedAt: string } {
  // TODO: Generate actual PDF certificate
  // Use libraries like pdfkit, jsPDF, or server-side generation
  
  const certificateId = `cert_${progress.studentId}_${progress.courseId}_${Date.now()}`;
  const certificateUrl = `/certificates/${certificateId}.pdf`;
  
  return {
    certificateUrl,
    certificateIssuedAt: new Date().toISOString(),
  };
}

/**
 * Check and issue certificate if eligible
 */
export function checkAndIssueCertificate(
  progress: CourseProgress,
  course: Course,
  threshold: number = 80
): CourseProgress | null {
  if (progress.certificateIssued) {
    return null; // Already issued
  }
  
  if (!isEligibleForCertificate(progress.progressPercentage, threshold)) {
    return null; // Not eligible yet
  }
  
  const { certificateUrl, certificateIssuedAt } = generateCertificate(progress, course);
  
  return {
    ...progress,
    certificateIssued: true,
    certificateUrl,
    certificateIssuedAt,
    mentorSigned: course.courseCategory === 'bootcamp' || course.courseCategory === 'bundle',
  };
}

/**
 * Format certificate data for display
 */
export function formatCertificateData(progress: CourseProgress, course: Course) {
  return {
    studentId: progress.studentId,
    courseTitle: course.title,
    instructorName: course.instructor.name,
    completionDate: progress.certificateIssuedAt,
    progressPercentage: progress.progressPercentage,
    isMentorSigned: progress.mentorSigned,
    certificateUrl: progress.certificateUrl,
  };
}

