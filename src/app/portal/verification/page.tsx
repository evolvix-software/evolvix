"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loadVerificationData, submitVerificationData, checkVerificationStatus } from '@/store/features/verification/verificationThunks';
import { Layout } from '@/components/common/layout/Layout';
import { VerificationLevel } from '@/components/common/verification/VerificationLevel';
import { StudentVerificationForm } from '@/components/common/verification/StudentVerificationForm';
import { MentorVerificationForm } from '@/components/common/verification/MentorVerificationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { 
    currentVerification, 
    verificationStatus, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.verification);
  
  const [userData, setUserData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    console.log('Verification page - stored data:', storedData);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Verification page - parsed data:', parsedData);
      
      if (parsedData.status === 'completed' && parsedData.role) {
        setUserData(parsedData);
        // Load verification data
        dispatch(loadVerificationData(parsedData.email));
        dispatch(checkVerificationStatus(parsedData.email));
      } else {
        console.log('Registration not completed, redirecting to role selection');
        router.push('/auth/role-selection');
      }
    } else {
      console.log('No registration data found, redirecting to signup');
      router.push('/auth/signup');
    }
  }, [router, dispatch]);

  const handleFormSubmit = async (formData: any) => {
    if (!userData) return;
    
    setIsSubmitting(true);
    try {
      const verificationData = {
        ...formData,
        userId: userData.email,
        role: userData.role,
        verificationLevel: 1,
        status: 'pending'
      };
      
      await dispatch(submitVerificationData(verificationData)).unwrap();
      
      // Show success message and redirect after delay
      setTimeout(() => {
        router.push(`/portal/${userData.role}`);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit verification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipVerification = () => {
    // Update user data to indicate they skipped verification
    const updatedUserData = {
      ...userData,
      verificationSkipped: true,
      verificationSkippedAt: new Date().toISOString()
    };
    
    localStorage.setItem('evolvix_registration', JSON.stringify(updatedUserData));
    
    // Redirect to portal
    router.push(`/portal/${userData.role}`);
  };

  const getRoleTitle = (role: string) => {
    const titles = {
      student: 'Student',
      mentor: 'Mentor',
      employer: 'Employer',
      investor: 'Investor',
      sponsor: 'Sponsor'
    };
    return titles[role as keyof typeof titles] || role;
  };

  const getVerificationForm = () => {
    if (!userData) return null;
    
    switch (userData.role) {
      case 'student':
        return <StudentVerificationForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />;
      case 'mentor':
        return <MentorVerificationForm onSubmit={handleFormSubmit} isLoading={isSubmitting} />;
      case 'employer':
        return <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Employer verification form coming soon...</p>
        </div>;
      case 'investor':
        return <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Investor verification form coming soon...</p>
        </div>;
      case 'sponsor':
        return <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Sponsor verification form coming soon...</p>
        </div>;
      default:
        return <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Verification form not available for this role.</p>
        </div>;
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  const currentLevel = verificationStatus?.level || 0;
  const currentStatus = verificationStatus?.status || 'incomplete';

  return (
    <Layout title="Verification" role={userData.role as 'student' | 'mentor'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Verification
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Verify your identity to unlock all {getRoleTitle(userData.role)} portal features. 
            <span className="text-orange-600 dark:text-orange-400 font-medium"> Verification is optional</span> - you can skip this step and verify later.
          </p>
        </div>

        {/* Verification Status */}
        <VerificationLevel 
          currentLevel={currentLevel} 
          status={currentStatus} 
          role={userData.role} 
        />

        {/* Status Messages */}
        {currentStatus === 'approved' && (
          <Card className="border-0 shadow-sm bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-400">
                    Verification Approved!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your verification has been approved. You now have full access to all portal features.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => router.push(`/portal/${userData.role}`)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Go to Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStatus === 'pending' && (
          <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-400">
                    Verification Under Review
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Your verification is being reviewed by our team. You'll be notified once it's complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStatus === 'rejected' && (
          <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                    Verification Rejected
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Your verification was rejected. Please review the requirements and submit again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                    Error
                  </h3>
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Form */}
        {currentStatus === 'incomplete' && (
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                {getRoleTitle(userData.role)} Verification Form
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Complete all required fields to verify your {getRoleTitle(userData.role).toLowerCase()} account and unlock full portal access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getVerificationForm()}
              
              {/* Skip Verification Option */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Don't want to verify right now? You can skip this step and verify later.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkipVerification}
                      className="px-6 py-2"
                    >
                      Skip Verification for Now
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push(`/portal/${userData.role}`)}
                      variant="ghost"
                      className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Go to Portal {/* (Limited Access) - Commented out for UI development */}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    You can always complete verification later from your portal settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portal Access Information */}
        <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-400">
              Portal Access Levels
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Understanding your access based on verification level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Level 0 - Basic Access</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• View profile</li>
                  <li>• Basic portal navigation</li>
                  {/* <li>• Limited feature access</li> */}
                  <li>• Full feature access {/* Temporarily enabled for UI development */}</li>
                </ul>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Level 1 - Identity Verified</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Browse courses/mentors</li>
                  <li>• View detailed content</li>
                  <li>• Limited interactions</li>
                </ul>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Level 2 - Full Access</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• All portal features</li>
                  <li>• Full interactions</li>
                  <li>• Payment processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
