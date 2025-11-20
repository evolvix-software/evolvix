/**
 * Student Hackathons Page
 * Access external hackathon links for practice and problem solving
 * Available only for Full Career Bootcamp students
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Plus, Search, Filter, Trophy, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { AccessControl } from '@/components/common/features/AccessControl';
import { useAppSelector } from '@/hooks';
import { HackathonLink } from '@/types/student';
import { Course as CourseData } from '@/data/mock/coursesData';
import { Course } from '@/interfaces/course';

export function StudentHackathonsPage() {
  const { enrolledCourses, courses } = useAppSelector(state => state.courses);
  const [links, setLinks] = useState<HackathonLink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Convert Enrollment[] to Course[] by mapping enrolled course IDs to full Course objects
  // Convert coursesData Course to interfaces/course Course format
  const enrolledCoursesAsCourses: Course[] = enrolledCourses
    .map(enrollment => courses.find(c => c.id === enrollment.courseId))
    .filter((course): course is CourseData => course !== undefined)
    .map(course => ({
      ...course,
      courseType: course.courseCategory === 'bootcamp' ? 'bootcamp' : (course.courseCategory === 'crash' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      courseCategory: course.courseCategory === 'bootcamp' ? 'bootcamp' : (course.courseCategory === 'crash' ? 'crash' : 'skill-focused') as 'crash' | 'skill-focused' | 'bootcamp',
      deliveryMethod: course.courseType === 'live' ? 'live' : 'recorded' as 'live' | 'recorded' | 'mixed',
      isFree: course.price === 0,
      hasHackathons: course.courseCategory === 'bootcamp' || false,
      hasScholarships: course.scholarshipAvailable || false,
      hasAIInterview: course.courseCategory === 'bootcamp' || false,
      hasManualInterview: course.courseCategory === 'bootcamp' || false,
    } as unknown as Course));

  // Mock data - replace with API call
  useEffect(() => {
    const mockLinks: HackathonLink[] = [
      {
        id: '1',
        title: 'LeetCode - Two Sum',
        url: 'https://leetcode.com/problems/two-sum',
        type: 'practice-problem',
        category: 'arrays',
        difficulty: 'beginner',
        completed: false,
      },
      {
        id: '2',
        title: 'HackerRank - Algorithm Challenges',
        url: 'https://www.hackerrank.com/domains/algorithms',
        type: 'practice-problem',
        category: 'algorithms',
        difficulty: 'intermediate',
        completed: true,
        completedAt: new Date().toISOString(),
      },
    ];
    setLinks(mockLinks);
  }, []);

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || link.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || link.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = Array.from(new Set(links.map(l => l.category)));
  const completedCount = links.filter(l => l.completed).length;

  return (
    <AccessControl
      enrolledCourses={enrolledCoursesAsCourses}
      requiredFeature="hackathons"
      fallback={
        <div className="p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Hackathons Feature Unavailable
          </h2>
          <p className="text-muted-foreground mb-4">
            This feature is only available for Full Career Bootcamp students.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hackathons</h1>
            <p className="text-muted-foreground mt-1">
              Practice problems and access external hackathon links
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Link
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Links</p>
                  <p className="text-2xl font-bold text-foreground">{links.length}</p>
                </div>
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {links.length - completedCount}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card variant="outlined">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filterDifficulty}
                onChange={e => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map(link => (
            <Card key={link.id} variant="elevated" hover clickable>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  {link.completed && (
                    <Badge variant="success" size="sm">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        link.difficulty === 'beginner'
                          ? 'success'
                          : link.difficulty === 'intermediate'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {link.difficulty}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {link.category}
                    </Badge>
                  </div>
                  {link.sentBy && (
                    <p className="text-sm text-gray-600">
                      Recommended by mentor
                    </p>
                  )}
                  {link.completedAt && (
                    <p className="text-xs text-gray-500">
                      Completed on{' '}
                      {new Date(link.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.open(link.url, '_blank')}
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Open Link
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <Card variant="flat">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No links found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterCategory !== 'all' || filterDifficulty !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Your mentor will send practice links here'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AccessControl>
  );
}

