"use client";

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface VerificationLevelProps {
  currentLevel: 0 | 1 | 2;
  status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  role: string;
}

const levelInfo = {
  0: {
    title: 'Basic Registration',
    description: 'Account created and basic information provided',
    color: 'gray'
  },
  1: {
    title: 'Identity Verified',
    description: 'Personal information and documents verified',
    color: 'blue'
  },
  2: {
    title: 'Role Verified',
    description: 'Full access to portal features',
    color: 'green'
  }
};

const statusInfo = {
  pending: {
    icon: Clock,
    color: 'yellow',
    text: 'Under Review',
    description: 'Your verification is being reviewed by our team'
  },
  approved: {
    icon: CheckCircle,
    color: 'green',
    text: 'Approved',
    description: 'Your verification has been approved'
  },
  rejected: {
    icon: XCircle,
    color: 'red',
    text: 'Rejected',
    description: 'Your verification was rejected. Please check the feedback.'
  },
  incomplete: {
    icon: AlertCircle,
    color: 'orange',
    text: 'Incomplete',
    description: 'Please complete all required fields to proceed'
  }
};

export function VerificationLevel({ currentLevel, status, role }: VerificationLevelProps) {
  const StatusIcon = statusInfo[status].icon;
  const statusColor = statusInfo[status].color;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verification Status
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal Access
          </p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          statusColor === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
          statusColor === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
          statusColor === 'red' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
          'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
        }`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{statusInfo[status].text}</span>
        </div>
      </div>

      {/* Verification Levels */}
      <div className="space-y-4">
        {[0, 1, 2].map((level) => {
          const isCompleted = level <= currentLevel;
          const isCurrent = level === currentLevel;
          const levelData = levelInfo[level as keyof typeof levelInfo];
          
          return (
            <div key={level} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{level + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className={`font-medium ${
                    isCurrent ? 'text-orange-600 dark:text-orange-400' : 
                    isCompleted ? 'text-green-600 dark:text-green-400' : 
                    'text-gray-600 dark:text-gray-400'
                  }`}>
                    Level {level + 1}: {levelData.title}
                  </h3>
                  {isCurrent && (
                    <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {levelData.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Description */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <StatusIcon className={`w-5 h-5 mt-0.5 ${
            statusColor === 'green' ? 'text-green-600 dark:text-green-400' :
            statusColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
            statusColor === 'red' ? 'text-red-600 dark:text-red-400' :
            'text-orange-600 dark:text-orange-400'
          }`} />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {statusInfo[status].text}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {statusInfo[status].description}
            </p>
          </div>
        </div>
      </div>

      {/* Access Information */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
          Portal Access Information
        </h4>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <p>• <strong>Level 0:</strong> Basic login and profile viewing</p>
          <p>• <strong>Level 1:</strong> Browse courses, view mentors, limited features</p>
          <p>• <strong>Level 2:</strong> Full access to all portal features and interactions</p>
        </div>
      </div>
    </div>
  );
}



