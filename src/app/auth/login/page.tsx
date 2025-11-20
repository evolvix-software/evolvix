"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginUser } from '@/store/features/auth/authSlice';
import { authApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Extract form data immediately before async operations
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;
    
    // Validate inputs
    if (!identifier || !password) {
      return;
    }
    
    try {
      const result = await dispatch(loginUser({ identifier, password }));
      
      if (loginUser.fulfilled.match(result)) {
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
      }
    } catch (err) {
      // Error is handled by Redux state
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await authApi.signInWithGoogle();
      const user = result.user;
      const survey = result.survey;
      
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
    } catch (err) {
      console.error('Google login error:', err);
      // Error handling can be improved with user-facing error messages
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEyMDAiIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMjAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzBfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iODAwIiB5Mj0iMTIwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkY2QjQwIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjRkY4QzYwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM0NzRCNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-pink-400/20 to-blue-600/30" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-card rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-gradient-to-br from-primary to-blue-600 rounded-full" />
            </div>
            <span className="text-white text-xl font-bold">Evolvix</span>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg opacity-90">
              Continue your journey of growth and discovery
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-4">
              <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-primary to-blue-600 rounded-full" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue your journey
            </p>
          </div>

          <Card className="lg:shadow-none lg:border-0">
            <CardHeader className="hidden lg:block space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Social Login */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-200 dark:border-gray-700"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="identifier"
                      name="identifier"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col">
              <div className="text-center text-sm w-full">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
