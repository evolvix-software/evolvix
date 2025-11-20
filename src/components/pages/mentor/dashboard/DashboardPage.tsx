"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { checkVerificationStatus } from '@/store/features/verification/verificationThunks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  WelcomeHeader,
  StatsGrid,
  ChartsSection,
  QuickActions,
  NotificationsFeed,
  UpcomingSessions,
  PerformanceInsights,
} from './components';
import type { Notification } from './components/NotificationsFeed';
import { Calendar } from '@/components/common/calendar';
import { generateMockEventsForMonth } from '@/data/mock/calendarEvents';
import { useMemo } from 'react';
import { mockSubmissions } from '@/data/mock/assignments';

interface MentorStats {
  totalClasses: number;
  totalStudents: number;
  activeStudents: number;
  averageRating: number;
  pendingReviews: number;
  pendingPayments: number;
  totalRevenue: {
    thisMonth: number;
    thisYear: number;
    allTime: number;
  };
  upcomingClasses: number;
  pendingGrading: number;
  completionRate: number;
  responseTime: number; // in hours
  retentionRate: number;
}

const defaultStats: MentorStats = {
  totalClasses: 0,
  totalStudents: 0,
  activeStudents: 0,
  averageRating: 0,
  pendingReviews: 0,
  pendingPayments: 0,
  totalRevenue: {
    thisMonth: 0,
    thisYear: 0,
    allTime: 0,
  },
  upcomingClasses: 0,
  pendingGrading: 0,
  completionRate: 0,
  responseTime: 0,
  retentionRate: 0,
};

const verifiedStats: MentorStats = {
  totalClasses: 156,
  totalStudents: 24,
  activeStudents: 18,
  averageRating: 4.9,
  pendingReviews: 5,
  pendingPayments: 2340,
  totalRevenue: {
    thisMonth: 12500,
    thisYear: 145000,
    allTime: 425000,
  },
  upcomingClasses: 7,
  pendingGrading: 12,
  completionRate: 78,
  responseTime: 2.5,
  retentionRate: 85,
};

const defaultNotifications: Notification[] = [];

const defaultSessions: Array<{
  id: string;
  title: string;
  student: string;
  date: string;
  time: string;
}> = [];

const verifiedNotifications: Notification[] = [
  {
    id: '1',
    type: 'enrollment' as const,
    title: 'New student enrollment',
    description: 'Michael Brown enrolled in Live Full-Stack Web Development Bootcamp',
    time: '30 minutes ago',
  },
  {
    id: '2',
    type: 'assignment_submission' as const,
    title: 'Assignment submitted',
    description: 'Alex Johnson submitted "Personal Portfolio Page" assignment',
    time: '1 hour ago',
  },
  {
    id: '3',
    type: 'test_completion' as const,
    title: 'Test completed',
    description: 'Sarah Chen completed "JavaScript Fundamentals" test',
    time: '2 hours ago',
  },
  {
    id: '4',
    type: 'message' as const,
    title: 'Message requires response',
    description: 'David Wilson sent a message about project requirements',
    time: '3 hours ago',
  },
  {
    id: '5',
    type: 'payment' as const,
    title: 'Payment notification',
    description: 'Your payout for last week has been processed ($2,340)',
    time: '1 day ago',
  },
  {
    id: '6',
    type: 'announcement' as const,
    title: 'System announcement',
    description: 'New feature: Enhanced grading system now available',
    time: '2 days ago',
  },
];

const verifiedSessions = [
  {
    id: '1',
    title: 'React Development',
    student: 'Alex Johnson',
    date: 'Today',
    time: '3:00 PM',
  },
  {
    id: '2',
    title: 'Career Guidance',
    student: 'Sarah Chen',
    date: 'Tomorrow',
    time: '2:00 PM',
  },
];

