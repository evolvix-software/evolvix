"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PortalPageProps {
  params: {
    role: string;
  };
}

export default function PortalPage({ params }: PortalPageProps) {
  const router = useRouter();
  const { role } = params;

  useEffect(() => {
    // Check if user has completed registration
    const storedData = localStorage.getItem('evolvix_registration');
    if (!storedData) {
      router.push('/auth/signin');
      return;
    }

    const registrationData = JSON.parse(storedData);
    if (registrationData.status !== 'completed' || registrationData.role !== role) {
      router.push('/auth/role-selection');
      return;
    }

    // Redirect to specific portal based on role
    switch (role) {
      case 'student':
        router.push('/portal/student');
        break;
      case 'mentor':
        router.push('/portal/mentor');
        break;
      case 'investor':
        router.push('/portal/investor');
        break;
      case 'employer':
        router.push('/portal/employer');
        break;
      case 'entrepreneur':
        router.push('/portal/entrepreneur');
        break;
      case 'sponsor':
      case 'provider':
        // Redirect sponsor/provider to provider dashboard
        router.push('/portal/provider/dashboard');
        break;
      default:
        router.push('/auth/role-selection');
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to your {role} portal</p>
      </div>
    </div>
  );
}
