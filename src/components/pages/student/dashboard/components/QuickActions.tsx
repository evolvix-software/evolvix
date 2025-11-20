"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Video, Award, BookOpen, GraduationCap } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Quick Links</CardTitle>
        <CardDescription className="text-muted-foreground">Quick access to key features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => router.push('/portal/student/classes')}
          variant="default"
          className="w-full justify-start"
        >
          <Video className="w-4 h-4 mr-2" />
          Join Live Class Now
        </Button>
        <Button
          onClick={() => router.push('/portal/student/scholarships')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted dark:hover:bg-secondary"
        >
          <Award className="w-4 h-4 mr-2" />
          Apply for Scholarship
        </Button>
        <Button
          onClick={() => router.push('/portal/student/courses')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted dark:hover:bg-secondary"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Browse Courses
        </Button>
        <Button
          onClick={() => router.push('/portal/student/profile')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted dark:hover:bg-secondary"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          View Certificates
        </Button>
      </CardContent>
    </Card>
  );
}

