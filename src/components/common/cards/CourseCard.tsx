/**
 * Reusable Course Card Component
 * Used in Browse Courses, My Courses, Dashboard, DSA Recommendations
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Users, CheckCircle, Play, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CourseTypeBadge } from '../features/CourseTypeBadge';
import { TimeLimitIndicator } from '../features/TimeLimitIndicator';
import { Course } from '@/interfaces/course';
import { cn } from '@/utils';

export interface CourseCardProps {
  course: Course;
  variant?: 'browse' | 'my-courses' | 'compact' | 'recommended';
  showProgress?: boolean;
  progress?: number;
  enrollmentDate?: string;
  onEnroll?: (courseId: string) => void;
  onContinue?: (courseId: string) => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = 'browse',
  showProgress = false,
  progress = 0,
  enrollmentDate,
  onEnroll,
  onContinue,
  className,
}) => {
  const isEnrolled = showProgress;
  const isFree = course.isFree || course.price === 0;

  const renderPrice = () => {
    if (isFree) {
      return (
        <Badge variant="success" size="sm">
          Free
        </Badge>
      );
    }
    return (
      <span className="text-2xl font-bold text-gray-900">
        ${course.price}
      </span>
    );
  };

  const renderActionButton = () => {
    if (variant === 'my-courses' && isEnrolled) {
      return (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onContinue?.(course.id)}
          leftIcon={<Play className="w-4 h-4" />}
        >
          Continue Learning
        </Button>
      );
    }

    if (variant === 'browse' && !isEnrolled) {
      return (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onEnroll?.(course.id)}
        >
          {isFree ? 'Enroll Free' : 'Enroll Now'}
        </Button>
      );
    }

    return null;
  };

  return (
    <Card
      variant="elevated"
      hover
      clickable={variant !== 'my-courses'}
      className={cn('overflow-hidden', className)}
    >
      <Link href={`/portal/student/courses/${course.id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <Image
            src={course.thumbnail || course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <CourseTypeBadge courseType={course.courseType} size="sm" />
          </div>
          {course.scholarshipAvailable && course.courseType === 'bootcamp' && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" size="sm">
                Scholarship Available
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/portal/student/courses/${course.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.shortDescription || course.description}
          </p>
        </Link>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-gray-500">({course.ratingCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrolledCount}</span>
          </div>
        </div>

        {showProgress && progress > 0 && (
          <div className="mb-3">
            <ProgressBar value={progress} variant="primary" showLabel />
          </div>
        )}

        {enrollmentDate && (
          <div className="mb-3">
            <TimeLimitIndicator
              courseType={course.courseType}
              enrollmentDate={enrollmentDate}
              timeLimitDays={course.timeLimitDays}
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              {course.instructor.avatar && (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              )}
            </div>
            <span className="text-sm text-gray-700">
              {course.instructor.name}
            </span>
          </div>
        </div>

        {variant === 'browse' && (
          <div className="flex items-center justify-between mb-3">
            {renderPrice()}
            {course.installmentEnabled && !isFree && (
              <Badge variant="info" size="sm">
                Installments Available
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {renderActionButton() && (
        <CardFooter className="p-4 pt-0">
          {renderActionButton()}
        </CardFooter>
      )}
    </Card>
  );
};

