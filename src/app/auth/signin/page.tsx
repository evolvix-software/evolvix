"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Check if user has completed registration
      const storedData = localStorage.getItem('evolvix_registration');
      if (!storedData) {
        setError('No account found. Please sign up first.');
        setIsLoading(false);
        return;
      }
      
      const registrationData = JSON.parse(storedData);
      
      // Verify credentials (in real app, this would be API call)
      if (registrationData.email !== data.identifier && registrationData.phone !== data.identifier) {
        setError('Invalid email or phone number.');
        setIsLoading(false);
        return;
      }
      
      if (registrationData.password !== data.password) {
        setError('Invalid password.');
        setIsLoading(false);
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to appropriate portal based on role
      if (registrationData.status === 'completed' && registrationData.role) {
        console.log('Login successful, redirecting to portal:', registrationData.role);
        router.push(`/portal/${registrationData.role}`);
      } else {
        console.log('Registration incomplete, redirecting to role selection');
        router.push('/auth/role-selection');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google') => {
    console.log(`Sign in with ${provider}`);
    // Implement social login logic here
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
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg opacity-90">
              Continue your journey of growth and discovery with Evolvix.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Signin Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-8 bg-white dark:bg-gray-900 auth-scroll">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-600 rounded-2xl mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue your journey
            </p>
          </div>

          {/* Social Login Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
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
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                loginMethod === 'phone'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </button>
          </div>

          {/* Signin Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label={loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              placeholder={
                loginMethod === 'email' 
                  ? 'Enter your email address' 
                  : 'Enter your phone number'
              }
              type={loginMethod === 'email' ? 'email' : 'tel'}
              icon={loginMethod === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              error={errors.identifier?.message}
              {...register('identifier')}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
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

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                onClick={() => router.push('/auth/forgot-password')}
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium"
              loading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-gray-900 dark:text-white font-medium hover:underline"
                onClick={() => router.push('/auth/signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}