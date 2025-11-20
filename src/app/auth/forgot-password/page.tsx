"use client";

import { useState } from "react";
import Link from "next/link";
import { passwordApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await passwordApi.forgotPassword({ email });
      
      if (response.success) {
        setIsEmailSent(true);
        
        // In development mode, the API returns the token
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
            {resetToken && process.env.NODE_ENV === 'development' && (
              <Alert className="mt-4">
                <AlertDescription className="break-all">
                  <strong>Development Mode:</strong> Reset token: {resetToken}
                  <br />
                  <a 
                    href={`/auth/reset-password?token=${resetToken}&email=${email}`}
                    className="text-primary hover:underline mt-2 block"
                  >
                    Click here to reset password
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                If you don't see the email, check your spam folder or try again.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsEmailSent(false);
                setEmail("");
              }}
            >
              Try different email
            </Button>
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-4">
            <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-blue-600 rounded-full" />
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Link 
                href="/auth/login" 
                className="text-primary hover:underline flex items-center justify-center space-x-1 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
