"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Edit, Trash2, Users, Star, Code, ExternalLink } from 'lucide-react';
import { Course } from '@/data/mock/coursesData';

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onManageProjects?: () => void;
}

export function CourseCard({ course, onEdit, onDelete, onManageProjects }: CourseCardProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="border-slate-200 dark:border-slate-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{course.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Category:</span>
            <span className="font-medium text-slate-900 dark:text-white capitalize">
              {course.category.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Level:</span>
            <span className="font-medium text-slate-900 dark:text-white capitalize">
              {course.level}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Enrolled:</span>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white">
                {course.enrolledCount}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Rating:</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-slate-900 dark:text-white">
                {course.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">({course.ratingCount})</span>
            </div>
          </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Price:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${course.price}
                    </span>
                  </div>
                  {course.projects && course.projects.length > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center">
                        <Code className="w-4 h-4 mr-1" />
                        Projects:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {course.projects.length}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0">
                {onManageProjects && (
                  <Button
                    onClick={onManageProjects}
                    variant="outline"
                    className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Manage Projects
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
  );
}

