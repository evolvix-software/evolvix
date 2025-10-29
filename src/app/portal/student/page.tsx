"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadStudentData } from '@/store/features/student/studentThunks';
import { checkVerificationStatus } from '@/store/features/verification/verificationThunks';
import { Layout } from '@/components/layout/Layout';
import {
  WelcomeHeader,
  StatsGrid,
  ChartsSection,
  QuickActions,
  NotificationsFeed,
  UpcomingCourses,
} from '../../../components/student/dashboard';
import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

const defaultNotifications: Array<{
  id: string;
  type: 'course' | 'achievement' | 'progress';
  title: string;
  description: string;
  time: string;
}> = [];

const defaultCourses: Array<{
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
}> = [];

const verifiedNotifications = [
  {
    id: '1',
    type: 'course' as const,
    title: 'New course available',
    description: 'Advanced React Development course is now available',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'achievement' as const,
    title: 'Achievement unlocked',
    description: 'You completed your first certification',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'progress' as const,
    title: 'Progress milestone',
    description: 'You reached 75% completion in JavaScript Basics',
    time: '1 day ago',
  },
];

const verifiedCourses = [
  {
    id: '1',
    title: 'React Development',
    instructor: 'John Doe',
    date: 'Today',
    time: '3:00 PM',
  },
  {
    id: '2',
    title: 'Node.js Basics',
    instructor: 'Jane Smith',
    date: 'Tomorrow',
    time: '2:00 PM',
  },
];

export default function StudentPortal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { 
    stats, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.student);
  
  const { verificationStatus } = useAppSelector((state) => state.verification);
  const [userData, setUserData] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    console.log('Student portal - stored data:', storedData);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Student portal - parsed data:', parsedData);
      
      if (parsedData.status === 'completed' && parsedData.role === 'student') {
        setUserData(parsedData);
        
        // Check if this is the user's first visit
        const hasVisitedBefore = localStorage.getItem('evolvix_portal_visited');
        if (!hasVisitedBefore) {
          setIsNewUser(true);
          localStorage.setItem('evolvix_portal_visited', 'true');
        }
        
        // Load student data from Redux
        dispatch(loadStudentData());
        // Load verification status
        dispatch(checkVerificationStatus(parsedData.email));
      } else {
        console.log('Registration not completed or wrong role, redirecting to role selection');
        router.push('/auth/role-selection');
      }
    } else {
      console.log('No registration data found, redirecting to signup');
      router.push('/auth/signup');
    }
  }, [router, dispatch]);

  useEffect(() => {
    if (verificationStatus?.status === 'approved') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [verificationStatus]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Layout title="Dashboard" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading dashboard...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" role="student">
      <div className="space-y-6">
        {/* New User Welcome Banner */}
        {isNewUser && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[#635bff]/10 to-blue-50 dark:from-[#635bff]/20 dark:to-blue-900/20 border-[#635bff]/20 dark:border-[#635bff]/40 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#635bff] to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🎉</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to Evolvix!
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You're all set! Start your journey by exploring courses, connecting with mentors, 
                    and discovering opportunities tailored for you.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => router.push('/portal/verification')}
                      className="bg-gradient-to-r from-[#635bff] to-blue-600 hover:from-[#4f48cc] hover:to-blue-700 text-white"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Get Verified
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewUser(false)}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <WelcomeHeader userName={userData.fullName || 'Student'} isVerified={isVerified} />

        {/* Verification Status Cards */}
        {verificationStatus?.status === 'incomplete' && (
          <Card className="border-0 shadow-sm bg-[#635bff]/10 dark:bg-[#635bff]/20 border-[#635bff]/20 dark:border-[#635bff]/40 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#635bff]/10 dark:bg-[#635bff]/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#635bff] dark:text-[#735fff]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#635bff] dark:text-[#735fff]">
                    Become a Verified Person
                  </h3>
                  <p className="text-[#635bff] dark:text-[#735fff]">
                    Complete your verification to unlock all portal features, connect with mentors, and access exclusive opportunities.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => router.push('/portal/verification')}
                    className="bg-[#635bff] hover:bg-[#4f48cc] text-white"
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationStatus?.status === 'pending' && (
          <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-400">
                    Verification Under Review
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Your verification is being reviewed. You'll be notified once it's complete and can access all features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationStatus?.status === 'rejected' && (
          <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-400">
                    Verification Rejected
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Your verification was rejected. Please review the requirements and submit again to access all features.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => router.push('/portal/verification')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Resubmit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationStatus?.status === 'approved' && (
          <Card className="border-0 shadow-sm bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-400">
                    Verification Complete!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Congratulations! You are now a verified person with full access to all portal features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ChartsSection />
            <NotificationsFeed notifications={isVerified ? verifiedNotifications : defaultNotifications} />
          </div>

          <div className="space-y-6">
            <QuickActions />
            <UpcomingCourses courses={isVerified ? verifiedCourses : defaultCourses} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
