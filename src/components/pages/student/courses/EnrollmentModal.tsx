"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Label } from '@/components/ui/label';
import { Course } from '@/data/mock/coursesData';
import { X, CreditCard, Calendar, CheckCircle2, DollarSign } from 'lucide-react';

interface EnrollmentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (paymentMethod: 'full' | 'installment', installments?: number) => void;
}

export function EnrollmentModal({ course, isOpen, onClose, onEnroll }: EnrollmentModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'full' | 'installment'>('full');
  const [selectedInstallments, setSelectedInstallments] = useState<number>(4);

  if (!isOpen) return null;

  const installmentAmount = course.price / selectedInstallments;
  const installmentDates = Array.from({ length: selectedInstallments }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + (i * 30)); // 30 days between installments
    return date;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="border border-border bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Enroll in Course</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>{course.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Price */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Course Price</span>
              <span className="text-2xl font-bold text-foreground">${course.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="mb-3 block text-base font-semibold">Select Payment Method</Label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedPaymentMethod('full')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedPaymentMethod === 'full'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-border hover:border-green-300 dark:hover:border-green-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-semibold text-foreground">Full Payment</h4>
                      <p className="text-sm text-muted-foreground">Pay ${course.price.toLocaleString()} upfront</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'full' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
              </button>

              {course.installmentEnabled && course.price > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('installment')}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPaymentMethod === 'installment'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-border hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h4 className="font-semibold text-foreground">Installment Plan</h4>
                        <p className="text-sm text-muted-foreground">Split payment into installments</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === 'installment' && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  {selectedPaymentMethod === 'installment' && (
                    <div className="mt-3 space-y-3 pl-8">
                      <div>
                        <Label className="mb-2 block text-sm font-medium">Number of Installments</Label>
                        <div className="flex gap-2">
                          {course.installmentOptions?.map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setSelectedInstallments(num)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                selectedInstallments === num
                                  ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'border-border hover:border-blue-300'
                              }`}
                            >
                              {num} Payments
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-background rounded-lg border border-border">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Each Installment:</span>
                            <span className="font-semibold text-foreground">${installmentAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="font-semibold text-foreground">${course.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label className="mb-2 block text-sm font-medium">Payment Schedule</Label>
                        <div className="space-y-2">
                          {installmentDates.map((date, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-background rounded border border-border">
                              <span className="text-sm text-muted-foreground">
                                Installment {index + 1}
                              </span>
                              <div className="text-right">
                                <span className="text-sm font-medium text-foreground">
                                  ${installmentAmount.toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground block">
                                  {date.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Scholarship Option (if available) */}
          {course.scholarshipAvailable && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Scholarship Available
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Eligible students (high college scores, lower middle class) can apply for scholarship.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Navigate to scholarship application
                  alert('Scholarship application feature coming soon!');
                }}
                className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
              >
                Apply for Scholarship
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onEnroll(
                  selectedPaymentMethod,
                  selectedPaymentMethod === 'installment' ? selectedInstallments : undefined
                );
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {selectedPaymentMethod === 'full' 
                ? `Pay $${course.price.toLocaleString()}`
                : `Pay First Installment ($${installmentAmount.toFixed(2)})`
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

