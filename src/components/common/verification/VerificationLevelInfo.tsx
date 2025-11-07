"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { VerificationLevel } from '@/lib/api/verification';
import { CheckCircle2, Lock, AlertCircle } from 'lucide-react';

interface VerificationLevelInfoProps {
  currentLevel: VerificationLevel;
  role?: string;
}

const levelDetails = {
  0: {
    name: 'L0 - Basic',
    description: 'Email Verification',
    access: [
      // 'Limited Access', // Commented out for UI development
      'Full Access', // Temporarily showing full access
      'Profile Setup Only',
    ],
    requirements: [
      'Email verified',
    ],
  },
  1: {
    name: 'L1 - ID Verified',
    description: 'Government ID Upload',
    access: [
      'Course Access',
      'Certificates',
    ],
    requirements: [
      'Government ID document uploaded',
      'ID verified by admin',
    ],
  },
  2: {
    name: 'L2 - Role Verified',
    description: 'KYC + Professional/Company Documents',
    access: [
      'Mentorship',
      'Job Posting',
      'Investment',
      'CSR Funding',
    ],
    requirements: [
      'Role-specific documents submitted',
      'Admin approval required',
    ],
  },
  3: {
    name: 'L3 - Trusted/Premium',
    description: 'Full KYC + Address Proof + Video Verification',
    access: [
      'Entrepreneur Zone',
      'Startup Creation',
      'Fund Management',
    ],
    requirements: [
      'Address proof submitted',
      'Video verification completed',
      'Compliance team approval',
    ],
  },
};

export function VerificationLevelInfo({ currentLevel, role }: VerificationLevelInfoProps) {
  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Verification Levels</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your current verification level determines what features you can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(levelDetails).map(([level, details]) => {
              const levelNum = parseInt(level) as VerificationLevel;
              const isCurrentLevel = levelNum === currentLevel;
              const isUnlocked = levelNum <= currentLevel;
              const isLocked = levelNum > currentLevel;

              return (
                <div
                  key={level}
                  className={`p-4 rounded-lg border-2 ${
                    isCurrentLevel
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                      : isUnlocked
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {isUnlocked ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                        {details.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {details.description}
                      </p>
                    </div>
                    {isCurrentLevel && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Access:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                        {details.access.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {isLocked && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Requirements:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                          {details.requirements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

