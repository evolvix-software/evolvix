"use client";

import { Course } from '@/data/mock/coursesData';
import { CourseCard } from './CourseCard';
import { Star, TrendingUp, Sparkles } from 'lucide-react';

interface FeaturedCoursesProps {
  courses: Course[];
  title: string;
  icon?: React.ReactNode;
}

export function FeaturedCourses({ courses, title, icon }: FeaturedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {icon || <Star className="w-5 h-5 text-primary dark:text-primary" />}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.slice(0, 4).map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

