"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signupUser } from '@/store/features/auth/authSlice';
import { authApi } from '@/lib/api';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await dispatch(signupUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }));
      
      if (signupUser.fulfilled.match(result)) {
        const user = result.payload.user;
        const survey = result.payload.survey;
        
        // Check if user needs role selection
        if (!user.primaryRole || user.primaryRole === '') {
          router.push('/auth/role-selection');
          return;
        }
        
        // Check survey status
        if (survey && !survey.completed) {
          router.push(`/auth/survey?role=${user.primaryRole}`);
        } else {
          router.push(`/portal/${user.primaryRole}`);
        }
      } else if (signupUser.rejected.match(result)) {
      // Error is handled by Redux state
        const errorMessage = result.payload as string;
        console.error('Signup error:', errorMessage);
        
        // If database connection error, show helpful message
        if (errorMessage.includes('Database connection') || errorMessage.includes('503')) {
          alert(
            'Database connection error. Please ensure:\n\n' +
            '1. MongoDB is running\n' +
            '2. Your IP is whitelisted in MongoDB Atlas\n' +
            '3. MongoDB connection string is correct\n\n' +
            'Check the backend logs for more details.'
          );
          return;
        }
        
        // If email already exists, offer to redirect to login
        if (errorMessage.includes('already exists') || errorMessage.includes('sign in instead')) {
          const shouldLogin = window.confirm(
            `${errorMessage}\n\nWould you like to sign in instead?`
          );
          if (shouldLogin) {
            router.push('/auth/signin');
          }
        }
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      // Error is handled by Redux state
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await authApi.signInWithGoogle();
      if (response?.user) {
        // Check if user needs role selection
        if (!response.user.primaryRole || response.user.primaryRole === '') {
          router.push('/auth/role-selection');
        } else {
          // Check survey status
          if (response.survey && !response.survey.completed) {
            router.push(`/auth/survey?role=${response.user.primaryRole}`);
      } else {
            router.push(`/portal/${response.user.primaryRole}`);
          }
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      // Show error to user
      alert(error.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Column - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEyMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMjAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iODAwIiB5Mj0iMTIwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY2QjQwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY4QzYwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM0NzRCNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/20 via-pink-400/20 to-blue-600/30" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-gradient-to-br from-[#635bff] to-blue-600 rounded-full" />
            </div>
            <span className="text-white text-xl font-bold">Evolvix</span>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Join Evolvix & Start Growing!</h2>
            <p className="text-lg opacity-90">
              Create an account to discover opportunities and connect with amazing people
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-8 bg-white dark:bg-gray-900 auth-scroll">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#635bff] to-blue-600 rounded-2xl mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-br from-[#635bff] to-blue-600 rounded-full" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join Evolvix & Start Growing!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create an account to discover opportunities and connect with amazing people
            </p>
          </div>

          {/* Social Login Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with email</span>
            </div>
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
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User className="w-4 h-4" />}
              error={errors.fullName?.message}
              {...register('fullName')}
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
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already a member?{' '}
              <button
                type="button"
                className="text-gray-900 dark:text-white font-medium hover:underline"
                onClick={() => router.push('/auth/signin')}
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}