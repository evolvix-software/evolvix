"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatCard } from '@/components/provider/common/StatCard';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Link as LinkIcon,
} from 'lucide-react';
import { Course } from '@/data/mock/providerData';

interface OverviewTabProps {
  course: Course;
}

export function OverviewTab({ course }: OverviewTabProps) {
  const instructorName = typeof course.instructor === 'string' ? course.instructor : (course.instructor as any)?.name || 'Unknown';
  const instructorBio = (course.instructor as any)?.bio || 'Experienced instructor with expertise in the field.';
  const instructorPhoto = (course.instructor as any)?.photo || null;

  // Mock data for course metadata
  const courseMode = 'hybrid'; // Recorded, Live, or Hybrid
  const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const endDate = new Date(startDate.getTime() + 12 * 7 * 24 * 60 * 60 * 1000); // 12 weeks later
  const language = 'English';
  const level = 'Intermediate';
  const averageCompletionRate = 75; // Mock percentage

  return (
    <div className="space-y-6">
      {/* Course Banner */}
      {course.thumbnail && (
        <Card>
          <CardContent className="p-0">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Students"
          value={course.enrolledCount || 0}
          icon={<Users className="w-5 h-5" />}
          trend={undefined}
        />
        <StatCard
          title="Scholarship Slots"
          value={`${course.scholarshipSlotsAvailable} / ${course.scholarshipSlots}`}
          icon={<Award className="w-5 h-5" />}
          trend={undefined}
        />
        <StatCard
          title="Applications"
          value={course.appliedForScholarships || 0}
          icon={<BookOpen className="w-5 h-5" />}
          trend={undefined}
        />
        <StatCard
          title="Avg Completion"
          value={`${averageCompletionRate}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Description */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">About This Course</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Course Metadata */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">Course Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <p className="font-semibold text-foreground capitalize">{courseMode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tuition Fee</p>
                    <p className="font-semibold text-foreground">₹{(course.price / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-semibold text-foreground">{language}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-semibold text-foreground">{level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold text-foreground">{startDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentor Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">Instructor</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                {instructorPhoto ? (
                  <img
                    src={instructorPhoto}
                    alt={instructorName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{instructorName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{instructorBio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Link Scholarship Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                <Users className="w-4 h-4 mr-2" />
                View Students
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Progress
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
                <Award className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

