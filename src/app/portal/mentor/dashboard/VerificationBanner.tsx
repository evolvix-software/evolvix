"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { AlertCircle, Shield } from 'lucide-react';

interface VerificationBannerProps {
  verificationStatus: 'incomplete' | 'pending' | 'approved' | 'rejected';
}

export function VerificationBanner({ verificationStatus }: VerificationBannerProps) {
  const router = useRouter();

  return (
    <Card className="border-2 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Verification Required
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md">
              {verificationStatus === 'pending'
                ? 'Your verification is under review. You\'ll be notified once approved.'
                : verificationStatus === 'rejected'
                ? 'Your verification was rejected. Please review the requirements and submit again.'
                : 'Complete your verification to unlock all mentor features and start earning. All dashboard data will be available after verification.'}
            </p>
          </div>
          {(verificationStatus === 'incomplete' || verificationStatus === 'rejected') && (
            <Button
              onClick={() => router.push('/portal/mentor/settings?section=profile')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5"
            >
              <Shield className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



