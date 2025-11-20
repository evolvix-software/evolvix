"use client";

import { useEffect, useState, useMemo } from 'react';
import { 
  CourseBannerCarousel, 
  CourseCard, 
  FeaturedCourses,
  CourseCategories 
} from '@/components/common/courses';
import { EnhancedCourseFilters } from '@/components/common/courses/EnhancedCourseFilters';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setCourses, setFilters } from '@/store/features/courses/coursesSlice';
import { coursesData } from '@/data/mock/coursesData';
import { Course } from '@/data/mock/coursesData';
import { Star, TrendingUp, Sparkles } from 'lucide-react';

export function CoursesPage() {
  const dispatch = useAppDispatch();
  const { courses, filters, sortBy, viewMode } = useAppSelector(state => state.courses);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [dispatch, isClient]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    if (!isClient) return [];

    let filtered = courses.filter(course => {
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

      // Price filter
      if (filters.price === 'free' && course.price && course.price > 0) {
        return false;
      }
      if (filters.price === 'paid' && (!course.price || course.price === 0)) {
        return false;
      }

      // Rating filter
      if (filters.rating === '4+' && course.rating < 4) {
        return false;
      }
      if (filters.rating === '4.5+' && course.rating < 4.5) {
        return false;
      }

      // Duration filter (parse duration string like "8 weeks" or "40 hours")
      if (filters.duration !== 'all') {
        const durationStr = course.duration.toLowerCase();
        let hours = 0;
        
        // Extract hours from duration string
        if (durationStr.includes('hour')) {
          const match = durationStr.match(/(\d+)\s*hour/);
          hours = match ? parseInt(match[1]) : 0;
        } else if (durationStr.includes('week')) {
          const match = durationStr.match(/(\d+)\s*week/);
          const weeks = match ? parseInt(match[1]) : 0;
          hours = weeks * 10; // Approximate 10 hours per week
        } else if (durationStr.includes('day')) {
          const match = durationStr.match(/(\d+)\s*day/);
          const days = match ? parseInt(match[1]) : 0;
          hours = days * 2; // Approximate 2 hours per day
        }

        if (filters.duration === 'short' && hours >= 5) return false;
        if (filters.duration === 'medium' && (hours < 5 || hours > 20)) return false;
        if (filters.duration === 'long' && hours <= 20) return false;
      }

      // Mentor filter
      if (filters.mentor !== 'all' && course.instructor.id !== filters.mentor) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${course.title} ${course.description} ${course.skills.join(' ')} ${course.instructor.name}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort courses
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return dateB - dateA;
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'duration-short':
          // Simple comparison - could be improved
          return a.duration.localeCompare(b.duration);
        case 'duration-long':
          return b.duration.localeCompare(a.duration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, filters, sortBy, isClient]);

  // Get featured courses (highest rated, most popular, newest)
  const featuredCourses = useMemo(() => {
    if (!isClient) return [];
    const sortedByRating = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4);
    return sortedByRating;
  }, [courses, isClient]);

  const popularCourses = useMemo(() => {
    if (!isClient) return [];
    const sortedByEnrollment = [...courses].sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0)).slice(0, 4);
    return sortedByEnrollment;
  }, [courses, isClient]);

  const newCourses = useMemo(() => {
    if (!isClient) return [];
    const sortedByDate = [...courses].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return dateB - dateA;
    }).slice(0, 4);
    return sortedByDate;
  }, [courses, isClient]);

  return (
    <div className="space-y-8">
      {/* Banner Carousel */}
      <CourseBannerCarousel />

      {/* Categories Section */}
      {isClient && <CourseCategories />}

      {/* Featured Courses Sections */}
      {isClient && (
        <div className="space-y-8">
          {featuredCourses.length > 0 && (
            <FeaturedCourses 
              courses={featuredCourses} 
              title="Featured Courses"
              icon={<Star className="w-5 h-5 text-primary dark:text-primary" />}
            />
          )}
          {popularCourses.length > 0 && (
            <FeaturedCourses 
              courses={popularCourses} 
              title="Most Popular"
              icon={<TrendingUp className="w-5 h-5 text-primary dark:text-primary" />}
            />
          )}
          {newCourses.length > 0 && (
            <FeaturedCourses 
              courses={newCourses} 
              title="New Courses"
              icon={<Sparkles className="w-5 h-5 text-primary dark:text-primary" />}
            />
          )}
        </div>
      )}

      {/* Header with Results Count */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-1">
            All Courses
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isClient ? (
              <span className="font-semibold text-slate-900 dark:text-foreground">{filteredAndSortedCourses.length}</span>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-foreground">0</span>
            )} courses available
          </p>
        </div>
      </div>

      {/* Enhanced Filters */}
      {isClient && <EnhancedCourseFilters />}

      {/* Courses Grid/List */}
      {!isClient ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] dark:border-[#735fff] mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-2">Loading courses...</h3>
        </div>
      ) : filteredAndSortedCourses.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCourses.map(course => (
              <div key={course.id} className="border border-slate-200 dark:border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img 
                    src={course.thumbnail || course.image} 
                    alt={course.title}
                    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-2">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {course.shortDescription || course.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {course.rating} ({course.ratingCount})
                      </span>
                      <span>{course.duration}</span>
                      <span>{course.instructor.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {course.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-card text-slate-700 dark:text-slate-300 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => window.location.href = `/portal/student/courses/${course.id}`}
                        className="px-4 py-2 bg-primary dark:bg-primary hover:bg-[#4f48cc] dark:hover:bg-primary text-white rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 dark:bg-card rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-2">No courses found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={() => dispatch(setFilters({ 
              category: 'all', 
              level: 'all', 
              skill: '', 
              searchQuery: '',
              price: 'all',
              rating: 'all',
              duration: 'all',
              mentor: 'all'
            }))}
            className="px-4 py-2 bg-primary dark:bg-primary hover:bg-[#4f48cc] dark:hover:bg-primary text-white rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

