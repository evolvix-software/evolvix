"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { BookOpen, Star, TrendingUp } from 'lucide-react';
import { Course } from '@/store/features/student/studentSlice';

interface FeaturedCoursesProps {
  courses: Course[];
}

const iconMap = {
  BookOpen,
  TrendingUp
};

export function FeaturedCourses({ courses }: FeaturedCoursesProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <BookOpen className="w-5 h-5 text-[#635bff] dark:text-[#735fff]" />
          <span>Featured Courses</span>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No courses yet</p>
          </div>
        ) : (
          courses.map((course) => {
          const Icon = iconMap[course.icon as keyof typeof iconMap] || BookOpen;
          
          return (
            <div 
              key={course.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${course.gradient} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.rating}
                  </span>
                </div>
                <button className="px-3 py-1 bg-[#635bff] hover:bg-[#4f48cc] text-white text-sm rounded-lg transition-colors">
                  {course.action}
                </button>
              </div>
            </div>
          );
        }))}
      </CardContent>
    </Card>
  );
}

