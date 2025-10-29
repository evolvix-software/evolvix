"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { 
  WelcomeHeader,
  VerificationBanner,
  StatsGrid,
  ChartsSection,
  QuickActions,
  NotificationsFeed,
  UpcomingSessions,
} from './dashboard';
import { VerificationStatusHelper } from '@/components/mentor/components/common/VerificationStatusHelper';

interface MentorStats {
  totalClasses: number;
  totalStudents: number;
  averageRating: number;
  pendingReviews: number;
  pendingPayments: number;
}

const defaultStats: MentorStats = {
  totalClasses: 0,
  totalStudents: 0,
  averageRating: 0,
  pendingReviews: 0,
  pendingPayments: 0,
};

const verifiedStats: MentorStats = {
  totalClasses: 156,
  totalStudents: 24,
  averageRating: 4.9,
  pendingReviews: 5,
  pendingPayments: 2340,
};

const defaultNotifications: Array<{
  id: string;
  type: 'assignment' | 'milestone' | 'payment';
  title: string;
  description: string;
  time: string;
}> = [];

const defaultSessions: Array<{
  id: string;
  title: string;
  student: string;
  date: string;
  time: string;
}> = [];

const verifiedNotifications = [
  {
    id: '1',
    type: 'assignment' as const,
    title: 'New student assignment',
    description: 'Alex Johnson has been assigned to your mentorship',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'milestone' as const,
    title: 'Project milestone update',
    description: 'Sarah Chen\'s project has reached milestone 3',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'payment' as const,
    title: 'Payment processed',
    description: 'Your payout for last week has been processed',
    time: '1 day ago',
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

export default function MentorDashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.status === 'completed' && parsedData.role === 'mentor') {
        setUserData(parsedData);

        // Check verification status
        const verificationKey = `evolvix_mentor_verification_${parsedData.email}`;
        const verificationData = localStorage.getItem(verificationKey);
        if (verificationData) {
          const verification = JSON.parse(verificationData);
          setVerificationStatus(verification.status || 'incomplete');
          setIsVerified(verification.status === 'approved');
        }
      } else {
        router.push('/auth/role-selection');
      }
    } else {
      router.push('/auth/signup');
    }
  }, [router]);

  if (!userData) {
    return (
      <Layout title="Dashboard" role="mentor">
        <div className="flex items-center justify-center h-64">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading dashboard...</h2>
        </div>
      </div>
      </Layout>
    );
  }

  const stats = isVerified ? verifiedStats : defaultStats;
  const notifications = isVerified ? verifiedNotifications : defaultNotifications;
  const sessions = isVerified ? verifiedSessions : defaultSessions;

  return (
    <Layout title="Dashboard" role="mentor">
      <div className="space-y-6">
        <WelcomeHeader userName={userData.fullName || 'Mentor'} isVerified={isVerified} />

        {!isVerified ? (
          <>
            <VerificationBanner verificationStatus={verificationStatus} />
            {userData?.email && (
              <VerificationStatusHelper 
                email={userData.email} 
                onStatusChange={() => {
                  // Reload verification status
                  const verificationKey = `evolvix_mentor_verification_${userData.email}`;
                  const verificationData = localStorage.getItem(verificationKey);
                  if (verificationData) {
                    const verification = JSON.parse(verificationData);
                    setVerificationStatus(verification.status || 'incomplete');
                    setIsVerified(verification.status === 'approved');
                  }
                }}
              />
            )}
          </>
        ) : (
          <>
            <StatsGrid stats={stats} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
                <ChartsSection />
                <NotificationsFeed notifications={notifications} />
          </div>

          <div className="space-y-6">
                <QuickActions isVerified={isVerified} />
                <UpcomingSessions sessions={sessions} />
                  </div>
                </div>
          </>
        )}
                  </div>
    </Layout>
  );
}
