"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setCourses } from '@/store/features/courses/coursesSlice';
import { coursesData } from '@/data/mock/coursesData';
import { Course } from '@/data/mock/coursesData';
import { 
  BookOpen, Clock, User, TrendingUp, Award, Play, CheckCircle2,
  Filter, Search, Calendar, FileText, ClipboardCheck, Video,
  ChevronDown, ChevronUp, MessageSquare, Download, Star, 
  Target, BarChart3, Zap, ExternalLink, Users as UsersIcon,
  GraduationCap, AlertCircle, Trophy, Sparkles, X
} from 'lucide-react';
import { StatsCard, STAT_CARD_COLORS } from '@/components/common/ui/StatsCard';

export function MyCoursesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses, enrolledCourses } = useAppSelector(state => state.courses);
  const { submissions } = useAppSelector(state => state.projects);
  const [isClient, setIsClient] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed' | 'not-started'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [mentorFilter, setMentorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const storedCourses = localStorage.getItem('evolvix_courses');
    const mentorCourses = storedCourses ? JSON.parse(storedCourses) : [];
    
    const allCourses = [...coursesData];
    mentorCourses.forEach((mentorCourse: Course) => {
      if (!allCourses.find(c => c.id === mentorCourse.id)) {
        allCourses.push(mentorCourse);
      }
    });
    
    dispatch(setCourses(allCourses));
    
    // Initialize mock enrollments if none exist
    const stored = localStorage.getItem('evolvix_enrollments');
    if (!stored || JSON.parse(stored).length === 0) {
      // Import and initialize mock enrollments
      import('@/data/mock/enrollmentsData').then((module) => {
        module.initializeMockEnrollments();
        const enrollments = module.mockEnrollments;
        enrollments.forEach((enrollment: any) => {
          dispatch({ type: 'courses/enrollCourse', payload: enrollment.courseId });
        });
      });
    } else {
      const enrollments = JSON.parse(stored);
      enrollments.forEach((enrollment: any) => {
        dispatch({ type: 'courses/enrollCourse', payload: enrollment.courseId });
      });
    }
  }, [dispatch, isClient]);

  // Get enrolled courses with full course data
  const enrolledCoursesWithData = enrolledCourses.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    return {
      ...enrollment,
      course: course || null
    };
  }).filter(item => item.course !== null);

  // Get unique categories and mentors
  const categories = useMemo(() => {
    const cats = new Set(enrolledCoursesWithData.map(e => e.course?.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [enrolledCoursesWithData]);

  const mentors = useMemo(() => {
    const mentorSet = new Set(enrolledCoursesWithData.map(e => e.course?.instructor.id).filter(Boolean));
    return Array.from(mentorSet) as string[];
  }, [enrolledCoursesWithData]);

  // Filter enrolled courses
  const filteredEnrolledCourses = enrolledCoursesWithData.filter(item => {
    if (!item.course) return false;

    // Status filter
    if (filter === 'completed' && !item.completed) return false;
    if (filter === 'in-progress' && (item.completed || item.progress === 0)) return false;
    if (filter === 'not-started' && item.progress > 0) return false;

    // Category filter
    if (categoryFilter !== 'all' && item.course.category !== categoryFilter) return false;

    // Mentor filter
    if (mentorFilter !== 'all' && item.course.instructor.id !== mentorFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${item.course.title} ${item.course.description} ${item.course.instructor.name}`.toLowerCase();
      if (!searchableText.includes(query)) return false;
    }

    return true;
  });

  const stats = {
    total: enrolledCoursesWithData.length,
    inProgress: enrolledCoursesWithData.filter(e => e.progress > 0 && !e.completed).length,
    completed: enrolledCoursesWithData.filter(e => e.completed).length,
    notStarted: enrolledCoursesWithData.filter(e => e.progress === 0).length,
    certificates: enrolledCoursesWithData.filter(e => e.progress >= 80).length,
    totalLearningHours: enrolledCoursesWithData.reduce((sum, e) => {
      const course = e.course;
      if (!course) return sum;
      const durationMatch = course.duration.match(/(\d+)/);
      const hours = durationMatch ? parseInt(durationMatch[1]) : 0;
      return sum + (hours * (e.progress / 100));
    }, 0),
    averageCompletion: enrolledCoursesWithData.length > 0
      ? Math.round(enrolledCoursesWithData.reduce((sum, e) => sum + e.progress, 0) / enrolledCoursesWithData.length)
      : 0
  };

  const getStatusBadge = (progress: number, completed: boolean) => {
    if (completed) {
      return (
        <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-green-500/20">
          Completed
        </span>
      );
    } else if (progress > 0) {
      return (
        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/20">
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">
          Not Started
        </span>
      );
    }
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const getCourseProgressDetails = (enrollment: any, course: Course) => {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = enrollment.completedLessons?.length || 0;
    const completedModules = course.modules.filter(m => 
      m.lessons.every(l => enrollment.completedLessons?.includes(l.id))
    ).length;
    
    const assignmentsTotal = course.projects?.length || 0;
    const assignmentsCompleted = submissions.filter(s => 
      s.courseId === course.id && s.status === 'reviewed'
    ).length;
    
    const testsTotal = 3;
    const testsCompleted = 1;
    
    const upcomingClasses = 2;
    const pastRecordings = 5;
    
    return {
      totalLessons,
      completedLessons,
      totalModules: course.modules.length,
      completedModules,
      assignmentsTotal,
      assignmentsCompleted,
      testsTotal,
      testsCompleted,
      upcomingClasses,
      pastRecordings,
      lastActivity: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : 'N/A'
    };
  };

  const getRecommendedCourses = () => {
    const enrolledCategories = new Set(enrolledCoursesWithData.map(e => e.course?.category).filter(Boolean));
    return courses
      .filter(c => !enrolledCourses.some(e => e.courseId === c.id))
      .filter(c => enrolledCategories.has(c.category))
      .slice(0, 3);
  };

  const activeFiltersCount = [filter !== 'all', categoryFilter !== 'all', mentorFilter !== 'all', searchQuery !== ''].filter(Boolean).length;

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-foreground mb-3 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            My Learning
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Continue your learning journey and track your progress
          </p>
        </div>
        <Button
          onClick={() => router.push('/portal/student/courses')}
          className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-6 py-3 text-base font-semibold shadow-lg shadow-[#635bff]/25 hover:shadow-xl hover:shadow-[#635bff]/30 transition-all duration-300"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Browse More Courses
        </Button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={BookOpen}
          label="Total Courses"
          value={stats.total}
          {...STAT_CARD_COLORS.blue}
        />
        <StatsCard
          icon={TrendingUp}
          label="In Progress"
          value={stats.inProgress}
          {...STAT_CARD_COLORS.purple}
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          {...STAT_CARD_COLORS.green}
        />
        <StatsCard
          icon={Award}
          label="Certificates"
          value={stats.certificates}
          {...STAT_CARD_COLORS.yellow}
        />
      </div>
      
      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          icon={Clock}
          label="Learning Hours"
          value={`${Math.round(stats.totalLearningHours)}h`}
          {...STAT_CARD_COLORS.indigo}
        />
        <StatsCard
          icon={BarChart3}
          label="Avg. Completion"
          value={`${stats.averageCompletion}%`}
          {...STAT_CARD_COLORS.pink}
        />
        <StatsCard
          icon={Trophy}
          label="Not Started"
          value={stats.notStarted}
          {...STAT_CARD_COLORS.emerald}
        />
      </div>

      {/* Filters and Search */}
      <Card className="border border-slate-200 dark:border-border shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search your courses by title, description, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-card dark:bg-card border-2 border-slate-200 dark:border-border rounded-xl text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 mr-2">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters:</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-primary dark:bg-primary text-white text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              
              {/* Status Filters */}
              {(['all', 'in-progress', 'completed', 'not-started'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  onClick={() => setFilter(status)}
                  className={`transition-all duration-200 ${
                    filter === status
                      ? 'bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white shadow-lg shadow-[#635bff]/25'
                      : 'border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card hover:border-[#635bff]/50 dark:hover:border-[#735fff]/50'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status === 'completed' ? 'Completed' : 'Not Started'}
                </Button>
              ))}

              {/* Category Filter */}
              {categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-card dark:bg-card border-2 border-slate-200 dark:border-border rounded-lg text-slate-900 dark:text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all duration-200 hover:border-[#635bff]/50 dark:hover:border-[#735fff]/50"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}

              {/* Mentor Filter */}
              {mentors.length > 0 && (
                <select
                  value={mentorFilter}
                  onChange={(e) => setMentorFilter(e.target.value)}
                  className="px-4 py-2 bg-card dark:bg-card border-2 border-slate-200 dark:border-border rounded-lg text-slate-900 dark:text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] transition-all duration-200 hover:border-[#635bff]/50 dark:hover:border-[#735fff]/50"
                >
                  <option value="all">All Mentors</option>
                  {mentors.map(mentorId => {
                    const mentor = enrolledCoursesWithData.find(e => e.course?.instructor.id === mentorId)?.course?.instructor;
                    return mentor ? (
                      <option key={mentorId} value={mentorId}>{mentor.name}</option>
                    ) : null;
                  })}
                </select>
              )}

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter('all');
                    setCategoryFilter('all');
                    setMentorFilter('all');
                    setSearchQuery('');
                  }}
                  className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      {!isClient ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#635bff] border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">Loading your courses...</h3>
          <p className="text-slate-600 dark:text-slate-400">Please wait a moment</p>
        </div>
      ) : filteredEnrolledCourses.length > 0 ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-foreground">
              {filteredEnrolledCourses.length} {filteredEnrolledCourses.length === 1 ? 'Course' : 'Courses'} Found
            </h2>
          </div>
          {filteredEnrolledCourses.map(({ course, progress, completed, enrolledAt, courseId, completedLessons }) => {
            if (!course) return null;

            const isExpanded = expandedCourseId === courseId;
            const progressDetails = getCourseProgressDetails({ completedLessons, enrolledAt, progress, completed }, course);
            const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
            const nextLesson = course.modules
              .flatMap(m => m.lessons)
              .find(l => !completedLessons?.includes(l.id));

            return (
              <Card 
                key={courseId} 
                className={`border-2 transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'border-[#635bff] dark:border-[#735fff] shadow-2xl shadow-[#635bff]/10 dark:shadow-[#735fff]/10' 
                    : 'border-slate-200 dark:border-border hover:border-[#635bff]/50 dark:hover:border-[#735fff]/50 hover:shadow-xl'
                }`}
              >
                {/* Course Header */}
                <div className="flex flex-col lg:flex-row">
                  {/* Course Image */}
                  <div className="relative w-full lg:w-72 h-56 lg:h-auto flex-shrink-0 group overflow-hidden">
                    <img
                      src={course.thumbnail || course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 z-10">
                      {getStatusBadge(progress, completed)}
                    </div>
                    {progress >= 80 && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg">
                          <Award className="w-4 h-4" />
                          <span>Certificate Ready</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 
                          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-foreground mb-3 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors duration-200 line-clamp-2"
                          onClick={() => router.push(`/portal/student/courses/${courseId}`)}
                        >
                          {course.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-5">
                          <div className="flex items-center space-x-2 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary flex items-center justify-center text-white text-xs font-bold">
                              {course.instructor.name.charAt(0)}
                            </div>
                            <span className="font-semibold">{course.instructor.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Enrolled {new Date(enrolledAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.push(`/portal/student/courses/${courseId}`)}
                        variant="outline"
                        className="border-slate-300 dark:border-border hover:bg-primary hover:border-[#635bff] hover:text-white dark:hover:bg-primary dark:hover:border-[#735fff] transition-all duration-200 flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Progress</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-card rounded-full h-3.5 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-primary via-[#735fff] to-[#8b7fff] transition-all duration-700 ease-out shadow-lg"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      {[
                        { label: 'Lessons', value: `${progressDetails.completedLessons}/${progressDetails.totalLessons}`, icon: Play },
                        { label: 'Modules', value: `${progressDetails.completedModules}/${progressDetails.totalModules}`, icon: BookOpen },
                        { label: 'Assignments', value: `${progressDetails.assignmentsCompleted}/${progressDetails.assignmentsTotal}`, icon: FileText },
                        { label: 'Tests', value: `${progressDetails.testsCompleted}/${progressDetails.testsTotal}`, icon: ClipboardCheck },
                      ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                          <div key={idx} className="text-center p-3 bg-gradient-to-br from-slate-50 to-white dark:from-[#2B2B32] dark:to-[#1E1E24] rounded-xl border border-slate-200 dark:border-border hover:shadow-md transition-shadow">
                            <Icon className="w-4 h-4 text-primary dark:text-primary mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-foreground">{stat.value}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => router.push(`/portal/student/courses/${courseId}`)}
                        className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white shadow-lg shadow-[#635bff]/25 hover:shadow-xl transition-all duration-200"
                      >
                        {course.deliveryMethod === 'recorded' ? (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            {nextLesson ? 'Watch Recorded Videos' : progress > 0 ? 'Review Recorded Videos' : 'Start Watching Videos'}
                          </>
                        ) : course.deliveryMethod === 'live' ? (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            {nextLesson ? 'Join Live Classes' : progress > 0 ? 'View Live Classes' : 'Start Live Classes'}
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            {nextLesson ? 'Continue Learning' : progress > 0 ? 'Review Course' : 'Start Learning'}
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/portal/student/assignments?courseId=${courseId}`)}
                        className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Assignments
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/portal/student/tests?courseId=${courseId}`)}
                        className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Tests
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/portal/student/classes?courseId=${courseId}`)}
                        className="border-slate-300 dark:border-border hover:bg-slate-50 dark:hover:bg-card hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Live Classes
                      </Button>
                      {progress >= 80 && (
                        <Button
                          variant="outline"
                          className="border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 shadow-md"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t-2 border-slate-200 dark:border-border bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-[#1E1E24] dark:via-[#2B2B32] dark:to-[#1E1E24]">
                    <div className="p-6 lg:p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
                      {/* Course Overview */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          Course Overview
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5 text-base">{course.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.skills.slice(0, 6).map((skill, idx) => (
                            <div key={idx} className="flex items-center space-x-3 p-3 bg-card dark:bg-card rounded-lg border border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] transition-colors">
                              <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Dashboard */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          Progress Dashboard
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Overall Progress', value: `${progress}%`, icon: Target },
                            { label: 'Time Spent', value: `${Math.round((progress / 100) * (parseInt(course.duration.match(/(\d+)/)?.[1] || '0'))) || 0}h`, icon: Clock },
                            { label: 'Last Activity', value: progressDetails.lastActivity, icon: Calendar },
                            { label: 'Completion Rate', value: `${totalLessons > 0 ? Math.round((progressDetails.completedLessons / totalLessons) * 100) : 0}%`, icon: TrendingUp },
                          ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                              <div key={idx} className="p-5 bg-card dark:bg-card rounded-xl border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200 hover:shadow-lg">
                                <Icon className="w-5 h-5 text-primary dark:text-primary mb-2" />
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{stat.value}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lessons List */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                          Course Content ({progressDetails.completedLessons}/{progressDetails.totalLessons} completed)
                        </h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                          {course.modules.map((module, moduleIdx) => (
                            <div key={module.id} className="border-2 border-slate-200 dark:border-border rounded-xl overflow-hidden hover:border-[#635bff] dark:hover:border-[#735fff] transition-colors">
                              <div className="p-4 bg-card dark:bg-card border-b-2 border-slate-200 dark:border-border">
                                <h5 className="font-bold text-slate-900 dark:text-foreground text-lg">
                                  Module {moduleIdx + 1}: {module.title}
                                </h5>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                                  {module.lessons.filter(l => completedLessons?.includes(l.id)).length}/{module.lessons.length} lessons completed
                                </p>
                              </div>
                              <div className="divide-y divide-slate-200 dark:divide-border">
                                {module.lessons.map((lesson) => {
                                  const isCompleted = completedLessons?.includes(lesson.id);
                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => router.push(`/portal/student/courses/${courseId}/lessons/${lesson.id}`)}
                                      className="p-4 hover:bg-slate-50 dark:hover:bg-secondary cursor-pointer flex items-center justify-between transition-colors group"
                                    >
                                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        {isCompleted ? (
                                          <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                                        ) : (
                                          <Play className="w-5 h-5 text-slate-400 group-hover:text-primary dark:group-hover:text-primary flex-shrink-0 transition-colors" />
                                        )}
                                        <span className={`text-sm font-medium ${isCompleted ? 'text-slate-500 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-foreground group-hover:text-primary dark:group-hover:text-primary'} transition-colors truncate`}>
                                          {lesson.title}
                                        </span>
                                      </div>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 ml-3">{lesson.duration}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assignments & Tests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { icon: FileText, label: 'Assignments', completed: progressDetails.assignmentsCompleted, total: progressDetails.assignmentsTotal, route: `/portal/student/assignments?courseId=${courseId}` },
                          { icon: ClipboardCheck, label: 'Tests', completed: progressDetails.testsCompleted, total: progressDetails.testsTotal, route: `/portal/student/tests?courseId=${courseId}` },
                        ].map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <div key={idx} className="p-5 bg-card dark:bg-card rounded-xl border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200 hover:shadow-lg">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-bold text-slate-900 dark:text-foreground flex items-center text-lg">
                                  <Icon className="w-5 h-5 mr-2 text-primary dark:text-primary" />
                                  {item.label}
                                </h5>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(item.route)}
                                  className="border-slate-300 dark:border-border hover:bg-primary hover:border-[#635bff] hover:text-white dark:hover:bg-primary dark:hover:border-[#735fff] transition-all"
                                >
                                  View All
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                              <p className="text-3xl font-bold text-slate-900 dark:text-foreground mb-1">
                                {item.completed}/{item.total}
                              </p>
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Completed</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Live Classes */}
                      <div className="p-5 bg-card dark:bg-card rounded-xl border-2 border-slate-200 dark:border-border hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-bold text-slate-900 dark:text-foreground flex items-center text-lg">
                            <Video className="w-5 h-5 mr-2 text-primary dark:text-primary" />
                            Live Classes
                          </h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/portal/student/classes?courseId=${courseId}`)}
                            className="border-slate-300 dark:border-border hover:bg-primary hover:border-[#635bff] hover:text-white dark:hover:bg-primary dark:hover:border-[#735fff] transition-all"
                          >
                            View All
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900 dark:text-foreground mb-1">{progressDetails.upcomingClasses}</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Upcoming</p>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                            <p className="text-2xl font-bold text-slate-900 dark:text-foreground mb-1">{progressDetails.pastRecordings}</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Recordings</p>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Section */}
                      {progress >= 80 && (
                        <div className="p-6 bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Award className="w-8 h-8 text-yellow-900" />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-foreground text-xl mb-1">Certificate Available!</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  You've completed {progress}% of this course. Download your certificate now.
                                </p>
                              </div>
                            </div>
                            <Button
                              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-2 border-slate-200 dark:border-border">
          <CardContent className="p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2B2B32] dark:to-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-3">
              {enrolledCoursesWithData.length === 0 ? 'No enrolled courses yet' : 'No courses match your filters'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">
              {enrolledCoursesWithData.length === 0 
                ? 'Start your learning journey by enrolling in courses from our extensive catalog'
                : 'Try adjusting your filters or search query to find what you\'re looking for'}
            </p>
            {enrolledCoursesWithData.length === 0 && (
              <Button
                onClick={() => router.push('/portal/student/courses')}
                className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white px-8 py-4 text-base font-semibold shadow-lg shadow-[#635bff]/25 hover:shadow-xl transition-all"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recommended Next Steps */}
      {isClient && enrolledCoursesWithData.length > 0 && getRecommendedCourses().length > 0 && (
        <Card className="border-2 border-slate-200 dark:border-border shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-foreground flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Recommended Next Steps
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Continue your learning journey with these suggested courses
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getRecommendedCourses().map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/portal/student/courses/${course.id}`)}
                  className="cursor-pointer border-2 border-slate-200 dark:border-border rounded-2xl overflow-hidden hover:border-[#635bff] dark:hover:border-[#735fff] transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-slate-900 dark:text-foreground mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2 text-lg">
                      {course.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <span className="font-bold text-primary dark:text-primary text-lg">${course.price}</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white shadow-md hover:shadow-lg transition-all"
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #635bff;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4f48cc;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #735fff;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #635bff;
        }
      `}</style>
    </div>
  );
}
