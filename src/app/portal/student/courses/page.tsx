"use client";

import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { CourseCard } from '@/components/courses/CourseCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCourses, setFilters } from '@/store/features/courses/coursesSlice';
import { coursesData } from '@/data/mock/coursesData';
import { Course } from '@/data/mock/coursesData';

export default function CoursesPage() {
  const dispatch = useAppDispatch();
  const { courses, filters } = useAppSelector(state => state.courses);

  useEffect(() => {
    // Load courses - merge mock data with mentor-created courses from localStorage
    const storedCourses = localStorage.getItem('evolvix_courses');
    const mentorCourses = storedCourses ? JSON.parse(storedCourses) : [];
    
    // Merge mock courses with mentor-created courses, avoiding duplicates
    const allCourses = [...coursesData];
    mentorCourses.forEach((mentorCourse: Course) => {
      if (!allCourses.find(c => c.id === mentorCourse.id)) {
        allCourses.push(mentorCourse);
      }
    });
    
    dispatch(setCourses(allCourses));
    
    // Load enrollments from localStorage
    const stored = localStorage.getItem('evolvix_enrollments');
    if (stored) {
      const enrollments = JSON.parse(stored);
      // Load enrollments into Redux store
      enrollments.forEach((enrollment: any) => {
        dispatch({ type: 'courses/enrollCourse', payload: enrollment.courseId });
      });
    }
  }, [dispatch]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    // Category filter
    if (filters.category !== 'all' && course.category !== filters.category) {
      return false;
    }

    // Level filter
    if (filters.level !== 'all' && course.level !== filters.level) {
      return false;
    }

    // Skill filter
    if (filters.skill && !course.skills.includes(filters.skill)) {
      return false;
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${course.title} ${course.description} ${course.skills.join(' ')}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  return (
    <Layout title="Courses" role="student">
      <div className="space-y-8">
        {/* Header with Results Count */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              Course Catalog
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{filteredCourses.length}</span> courses available
            </p>
          </div>
        </div>

        {/* Filters - Compact */}
        <CourseFilters />

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => dispatch(setFilters({ category: 'all', level: 'all', skill: '', searchQuery: '' }))}
              className="px-4 py-2 bg-[#635bff] hover:bg-[#4f48cc] text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
