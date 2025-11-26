"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Building2, Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your hiring today
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Premium</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

