"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Clock, Star, Users, CheckCircle } from 'lucide-react';
import { Course } from '@/data/mock/coursesData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
      // Check verification status
      if (status !== 'verified') {
        alert('Please complete your verification before enrolling in courses.');
        router.push('/portal/verification');
        return;
      }
      
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
      className="group hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden"
      onClick={() => router.push(`/portal/student/courses/${course.id}`)}
    >
      {/* Compact Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-[#635bff] to-blue-600 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badges */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
            Enrolled
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold uppercase">
          {course.level}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Minimal Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#635bff] transition-colors">
          {course.title}
        </h3>

        {/* Quick Stats Row */}
        <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400 mb-4">
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
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-[#635bff] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">{enrollment.progress}% Complete</p>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <button 
            className="w-full px-4 py-2 bg-[#635bff] hover:bg-[#4f48cc] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