export function MentorDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { verificationStatus } = useAppSelector((state) => state.verification);
  const { courses } = useAppSelector((state) => state.courses);
  const [userData, setUserData] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  
  // Get calendar events for current month
  const currentDate = new Date();
  const calendarEvents = generateMockEventsForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    'mentor'
  );

  // Calculate upcoming classes (next 7 days)
  const upcomingClassesCount = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= now && eventDate <= sevenDaysFromNow && 
             (event.type === 'course' || event.title.toLowerCase().includes('class'));
    }).length;
  }, [calendarEvents]);

  // Calculate pending grading (assignments + tests)
  const pendingGradingCount = useMemo(() => {
    // Count submissions that are submitted/late but not graded
    const pendingSubmissions = mockSubmissions.filter(
      sub => sub.status === 'submitted' || sub.status === 'late'
    ).length;
    
    // TODO: Add test completions that need grading
    // For now, just return assignment submissions
    return pendingSubmissions;
  }, []);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      if (parsedData.status === 'completed' && parsedData.role === 'mentor') {
        setUserData(parsedData);
        // Load verification status using Redux (same as student)
        dispatch(checkVerificationStatus(parsedData.email));
      } else {
        router.push('/auth/role-selection');
      }
    } else {
      router.push('/auth/signup');
    }
  }, [router, dispatch]);
  
  // Get mentor's courses for filter (after userData is set)
  const mentorCourses = useMemo(() => {
    if (!userData) return [];
    return courses.filter(c => c.instructor.id === userData.email || c.instructor.id === 'suhxil14@gmail.com');
  }, [courses, userData]);

  useEffect(() => {
    if (verificationStatus?.status === 'approved') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [verificationStatus]);

  if (!userData) {
    return (
      <Layout title="Dashboard" role="mentor">
        <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading dashboard...</h2>
        </div>
      </div>
      </Layout>
    );
  }

  // Merge verified stats with calculated values
  const stats = isVerified ? {
    ...verifiedStats,
    upcomingClasses: upcomingClassesCount,
    pendingGrading: pendingGradingCount,
  } : {
    ...defaultStats,
    upcomingClasses: upcomingClassesCount,
    pendingGrading: pendingGradingCount,
  };
  
  const notifications = isVerified ? verifiedNotifications : defaultNotifications;
  const sessions = isVerified ? verifiedSessions : defaultSessions;

  return (
    <Layout title="Dashboard" role="mentor">
      <div className="space-y-6">
        <WelcomeHeader userName={userData.fullName || 'Mentor'} isVerified={isVerified} />

        {/* Verification Status Cards - Same UI as Student Portal */}
        {/* TODO: Re-enable verification banner after UI is complete */}
        {/* {verificationStatus?.status === 'incomplete' && (
          <Card className="border-0 shadow-sm bg-primary/10 dark:bg-primary/20 border-[#635bff]/20 dark:border-[#635bff]/40 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary dark:text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary dark:text-primary">
                    Become a Verified Mentor
                  </h3>
                  <p className="text-primary dark:text-primary">
                    Complete your verification to unlock all portal features, connect with students, and start earning.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => router.push('/portal/verification')}
                    className="bg-primary hover:bg-[#4f48cc] text-white"
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

        {verificationStatus?.status === 'pending' && (
          <Card className="border-0 shadow-sm bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    Verification Under Review
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Your verification is being reviewed. You'll be notified once approved. Limited features are available until then.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Pending</span>
                  </div>
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
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Verification Rejected
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Your verification was rejected. Please review the requirements and submit again to unlock all features.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => router.push('/portal/verification')}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Resubmit Verification
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
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Verification Approved
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your account is verified! All features are now unlocked.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show limited content when not verified, full content when verified */}
        {isVerified ? (
          <>
            <StatsGrid stats={stats} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChartsSection />
                <PerformanceInsights />
                <NotificationsFeed notifications={notifications} />
              </div>
              <div className="space-y-6">
                <QuickActions isVerified={isVerified} />
                <UpcomingSessions sessions={sessions} />
              </div>
            </div>
            {/* Calendar - Full Width */}
            <div className="w-full">
              <Calendar 
                events={calendarEvents}
                role="mentor"
                courses={mentorCourses.map(c => ({ id: c.id, title: c.title }))}
              />
            </div>
          </>
        ) : (
          // TODO: Re-enable verification required message after UI is complete
          // Temporarily showing full content even when not verified
          <>
            <StatsGrid stats={stats} />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ChartsSection />
                <PerformanceInsights />
                <NotificationsFeed notifications={notifications} />
              </div>
              <div className="space-y-6">
                <QuickActions isVerified={isVerified} />
                <UpcomingSessions sessions={sessions} />
              </div>
            </div>
            {/* Calendar - Full Width */}
            <div className="w-full">
              <Calendar 
                events={calendarEvents}
                role="mentor"
                courses={mentorCourses.map(c => ({ id: c.id, title: c.title }))}
              />
            </div>
            {/* TODO: Re-enable verification required message after UI is complete */}
            {/* <Card className="border-0 shadow-sm bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                    Complete Verification to Access All Features
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Once verified, you'll be able to view your dashboard statistics, manage classes, connect with students, and access all mentor features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          </>
        )}
                  </div>
    </Layout>
  );
}

