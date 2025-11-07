"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Edit, Trash2, Users, Star, BookOpen, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { Course } from '@/data/mock/coursesData';

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onManageProjects?: () => void;
}

export function CourseCard({ course, onEdit, onDelete, onManageProjects }: CourseCardProps) {
  const router = useRouter();
  
  const courseTypeColor = course.courseType === 'live' 
    ? 'bg-blue-600' 
    : 'bg-purple-600';
  
  const categoryColors: Record<string, string> = {
    'development': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'design': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    'business': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'data-science': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'other': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
  };

  const levelColors: Record<string, string> = {
    'beginner': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'intermediate': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    'advanced': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <Card 
      className="group border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => router.push(`/portal/mentor/courses/${course.id}`)}
    >
      {/* Image Header */}
      <div className="relative h-40 overflow-hidden">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full ${courseTypeColor} flex items-center justify-center`}>
            <BookOpen className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Course Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${courseTypeColor}`}>
            {course.courseType === 'live' ? 'LIVE' : 'RECORDED'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-1.5">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 shadow-md h-7 w-7 p-0"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white border-0 shadow-md h-7 w-7 p-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Category & Level Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${categoryColors[course.category] || categoryColors['other']}`}>
            {course.category.replace('-', ' ').toUpperCase()}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${levelColors[course.level] || levelColors['beginner']}`}>
            {course.level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {course.shortDescription}
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center space-x-1">
            <Users className="w-3.5 h-3.5" />
            <span>{course.enrolledCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{totalLessons}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${course.price}
            </span>
            {course.scholarshipAvailable && (
              <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded">
                Scholarship
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

