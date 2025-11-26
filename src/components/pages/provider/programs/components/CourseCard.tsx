"use client";

import { Course } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Eye,
  Link as LinkIcon,
  TrendingUp,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
}

export function CourseCard({ course, viewMode, onClick }: CourseCardProps) {
  const instructorName = course.instructor || 'Unknown';

  const progressPercentage = (course.enrolledCount ?? 0) > 0 ? Math.min(100, ((course.enrolledCount ?? 0) / 100) * 100) : 0;

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {instructorName}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {course.duration}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.enrolledCount ?? 0} enrolled
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Scholarship Slots</p>
                  <p className="text-lg font-semibold text-primary">
                    {course.scholarshipSlotsAvailable} / {course.scholarshipSlots}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Instructor
            </span>
            <span className="font-semibold text-foreground">{instructorName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Duration
            </span>
            <span className="font-semibold text-foreground">{course.duration}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-4 h-4" />
              Enrolled
            </span>
            <span className="font-semibold text-foreground">{course.enrolledCount ?? 0}</span>
          </div>
        </div>

        {/* Scholarship Slots */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground flex items-center gap-1">
              <Award className="w-4 h-4 text-primary" />
              Scholarship Slots
            </span>
            <span className="text-sm font-semibold text-primary">
              {course.scholarshipSlotsAvailable} / {course.scholarshipSlots} available
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((course.scholarshipSlots - course.scholarshipSlotsAvailable) / course.scholarshipSlots) * 100}%` }}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Course Price</span>
          <span className="text-lg font-bold text-foreground">₹{(course.price / 1000).toFixed(0)}K</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Button>
          {course.scholarshipSlotsAvailable > 0 && (
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              <LinkIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

