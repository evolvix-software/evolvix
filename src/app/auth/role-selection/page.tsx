"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Building2, 
  Lightbulb, 
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

import { Button } from '@/components/forms/Button';
import { Card, CardContent } from '@/components/forms/Card';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Learn, grow, and connect with mentors and opportunities',
    icon: <GraduationCap className="w-6 h-6" />,
    features: ['Access to mentors', 'Learning resources', 'Career guidance', 'Networking opportunities']
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Share your expertise and guide the next generation',
    icon: <Users className="w-6 h-6" />,
    features: ['Share knowledge', 'Build reputation', 'Earn rewards', 'Make impact']
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Discover and invest in promising startups and ventures',
    icon: <TrendingUp className="w-6 h-6" />,
    features: ['Find startups', 'Due diligence', 'Investment tracking', 'Portfolio management']
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Find and hire talented professionals for your organization',
    icon: <Building2 className="w-6 h-6" />,
    features: ['Post jobs', 'Find talent', 'Company branding', 'Hiring tools']
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur Zone',
    description: 'Build, launch, and scale your innovative business ideas',
    icon: <Lightbulb className="w-6 h-6" />,
    features: ['Startup tools', 'Funding access', 'Mentor network', 'Growth resources']
  },
  {
    id: 'sponsor',
    title: 'Sponsor Portal',
    description: 'Support education and innovation through sponsorship programs',
    icon: <Heart className="w-6 h-6" />,
    features: ['Sponsor students', 'CSR programs', 'Impact tracking', 'Brand visibility']
  }
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    try {
      // Get stored registration data
      const storedData = localStorage.getItem('evolvix_registration');
      if (!storedData) {
        console.error('No registration data found');
        router.push('/auth/signup');
        return;
      }
      
      const registrationData = JSON.parse(storedData);
      console.log('Registration data:', registrationData);
      
      // Update registration data with selected role
      const completeRegistration = {
        ...registrationData,
        role: selectedRole,
        status: 'completed',
        roleSelectionDate: new Date().toISOString()
      };
      
      console.log('Complete registration:', completeRegistration);
      
      // Store complete registration (in real app, this would be API call)
      localStorage.setItem('evolvix_registration', JSON.stringify(completeRegistration));
      
      // Verify data was stored
      const verifyData = localStorage.getItem('evolvix_registration');
      console.log('Stored data verification:', verifyData);
      
      // Simulate API call to save role selection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to sign-in page
      console.log('Registration completed, redirecting to sign-in');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error saving role:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Column - Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEyMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMjAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iODAwIiB5Mj0iMTIwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY2QjQwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY4QzYwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM0NzRCNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-blue-600/30" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full" />
            </div>
            <span className="text-white text-xl font-bold">Evolvix</span>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-lg opacity-90">
              Select your role to unlock personalized features and opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Role Selection */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-8 bg-white dark:bg-gray-900 auth-scroll">
        <div className="w-full max-w-4xl py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-600 rounded-2xl mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Complete Your Registration</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select your role to complete your account setup, then sign in to access your portal
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
                  selectedRole === role.id
                    ? 'border-gray-900 shadow-lg scale-[1.02] bg-gray-50 dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${
                      selectedRole === role.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.title}</h3>
                        {selectedRole === role.id && (
                          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{role.description}</p>
                      <div className="space-y-2">
                        {role.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              selectedRole === role.id ? 'bg-gray-900' : 'bg-gray-400 dark:bg-gray-600'
                            }`} />
                            <span className={`text-xs ${
                              selectedRole === role.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'
                            }`}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full max-w-md h-12 font-medium transition-all duration-300 ${
                selectedRole
                  ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Setting up your account...' : 'Complete Registration'}
            </Button>
            
            {!selectedRole && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Please select a role to continue
              </p>
            )}
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <button
              type="button"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors duration-200"
              onClick={() => router.back()}
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
