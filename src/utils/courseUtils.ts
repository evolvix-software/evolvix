/**
 * Course System Utilities
 * Provides helper functions for course categorization, duration mapping, and validation
 */

import { Course } from '@/data/mock/coursesData';

/**
 * Parse duration string to hours
 * Supports formats: "10 hours", "2 weeks", "4 months", "6-months", etc.
 */
export function parseDurationToHours(duration: string): number {
  if (!duration || duration.trim() === '') return 0;
  
  const normalized = duration.toLowerCase().trim();
  
  // Extract number
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  
  // Determine unit and convert to hours
  if (normalized.includes('hour') || normalized.includes('hr')) {
    return value;
  } else if (normalized.includes('week')) {
    return value * 40; // Assuming 40 hours per week
  } else if (normalized.includes('month')) {
    return value * 160; // Assuming 160 hours per month (4 weeks * 40 hours)
  } else if (normalized.includes('day')) {
    return value * 8; // Assuming 8 hours per day
  }
  
  return 0;
}

/**
 * Parse duration string to months
 */
export function parseDurationToMonths(duration: string): number {
  if (!duration || duration.trim() === '') return 0;
  
  const normalized = duration.toLowerCase().trim();
  
  // Extract number
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  
  // Determine unit and convert to months
  if (normalized.includes('month')) {
    return value;
  } else if (normalized.includes('week')) {
    return value / 4; // 4 weeks = 1 month
  } else if (normalized.includes('day')) {
    return value / 30; // 30 days = 1 month
  } else if (normalized.includes('hour') || normalized.includes('hr')) {
    return value / 160; // 160 hours = 1 month
  }
  
  return 0;
}

/**
 * Dynamic Duration Mapping
 * Auto-classify course category based on duration
 */
export function determineCourseCategory(duration: string): 'crash' | 'skill-focused' | 'bootcamp' | 'bundle' {
  if (!duration || duration.trim() === '') {
    return 'skill-focused'; // Default fallback
  }
  
  const hours = parseDurationToHours(duration);
  const months = parseDurationToMonths(duration);
  
  // If duration is in months (4+ months = bundle)
  if (months >= 4) {
    return 'bundle';
  }
  
  // Classify by hours
  if (hours <= 5) {
    return 'crash';
  } else if (hours <= 20) {
    return 'skill-focused';
  } else if (hours <= 60) {
    return 'bootcamp';
  } else {
    return 'bundle';
  }
}

/**
 * Check if course category requires vacancy
 */
export function requiresVacancy(courseCategory?: string): boolean {
  return courseCategory === 'bootcamp' || courseCategory === 'bundle';
}

/**
 * Check if course category allows scholarship
 */
export function allowsScholarship(courseCategory?: string): boolean {
  return courseCategory === 'bootcamp' || courseCategory === 'bundle';
}

/**
 * Calculate course progress percentage
 */
export function calculateProgress(completedModules: number, totalModules: number): number {
  if (totalModules === 0) return 0;
  return Math.round((completedModules / totalModules) * 100);
}

/**
 * Check if student is eligible for certificate
 * Certificate issued at 80-90% completion
 */
export function isEligibleForCertificate(progressPercentage: number, threshold: number = 80): boolean {
  return progressPercentage >= threshold;
}

/**
 * Calculate mentor reputation score
 * Weighted formula: (avgRating * 0.4) + (verifiedCourses * 0.3) + (completionRate * 0.2) + (totalStudents * 0.1)
 */
export function calculateReputationScore(
  averageRating: number,
  verifiedCourses: number,
  completionRate: number,
  totalStudents: number
): number {
  // Normalize values
  const ratingScore = Math.min(averageRating * 20, 40); // Max 40 points (5.0 rating = 40)
  const verifiedScore = Math.min(verifiedCourses * 2, 30); // Max 30 points (15+ courses)
  const completionScore = completionRate * 0.2; // Max 20 points (100% completion)
  const studentScore = Math.min(totalStudents / 10, 10); // Max 10 points (100+ students)
  
  return Math.round(ratingScore + verifiedScore + completionScore + studentScore);
}

/**
 * Distribute payment according to commission split
 */
export function distributePayment(
  amount: number,
  commissionSplit: { evolvix: number; mentor: number }
): { platformCut: number; mentorCut: number } {
  const platformCut = (amount * commissionSplit.evolvix) / 100;
  const mentorCut = (amount * commissionSplit.mentor) / 100;
  
  return {
    platformCut: Math.round(platformCut * 100) / 100, // Round to 2 decimals
    mentorCut: Math.round(mentorCut * 100) / 100,
  };
}

/**
 * Calculate installment amount
 */
export function calculateInstallmentAmount(totalAmount: number, numberOfInstallments: number): number {
  return Math.round((totalAmount / numberOfInstallments) * 100) / 100;
}

/**
 * Generate installment schedule
 */
export function generateInstallmentSchedule(
  totalAmount: number,
  numberOfInstallments: number,
  startDate: Date = new Date()
): Array<{ installmentNumber: number; amount: number; dueDate: Date }> {
  const installmentAmount = calculateInstallmentAmount(totalAmount, numberOfInstallments);
  const schedule: Array<{ installmentNumber: number; amount: number; dueDate: Date }> = [];
  
  for (let i = 0; i < numberOfInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + (i * 30)); // 30 days between installments
    
    schedule.push({
      installmentNumber: i + 1,
      amount: i === numberOfInstallments - 1 
        ? totalAmount - (installmentAmount * (numberOfInstallments - 1)) // Last installment gets remainder
        : installmentAmount,
      dueDate,
    });
  }
  
  return schedule;
}

/**
 * Validate course data before save
 */
export function validateCourse(course: Partial<Course>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!course.title || course.title.trim() === '') {
    errors.push('Course title is required');
  }
  
  if (!course.description || course.description.trim() === '') {
    errors.push('Course description is required');
  }
  
  if (course.price === undefined || course.price < 0) {
    errors.push('Course price must be a non-negative number');
  }
  
  if (course.courseCategory && requiresVacancy(course.courseCategory)) {
    if (!course.vacancyId) {
      errors.push('Bootcamp and Bundle courses require a vacancy application');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

