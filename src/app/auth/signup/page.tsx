"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { signupUser } from '@/store/features/auth/authSlice';
import { authApi } from '@/lib/api';

import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { LottieAnimation } from '@/components/common/LottieAnimation';

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
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left Column - Growth Animation with Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>
        {/* Primary Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" />
        
        {/* Animated Decorative Elements - Blue themed */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-300/15 rounded-full blur-2xl" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/40 group-hover:scale-110 group-hover:bg-white/35 transition-all duration-300">
              <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ArrowRight className="w-4 h-4 text-blue-600 rotate-[-45deg]" />
              </div>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">Evolvix</span>
          </div>
        </div>

        {/* Stats Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-2.5 border-2 border-white/30 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-white/80 rounded-full border-2 border-white shadow-md" />
                ))}
              </div>
              <span className="text-white text-sm font-bold">10K+ Users</span>
            </div>
          </div>
        </div>

        {/* Lottie Animation - Larger and more prominent */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-12 py-16">
          <div className="w-full h-full max-w-3xl max-h-3xl relative">
            {/* Animated Glow Rings - Blue themed */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/20 via-blue-300/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-blue-500/30 rounded-full blur-2xl" />
            
            <div className="relative w-full h-full bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/30 shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500">
              <LottieAnimation
                animationUrl="/animations/analytical-thinking-illustration.json"
                animationId="VG6JPaMxag"
                className="w-full h-full"
                loop={true}
                autoplay={true}
                speed={1}
              />
            </div>
          </div>
        </div>

        {/* Content Overlay - Bottom with Growth Message */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-12">
          <div className="bg-gradient-to-t from-black/50 via-black/30 to-transparent backdrop-blur-md rounded-t-3xl p-8 border-t-2 border-white/30">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/40 flex-shrink-0 shadow-xl">
                <ArrowRight className="w-7 h-7 text-white rotate-[-45deg]" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Start Your Journey</h2>
                <p className="text-base text-white/95 leading-relaxed font-medium">
                  Join a community of innovators, creators, and achievers. Unlock opportunities, connect with mentors, and accelerate your growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <ArrowRight className="w-6 h-6 text-white rotate-[-45deg]" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Evolvix</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                Join Evolvix
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg ml-20">
              Create your account and unlock endless possibilities
            </p>
          </div>

          {/* Social Login Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 rounded-xl font-semibold text-base group"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              icon={<User className="w-5 h-5" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              {...register('password')}
            />

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-bold text-base rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              loading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {isLoading ? 'Creating Account...' : 'Start Your Journey'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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