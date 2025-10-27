"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/forms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { LogOut, User, Shield, Settings, Bell, Search, GraduationCap, Users, TrendingUp, Building2, Lightbulb, Heart } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated] = useState(true); // Mock authentication state
  const [userRole, setUserRole] = useState<string>('student');

  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setUserRole(role);
    }
  }, [searchParams]);

  const handleLogout = () => {
    router.push('/auth/signin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please sign in to access the dashboard</p>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Mock user data
  const user = {
    fullName: 'John Doe',
    email: 'john@example.com',
    role: userRole,
    verificationLevel: 0,
    isVerified: false,
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="w-5 h-5" />;
      case 'mentor': return <Users className="w-5 h-5" />;
      case 'investor': return <TrendingUp className="w-5 h-5" />;
      case 'employer': return <Building2 className="w-5 h-5" />;
      case 'entrepreneur': return <Lightbulb className="w-5 h-5" />;
      case 'sponsor': return <Heart className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'mentor': return 'Mentor';
      case 'investor': return 'Investor';
      case 'employer': return 'Employer';
      case 'entrepreneur': return 'Entrepreneur';
      case 'sponsor': return 'Sponsor';
      default: return 'User';
    }
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.fullName} • {getRoleTitle(user.role)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 overflow-y-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                {getRoleIcon(user.role)}
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-sm text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="text-sm text-gray-900">{getRoleTitle(user.role)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Verification</span>
              </CardTitle>
              <CardDescription>Your verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Level</p>
                <p className="text-sm text-gray-900">Level {user.verificationLevel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className={`text-sm ${user.isVerified ? 'text-green-600' : 'text-gray-500'}`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Upgrade Verification
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Verify Account
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your recent actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No recent activity yet</p>
              <p className="text-sm">Complete your profile to get started</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
