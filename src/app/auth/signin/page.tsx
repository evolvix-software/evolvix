"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { signIn, signInWithGoogle } from '@/lib/firebase';
import { authApi } from '@/lib/api/auth';
import { LottieAnimation } from '@/components/common/LottieAnimation';
import Image from 'next/image';
import { evolvixWhiteLogo } from '@/assets/assets';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
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
      // Sign in with Firebase
      const userCredential = await signIn(data.email, data.password);
      
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Sync with backend (this will link Firebase UID to existing MongoDB user)
      const response = await authApi.login({});
      
      const user = response.user;
      const survey = response.survey;
      
      // Store user data in localStorage for portal pages (backward compatibility)
      localStorage.setItem('evolvix_registration', JSON.stringify({
        email: user.email,
        fullName: user.fullName,
        role: user.primaryRole,
        roles: user.roles,
        status: 'completed',
        isEmailVerified: user.isEmailVerified,
      }));
      
      // Check if user needs role selection
      if (!user.primaryRole || user.roles.length === 0) {
        router.push('/auth/role-selection');
        return;
      }
      
      // Redirect provider/sponsor users directly to provider dashboard
      if (user.primaryRole === 'provider' || user.primaryRole === 'sponsor') {
        router.push('/portal/provider/dashboard');
        return;
      }
      
      // Check survey status for other roles
      if (survey && !survey.completed) {
        router.push(`/auth/survey?role=${user.primaryRole}`);
      } else {
        router.push(`/portal/${user.primaryRole}`);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle Firebase errors
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Invalid password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setIsLoading(true);
    setError('');
    
    try {
      // Sign in with Google via Firebase
      const response = await authApi.signInWithGoogle();
      
      const user = response.user;
      const survey = response.survey;
      
      // Store user data in localStorage for portal pages (backward compatibility)
      localStorage.setItem('evolvix_registration', JSON.stringify({
        email: user.email,
        fullName: user.fullName,
        role: user.primaryRole,
        roles: user.roles,
        status: 'completed',
        isEmailVerified: user.isEmailVerified,
      }));
      
      // Check if user needs role selection
      if (!user.primaryRole || user.roles.length === 0) {
        router.push('/auth/role-selection');
        return;
      }
      
      // Redirect provider/sponsor users directly to provider dashboard
      if (user.primaryRole === 'provider' || user.primaryRole === 'sponsor') {
        router.push('/portal/provider/dashboard');
        return;
      }
      
      // Check survey status for other roles
      if (survey && !survey.completed) {
        router.push(`/auth/survey?role=${user.primaryRole}`);
      } else {
        router.push(`/portal/${user.primaryRole}`);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left Column - Login Animation with Blue Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: '#3b82f6' }}>
        {/* Gradient Overlay - More subtle for login */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500" />
        
        {/* Geometric Decorative Elements - Security themed */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-2xl rotate-45 blur-2xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Logo */}
        <div className="absolute top-[-40px] left-8 z-20">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <Image 
              src={evolvixWhiteLogo} 
              alt="Evolvix" 
              width={160}
              height={50}
              className="h-auto w-auto drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Security Badge */}
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Secure Login</span>
            </div>
          </div>
        </div>

        {/* Lottie Animation - Centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-16 py-20">
          <div className="w-full h-full max-w-xl max-h-xl relative">
            {/* Animated Border Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-white/20 to-blue-400 rounded-3xl opacity-20 blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/20 shadow-2xl p-6">
              <LottieAnimation
                animationUrl="/animations/Login.json"
                animationId="VG6JPaMxag"
                className="w-full h-full"
                loop={true}
                autoplay={true}
                speed={1}
              />
            </div>
          </div>
        </div>

        {/* Content Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-12">
          <div className="bg-gradient-to-t from-black/40 via-black/20 to-transparent backdrop-blur-sm rounded-t-3xl p-8 border-t border-white/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Secure Access</h2>
                <p className="text-base text-white/90 leading-relaxed">
                  Your account is protected with industry-leading security. Sign in safely and continue where you left off.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signin Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Image 
                src={evolvixWhiteLogo} 
                alt="Evolvix" 
                width={280}
                height={90}
                className="h-24 w-auto"
                priority
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg ml-16">
              Sign in securely to access your account
            </p>
          </div>

          {/* Social Login Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 rounded-xl font-semibold text-base group"
              onClick={() => handleSocialLogin('google')}
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

          {/* Signin Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => router.push('/auth/forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-bold text-base rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              loading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {isLoading ? 'Signing in...' : 'Sign In Securely'}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                onClick={() => router.push('/auth/signup')}
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}