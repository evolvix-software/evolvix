"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Shield } from 'lucide-react';

interface VerificationStatusHelperProps {
  email: string;
  onStatusChange?: () => void;
}

/**
 * DEVELOPMENT ONLY: Helper component to change verification status for testing
 * Remove or disable in production
 */
export function VerificationStatusHelper({ email, onStatusChange }: VerificationStatusHelperProps) {
  const [currentStatus, setCurrentStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');

  useEffect(() => {
    const verificationKey = `evolvix_mentor_verification_${email}`;
    const verificationData = localStorage.getItem(verificationKey);
    if (verificationData) {
      const verification = JSON.parse(verificationData);
      setCurrentStatus(verification.status || 'incomplete');
    }
  }, [email]);

  const updateVerificationStatus = (status: 'incomplete' | 'pending' | 'approved' | 'rejected') => {
    const verificationKey = `evolvix_mentor_verification_${email}`;
    const existingData = localStorage.getItem(verificationKey);
    
    let verificationData: any = {};
    if (existingData) {
      verificationData = JSON.parse(existingData);
    }
    
    verificationData.status = status;
    verificationData.updatedAt = new Date().toISOString();
    
    if (status === 'approved') {
      verificationData.approvedAt = new Date().toISOString();
      verificationData.verifiedBadge = true;
    }
    
    localStorage.setItem(verificationKey, JSON.stringify(verificationData));
    setCurrentStatus(status);
    
    // Trigger page refresh to see changes
    if (onStatusChange) {
      onStatusChange();
    } else {
      window.location.reload();
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-400 flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>🔧 Development: Change Verification Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            Current Status: <strong className="uppercase">{currentStatus}</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateVerificationStatus('incomplete')}
              className={`text-xs ${currentStatus === 'incomplete' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              Incomplete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateVerificationStatus('pending')}
              className={`text-xs ${currentStatus === 'pending' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateVerificationStatus('approved')}
              className={`text-xs ${currentStatus === 'approved' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              Approved ✅
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateVerificationStatus('rejected')}
              className={`text-xs ${currentStatus === 'rejected' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
            >
              Rejected
            </Button>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            💡 This helper is for development/testing only
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

