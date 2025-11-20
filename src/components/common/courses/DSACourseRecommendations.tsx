/**
 * DSA Course Recommendations Component
 * Shows top DSA courses for coding-related Full Career Bootcamp students
 * Visible only to students enrolled in coding-related bootcamp courses
 */

'use client';

import React from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { CourseCard } from '@/components/common/cards/CourseCard';
import { Badge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/ui/Button';
import { DSACourse, DSAFocusArea } from '@/interfaces/course';
import { Course } from '@/data/mock/coursesData';
import { isCodingBootcampStudent } from '@/utils/accessControl';
import { useAppSelector } from '@/hooks';

export interface DSACourseRecommendationsProps {
  variant?: 'dashboard' | 'browse';
  maxCourses?: number;
}

export function DSACourseRecommendations({
  variant = 'dashboard',
  maxCourses = 6,
}: DSACourseRecommendationsProps) {
  const { enrolledCourses, courses } = useAppSelector(state => state.courses);

  // Map enrollments to their actual Course objects
  const enrolledCourseObjects = enrolledCourses
    .map(enrollment => courses.find(course => course.id === enrollment.courseId))
    .filter((course): course is Course => course !== undefined);

  // Check if student is enrolled in coding-related bootcamp
  const isEligible = isCodingBootcampStudent(enrolledCourseObjects);

  if (!isEligible) {
    return null; // Hidden for non-coding bootcamp students
  }

  // Filter DSA courses (mock - replace with actual DSA course filtering)
  const dsaCourses: DSACourse[] = courses
    .filter(course => {
      // Mock filter - in real implementation, check course tags/category
      const dsaKeywords = ['dsa', 'data structures', 'algorithms', 'problem solving'];
      return dsaKeywords.some(keyword =>
        course.title.toLowerCase().includes(keyword) ||
        course.description.toLowerCase().includes(keyword)
      );
    })
    .slice(0, maxCourses)
    .map(course => ({
      ...course,
      // Add required fields from Course interface
      courseType: course.courseCategory === 'bootcamp' ? 'bootcamp' : (course.courseType === 'live' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      courseCategory: course.courseCategory || (course.courseType === 'live' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      deliveryMethod: course.courseType === 'live' ? 'live' : 'recorded' as 'live' | 'recorded' | 'mixed',
      isFree: course.price === 0,
      hasHackathons: course.courseCategory === 'bootcamp' || false,
      hasScholarships: course.scholarshipAvailable || false,
      hasAIInterview: course.courseCategory === 'bootcamp' || false,
      hasManualInterview: course.courseCategory === 'bootcamp' || false,
      // DSA-specific fields
      focusAreas: ['problem-solving', 'hackathons', 'interviews'] as DSAFocusArea[],
      isRecommended: true,
      recommendationReason: 'Recommended for bootcamp students',
      bootcampStudentSuccessRate: 95,
    } as unknown as DSACourse));

  if (dsaCourses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Top DSA Courses for Problem Solving, Hackathons & Interviews
          </h2>
          <p className="text-gray-600 mt-1">
            Recommended courses to enhance your problem-solving skills and interview readiness
          </p>
        </div>
        {variant === 'browse' && (
          <Button variant="outline">View All DSA Courses</Button>
        )}
      </div>

      {/* Focus Areas Info */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="info" size="md">
          <Target className="w-3 h-3 mr-1" />
          Problem Solving
        </Badge>
        <Badge variant="warning" size="md">
          <TrendingUp className="w-3 h-3 mr-1" />
          Hackathons
        </Badge>
        <Badge variant="success" size="md">
          <Award className="w-3 h-3 mr-1" />
          Interview Prep
        </Badge>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dsaCourses.map(course => (
          <div key={course.id} className="relative">
            <CourseCard
              course={course}
              variant="recommended"
              className="h-full"
            />
            {/* Focus Area Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              {course.focusAreas.map((area, idx) => (
                <Badge
                  key={idx}
                  variant={
                    area === 'problem-solving'
                      ? 'info'
                      : area === 'hackathons'
                      ? 'warning'
                      : 'success'
                  }
                  size="sm"
                >
                  {area === 'problem-solving'
                    ? 'Problem Solving'
                    : area === 'hackathons'
                    ? 'Hackathons'
                    : 'Interviews'}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Integration Links */}
      {variant === 'dashboard' && (
        <Card variant="outlined">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Apply what you learn
                </p>
                <p className="text-xs text-gray-600">
                  Practice in Hackathons • Test in AI Mock Interview • Train in Interview Prep
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Hackathons
                </Button>
                <Button variant="outline" size="sm">
                  AI Interview
                </Button>
                <Button variant="outline" size="sm">
                  Interview Prep
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


