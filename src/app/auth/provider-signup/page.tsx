"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Building2, User, Eye, EyeOff, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { providerService } from '@/data/mock/providerData';

const providerSignupSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProviderSignupFormData = z.infer<typeof providerSignupSchema>;

export default function ProviderSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderSignupFormData>({
    resolver: zodResolver(providerSignupSchema),
  });

  const onSubmit = async (data: ProviderSignupFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Create provider account
      const provider = providerService.createProvider({
        organizationName: data.organizationName,
        organizationSlug: data.organizationName.toLowerCase().replace(/\s+/g, '-'),
        contactEmail: data.email,
        contactPhone: data.phone,
        website: data.website || undefined,
        userId: `user_${Date.now()}`,
      });

      // Store provider in localStorage
      providerService.setCurrentProvider(provider);

      // Store registration data with provider role for signin compatibility
      localStorage.setItem('evolvix_registration', JSON.stringify({
        email: data.email,
        fullName: data.contactPerson,
        role: 'provider',
        roles: ['provider'],
        status: 'completed',
        isEmailVerified: false,
      }));

      // Redirect to survey
      router.push('/auth/provider-survey');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Column - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEyMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMjAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iODAwIiB5Mj0iMTIwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNjM1QkZGIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjNzM1RkZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM0NzRCNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-400/20 to-blue-600/30" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-white text-xl font-bold">Evolvix</span>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Empower Students Through Scholarships</h2>
            <p className="text-lg opacity-90">
              Join us in transforming lives by providing educational opportunities to deserving students
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-8 bg-card dark:bg-gray-900 auth-scroll">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">
              Scholarship Provider Sign Up
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your organization account to start awarding scholarships
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Organization Name"
              placeholder="Enter your organization name"
              icon={<Building2 className="w-4 h-4" />}
              error={errors.organizationName?.message}
              {...register('organizationName')}
            />

            <Input
              label="Contact Person"
              placeholder="Enter contact person name"
              icon={<User className="w-4 h-4" />}
              error={errors.contactPerson?.message}
              {...register('contactPerson')}
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone Number (Optional)"
              placeholder="Enter phone number"
              type="tel"
              icon={<Mail className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Website (Optional)"
              placeholder="https://yourwebsite.com"
              type="url"
              icon={<Mail className="w-4 h-4" />}
              error={errors.website?.message}
              {...register('website')}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Creating Account...' : 'Create Provider Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => router.push('/auth/signin')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

