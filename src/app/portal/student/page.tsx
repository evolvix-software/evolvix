"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadStudentData } from '@/store/features/student/studentThunks';
import { checkVerificationStatus } from '@/store/features/verification/verificationThunks';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { 
  StatsCards, 
  FeaturedCourses, 
  UpcomingEvents, 
  QuickActions, 
  RecentActivity 
} from '@/components/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { AlertCircle, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function StudentPortal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { 
    stats, 
    featuredCourses, 
    upcomingEvents, 
    quickActions, 
    recentActivity, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.student);
  
  const { verificationStatus } = useAppSelector((state) => state.verification);
  const [userData, setUserData] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(false);

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

  if (isLoading) {
    return (
      <StudentLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading dashboard...</h2>
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-xl">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Dashboard">
      <div className="space-y-6">
        {/* New User Welcome Banner */}
        {isNewUser && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 border-orange-200 dark:border-orange-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full flex items-center justify-center">
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
                      className="bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700 text-white"
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

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isNewUser ? 'Start Your Learning Journey!' : 'Welcome to Your Learning Journey!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover opportunities, connect with mentors, and accelerate your growth.
          </p>
        </div>

        {/* Verification Prompt */}
        {verificationStatus?.status === 'incomplete' && (
          <Card className="border-0 shadow-sm bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-400">
                    Become a Verified Person
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300">
                    Complete your verification to unlock all portal features, connect with mentors, and access exclusive opportunities.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => router.push('/portal/verification')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
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

        {/* Quick Stats */}
        <StatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <FeaturedCourses courses={featuredCourses} />
            <UpcomingEvents events={upcomingEvents} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions actions={quickActions} />
            <RecentActivity activities={recentActivity} />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}