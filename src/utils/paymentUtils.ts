/**
 * Payment Distribution Utilities
 * Handles commission calculation and payment distribution
 */

import { PaymentDistribution, Course } from '@/data/mock/coursesData';
import { distributePayment } from './courseUtils';

/**
 * Create payment distribution record
 */
export function createPaymentDistribution(
  courseId: string,
  mentorId: string,
  studentId: string,
  amount: number,
  course: Course,
  paymentMethod: 'full' | 'installment' = 'full',
  installmentNumber?: number,
  totalInstallments?: number
): PaymentDistribution {
  const commissionSplit = course.commissionSplit || { evolvix: 30, mentor: 70 };
  const { platformCut, mentorCut } = distributePayment(amount, commissionSplit);

  return {
    id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    courseId,
    mentorId,
    studentId,
    amount,
    paymentMethod,
    installmentNumber,
    totalInstallments,
    platformCut,
    mentorCut,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Process payment distribution
 * In production, this would integrate with payment gateways (Stripe Connect, RazorpayX)
 */
export async function processPaymentDistribution(
  distribution: PaymentDistribution
): Promise<PaymentDistribution> {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      const processed: PaymentDistribution = {
        ...distribution,
        status: 'completed',
        distributedAt: new Date().toISOString(),
      };
      
      // TODO: In production, trigger actual payouts:
      // - Platform cut goes to Evolvix account
      // - Mentor cut goes to mentor's connected account (Stripe Connect / RazorpayX)
      
      resolve(processed);
    }, 1000);
  });
}

/**
 * Get payment distribution history for a mentor
 */
export function getMentorPayments(
  distributions: PaymentDistribution[],
  mentorId: string
): PaymentDistribution[] {
  return distributions.filter(d => d.mentorId === mentorId);
}

/**
 * Calculate total earnings for a mentor
 */
export function calculateMentorEarnings(distributions: PaymentDistribution[]): {
  totalEarnings: number;
  pendingEarnings: number;
  completedEarnings: number;
} {
  const mentorDistributions = distributions.filter(d => d.status !== 'failed');
  
  const completedEarnings = mentorDistributions
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.mentorCut, 0);
  
  const pendingEarnings = mentorDistributions
    .filter(d => d.status === 'pending' || d.status === 'processing')
    .reduce((sum, d) => sum + d.mentorCut, 0);
  
  return {
    totalEarnings: completedEarnings + pendingEarnings,
    pendingEarnings,
    completedEarnings,
  };
}

