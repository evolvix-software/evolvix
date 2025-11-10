"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Clock, Star, Users, CheckCircle } from 'lucide-react';
import { Course } from '@/data/mock/coursesData';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { enrollCourse } from '@/store/features/courses/coursesSlice';
import { useRouter } from 'next/navigation';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { enrolledCourses } = useAppSelector(state => state.courses);
  const kycStatus = useAppSelector(state => state.verification.kycStatus);
  const status = kycStatus?.status || 'pending';
  
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = enrolledCourses.some(e => e.courseId === course.id);
  const enrollment = enrolledCourses.find(e => e.courseId === course.id);

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isEnrolled) {
      // TODO: Re-enable verification check after UI is complete
      // Check verification status
      // if (status !== 'verified') {
      //   alert('Please complete your verification before enrolling in courses.');
      //   router.push('/portal/verification');
      //   return;
      // }
      
      setIsEnrolling(true);
      setTimeout(() => {
        dispatch(enrollCourse(course.id));
        const stored = localStorage.getItem('evolvix_enrollments');
        const enrollments = stored ? JSON.parse(stored) : [];
        enrollments.push({
          courseId: course.id,
          enrolledAt: new Date().toISOString(),
          progress: 0,
          completed: false,
          completedLessons: []
        });
        localStorage.setItem('evolvix_enrollments', JSON.stringify(enrollments));
        setIsEnrolling(false);
        alert('Successfully enrolled in course!');
      }, 1000);
    } else {
      router.push(`/portal/student/courses/${course.id}`);
    }
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 border border-border cursor-pointer overflow-hidden"
      onClick={() => router.push(`/portal/student/courses/${course.id}`)}
    >
      {/* Compact Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-card/20 backdrop-blur-sm text-card-foreground px-2 py-1 rounded-full text-xs font-semibold">
            Enrolled
          </div>
        )}
        <div className="absolute top-3 left-3 bg-card/20 backdrop-blur-sm text-card-foreground px-2 py-1 rounded-full text-xs font-semibold uppercase">
          {course.level}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Minimal Title */}
        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Quick Stats Row */}
        <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{course.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{course.enrolledCount}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        {isEnrolled && enrollment && (
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">{enrollment.progress}% Complete</p>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-3 border-t border-border">
          <button 
            className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
