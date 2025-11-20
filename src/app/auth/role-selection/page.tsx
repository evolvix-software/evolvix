"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks';
import { selectRole } from '@/store/features/auth/authSlice';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Building2, 
  Lightbulb, 
  Heart,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/common/forms/Button';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Learn, grow, and connect with mentors and opportunities',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    color: 'text-blue-600',
    features: ['Access to mentors', 'Learning resources', 'Career guidance', 'Networking opportunities']
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Share your expertise and guide the next generation',
    icon: Users,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    color: 'text-purple-600',
    features: ['Share knowledge', 'Build reputation', 'Earn rewards', 'Make impact']
  },
  {
    id: 'investor',
    title: 'Investor',
    description: 'Discover and invest in promising startups and ventures',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-50',
    color: 'text-orange-600',
    features: ['Find startups', 'Due diligence', 'Investment tracking', 'Portfolio management']
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Find and hire talented professionals for your organization',
    icon: Building2,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    color: 'text-green-600',
    features: ['Post jobs', 'Find talent', 'Company branding', 'Hiring tools']
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Build, launch, and scale your innovative business ideas',
    icon: Lightbulb,
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
    color: 'text-pink-600',
    features: ['Startup tools', 'Funding access', 'Mentor network', 'Growth resources']
  },
  {
    id: 'sponsor',
    title: 'Sponsor',
    description: 'Support education and innovation through sponsorship programs',
    icon: Heart,
    gradient: 'from-red-500 to-pink-500',
    bgGradient: 'from-red-50 to-pink-50',
    color: 'text-red-600',
    features: ['Sponsor students', 'CSR programs', 'Impact tracking', 'Brand visibility']
  }
];

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    try {
      const result = await dispatch(selectRole(selectedRole));
      
      if (selectRole.fulfilled.match(result)) {
        const user = result.payload.user;
        
        // Redirect to survey or portal based on survey status
        // You might want to check survey status here
        router.push(`/auth/survey?role=${selectedRole}`);
      }
    } catch (error) {
      console.error('Error selecting role:', error);
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative h-full overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-card rounded-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Evolvix
            </span>
          </div>
          
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Main Content */}
        <div className="min-h-screen flex items-center justify-center p-6 md:p-8 pb-20">
          <div className="w-full max-w-6xl">
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-foreground mb-4">
                Choose Your Path
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Select your role to unlock personalized features and start your journey with Evolvix
              </p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`
                      relative group cursor-pointer rounded-2xl p-6 transition-all duration-300
                      border-2 bg-card dark:bg-gray-800
                      ${isSelected 
                        ? 'border-indigo-500 shadow-2xl scale-105' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl'
                      }
                    `}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                      ${isSelected 
                        ? `bg-gradient-to-br ${role.gradient}` 
                        : `bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600`
                      }
                    `}>
                      <Icon className={`w-7 h-7 ${isSelected ? 'text-white' : role.color}`} />
                    </div>

                    {/* Content */}
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-foreground'
                    }`}>
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {role.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-indigo-500' : 'bg-gray-400'
                          }`} />
                          <span className={`text-xs ${
                            isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`
                  px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300
                  ${selectedRole
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl scale-100 hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }
                `}
                loading={false}
              >
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
