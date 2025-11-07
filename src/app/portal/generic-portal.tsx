"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { 
  LogOut, 
  TrendingUp, 
  Search,
  Bell,
  Settings,
  Building2,
  Lightbulb,
  Heart
} from 'lucide-react';

interface PortalProps {
  role: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function GenericPortal({ role, title, icon, color, description }: PortalProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get stored registration data
    const storedData = localStorage.getItem('evolvix_registration');
    console.log(`${role} portal - stored data:`, storedData);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log(`${role} portal - parsed data:`, parsedData);
      
      if (parsedData.status === 'completed' && parsedData.role === role) {
        setUserData(parsedData);
      } else {
        console.log('Registration not completed or wrong role, redirecting to role selection');
        router.push('/auth/role-selection');
      }
    } else {
      console.log('No registration data found, redirecting to signup');
      router.push('/auth/signup');
    }
  }, [router, role]);

  const handleLogout = () => {
    localStorage.removeItem('evolvix_registration');
    router.push('/auth/signin');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">Welcome, {userData.fullName}</p>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {title}!</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="border-0 shadow-sm max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {icon}
            </div>
            <CardTitle className="text-2xl">Portal Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you the best {role} experience. 
              This portal will be available soon with all the features you need.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What to expect:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized dashboard</li>
                <li>• Role-specific tools and features</li>
                <li>• Advanced analytics and insights</li>
                <li>• Integration with other Evolvix services</li>
              </ul>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button variant="outline">
                Get Notified
              </Button>
              <Button>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
