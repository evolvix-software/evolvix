"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const needsRoleSelection = searchParams.get('needsRoleSelection') === 'true';

        if (!token || !refreshToken) {
          setError('Missing authentication tokens. Please try again.');
          setIsLoading(false);
          return;
        }

        // Store in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('evolvix_access_token', token);
          localStorage.setItem('evolvix_refresh_token', refreshToken);
        }

        // Get current user to check role and survey status
        try {
          const user = await authApi.getCurrentUser();
          
          // Check if user needs role selection
          if (needsRoleSelection || !user.primaryRole || user.primaryRole === '') {
            router.push('/auth/role-selection');
            return;
          }

          // Check survey status (you might want to get this from the user object or make a separate call)
          // For now, redirect to portal
          router.push(`/portal/${user.primaryRole}`);
        } catch (err) {
          // If getting user fails, still redirect to role selection if needed
          if (needsRoleSelection) {
            router.push('/auth/role-selection');
          } else {
            setError('Failed to get user information. Please try again.');
            setIsLoading(false);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed. Please try again.');
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <CardTitle className="text-2xl font-bold">Completing Authentication</CardTitle>
            <CardDescription>
              Please wait while we complete your sign in...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <CardTitle className="text-2xl font-bold">Loading</CardTitle>
            <CardDescription>
              Please wait...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}

