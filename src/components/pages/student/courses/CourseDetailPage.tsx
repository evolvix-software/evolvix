"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/common/forms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { enrollCourse } from '@/store/features/courses/coursesSlice';
import { Course } from '@/data/mock/coursesData';
import { 
  Clock, Users, Star, BookOpen, CheckCircle, Play, Lock, User, 
  ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Award, 
  X, Code, Trophy, Heart, Video, FileText, HelpCircle, 
  Settings, Edit3, ExternalLink, Sparkles, TrendingUp
} from 'lucide-react';
import { ProjectSubmission as ProjectSubmissionComponent } from '@/components/common/projects/ProjectSubmission';
import { ProjectsLeaderboard } from '@/components/common/projects/ProjectsLeaderboard';
import { EnrollmentModal } from './EnrollmentModal';

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
}

export function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  
  const { courses, enrolledCourses } = useAppSelector(state => state.courses);
  const { submissions } = useAppSelector(state => state.projects);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [relatedCoursesStart, setRelatedCoursesStart] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [studentInfo, setStudentInfo] = useState({ id: '', name: '' });
  
  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setStudentInfo({
        id: parsedData.email || 'student',
        name: parsedData.fullName || 'Student',
      });
    }
    
    const wishlist = localStorage.getItem('evolvix_wishlist');
    if (wishlist) {
      const wishlistItems = JSON.parse(wishlist);
      setIsWishlisted(wishlistItems.includes(params.id));
    }
  }, [params.id]);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === params.id);
    if (foundCourse) {
      setCourse(foundCourse);
      if (foundCourse.modules.length > 0) {
        setExpandedModules(new Set([foundCourse.modules[0].id]));
      }
    }
  }, [courses, params.id]);

  const isEnrolled = enrolledCourses.some(e => e.courseId === course?.id);
  const enrollment = enrolledCourses.find(e => e.courseId === course?.id);
  const relatedCourses = courses.filter(c => c.id !== course?.id).slice(0, 6);
  const mentorCourses = course ? courses.filter(c => c.instructor.id === course.instructor.id && c.id !== course.id).slice(0, 4) : [];

  const allReviews: Review[] = [
    { id: '1', studentName: 'Alex Johnson', studentAvatar: 'AJ', rating: 5, text: 'Excellent course! Very comprehensive and well-structured. The instructor breaks down complex topics into digestible lessons.', date: '2 weeks ago', helpful: 12 },
    { id: '2', studentName: 'Maria Garcia', studentAvatar: 'MG', rating: 5, text: 'Best investment I made for my career. Highly recommended! The practical examples are very helpful.', date: '1 month ago', helpful: 8 },
    { id: '3', studentName: 'David Chen', studentAvatar: 'DC', rating: 5, text: 'The instructor explains concepts clearly. Great learning experience with hands-on projects.', date: '3 weeks ago', helpful: 15 },
    { id: '4', studentName: 'Sarah Williams', studentAvatar: 'SW', rating: 4, text: 'Outstanding content and delivery. Worth every penny. I learned so much!', date: '2 months ago', helpful: 6 },
    { id: '5', studentName: 'Michael Brown', studentAvatar: 'MB', rating: 5, text: 'Amazing course structure. The modules build on each other perfectly.', date: '1 week ago', helpful: 9 },
    { id: '6', studentName: 'Emily Davis', studentAvatar: 'ED', rating: 4, text: 'Perfect for beginners. The pace is just right and explanations are crystal clear.', date: '3 weeks ago', helpful: 5 },
    { id: '7', studentName: 'James Wilson', studentAvatar: 'JW', rating: 5, text: 'The best course I\'ve ever taken. Worth the investment!', date: '1 month ago', helpful: 11 },
    { id: '8', studentName: 'Lisa Anderson', studentAvatar: 'LA', rating: 3, text: 'Good course but could use more examples. Overall satisfied.', date: '2 months ago', helpful: 3 },
  ];

  const filteredReviews = reviewFilter === 'all' 
    ? allReviews 
    : allReviews.filter(r => r.rating === parseInt(reviewFilter));

  const showAlert = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setShowDialog(true);
  };

  const handleEnroll = () => {
    if (!course) return;
    if (course.price > 0) {
      setShowEnrollmentModal(true);
    } else {
      enrollCourseDirectly();
    }
  };

  const enrollCourseDirectly = () => {
    if (!course) return;
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
      setIsWishlisted(false);
      const wishlist = localStorage.getItem('evolvix_wishlist');
      if (wishlist) {
        const wishlistItems = JSON.parse(wishlist);
        const updated = wishlistItems.filter((id: string) => id !== course.id);
        localStorage.setItem('evolvix_wishlist', JSON.stringify(updated));
      }
      showAlert('Success!', 'Successfully enrolled in course!');
    }, 1000);
  };

  const handleEnrollmentConfirm = (paymentMethod: 'full' | 'installment', installments?: number) => {
    if (!course) return;
    setShowEnrollmentModal(false);
    enrollCourseDirectly();
    if (paymentMethod === 'installment' && installments) {
      const installmentAmount = course.price / installments;
      showAlert('Payment Plan Selected', `You'll pay $${installmentAmount.toFixed(2)} in ${installments} installments. First payment processed.`);
    } else {
      showAlert('Payment Processed', `Full payment of $${course.price.toLocaleString()} processed successfully.`);
    }
  };

  const handleWishlist = () => {
    if (!course) return;
    const wishlist = localStorage.getItem('evolvix_wishlist');
    const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
    
    if (isWishlisted) {
      const updated = wishlistItems.filter((id: string) => id !== course.id);
      localStorage.setItem('evolvix_wishlist', JSON.stringify(updated));
      setIsWishlisted(false);
      showAlert('Removed', 'Course removed from wishlist');
    } else {
      wishlistItems.push(course.id);
      localStorage.setItem('evolvix_wishlist', JSON.stringify(wishlistItems));
      setIsWishlisted(true);
      showAlert('Added', 'Course added to wishlist');
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const nextRelatedCourses = () => {
    setRelatedCoursesStart(Math.min(relatedCoursesStart + 3, relatedCourses.length - 3));
  };

  const prevRelatedCourses = () => {
    setRelatedCoursesStart(Math.max(relatedCoursesStart - 3, 0));
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const scrollAmount = 370;
      if (direction === 'left') {
        reviewsScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        reviewsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.text.trim()) {
      showAlert('Error', 'Please write a review');
      return;
    }
    showAlert('Thank You!', 'Your review has been submitted and will be published after moderation.');
    setShowWriteReview(false);
    setNewReview({ rating: 5, text: '' });
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">Loading course...</h2>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = course.modules.reduce((sum, m) => {
    return sum + m.lessons.reduce((lessonSum, l) => {
      const durationMatch = l.duration.match(/(\d+)/);
      return lessonSum + (durationMatch ? parseInt(durationMatch[1]) : 0);
    }, 0);
  }, 0);

  return (
    <>
      {/* Dialog Component */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-foreground">{dialogTitle}</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-6">{dialogMessage}</p>
            <Button
              onClick={() => setShowDialog(false)}
              className="w-full bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Hero Section - Udemy Style */}
        <div className="relative">
          {/* Breadcrumb */}
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            <span className="hover:text-primary dark:hover:text-primary cursor-pointer">Development</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary dark:hover:text-primary cursor-pointer">{course.category}</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-foreground">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Key Info */}
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-foreground mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  {course.shortDescription || course.description}
                </p>
                
                {/* Key Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-bold text-slate-900 dark:text-foreground">{course.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">({course.ratingCount} ratings)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Users className="w-5 h-5" />
                    <span>{course.enrolledCount.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <BookOpen className="w-5 h-5" />
                    <span>{totalLessons} lessons</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3 pb-6 border-b border-slate-200 dark:border-border">
                  <img 
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Created by</p>
                    <p className="font-semibold text-slate-900 dark:text-foreground hover:text-primary dark:hover:text-primary cursor-pointer">
                      {course.instructor.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* What You'll Learn */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">
                  Course content
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {course.modules.length} sections • {totalLessons} lectures • {totalDuration} total length
                </p>
                <div className="border border-slate-200 dark:border-border rounded-lg overflow-hidden">
                  {course.modules.map((module, moduleIdx) => {
                    const isExpanded = expandedModules.has(module.id);
                    const moduleDuration = module.lessons.reduce((sum, l) => {
                      const durationMatch = l.duration.match(/(\d+)/);
                      return sum + (durationMatch ? parseInt(durationMatch[1]) : 0);
                    }, 0);
                    
                    return (
                      <div key={module.id} className="border-b border-slate-200 dark:border-border last:border-b-0">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1 text-left">
                            <ChevronDown className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-foreground">
                                {moduleIdx + 1}. {module.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {module.lessons.length} lectures • {moduleDuration} min
                              </p>
                            </div>
                          </div>
                        </button>
                        {isExpanded && (
                          <div className="bg-slate-50 dark:bg-card border-t border-slate-200 dark:border-border">
                            {module.lessons.map((lesson) => {
                              const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                              const isLocked = !isEnrolled;
                              const LessonTypeIcon = lesson.type === 'video' ? Video : lesson.type === 'reading' ? FileText : HelpCircle;
                              
                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center space-x-3 p-3 pl-12 border-b border-slate-200 dark:border-border last:border-b-0 ${
                                    isLocked ? 'opacity-60' : 'hover:bg-card dark:hover:bg-secondary cursor-pointer'
                                  }`}
                                  onClick={() => !isLocked && router.push(`/portal/student/courses/${course.id}/lessons/${lesson.id}`)}
                                >
                                  <div className="flex-shrink-0">
                                    {isLocked ? (
                                      <Lock className="w-4 h-4 text-slate-400" />
                                    ) : isCompleted ? (
                                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <Play className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    )}
                                  </div>
                                  <LessonTypeIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {lesson.title}
                                    </p>
                                  </div>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                                    {lesson.duration}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-slate-600 dark:text-slate-400 mt-1">•</span>
                        <span className="text-slate-700 dark:text-slate-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">Description</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Projects Section - Simplified */}
              {course.projects && course.projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">Projects</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Build real-world projects to showcase your skills
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.projects.map((project) => {
                      const existingSubmission = isEnrolled ? submissions.find(
                        s => s.projectId === project.id && s.studentId === studentInfo.id && s.courseId === course.id
                      ) : undefined;
                      const isSelected = selectedProjectId === project.id;
                      
                      return (
                        <Card key={project.id} className="border border-slate-200 dark:border-border hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg font-bold text-slate-900 dark:text-foreground mb-2">
                                  {project.isFinalProject ? '🏆 ' : ''}{project.title}
                                </CardTitle>
                                {existingSubmission && (
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                                    existingSubmission.status === 'reviewed' 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                      : existingSubmission.status === 'returned'
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                                  }`}>
                                    {existingSubmission.status === 'reviewed' ? 'Reviewed' : 
                                     existingSubmission.status === 'returned' ? 'Needs Revision' : 'Pending'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Description */}
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                              {project.description}
                            </p>

                            {/* Tech Stack */}
                            {project.technologies && project.technologies.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Tech Stack</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-medium rounded-full">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Features */}
                            {project.requirements && project.requirements.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">Key Features</p>
                                <ul className="space-y-1.5">
                                  {project.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start space-x-2 text-sm text-slate-700 dark:text-slate-300">
                                      <Sparkles className="w-4 h-4 text-primary dark:text-primary flex-shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Action Button */}
                            {isEnrolled ? (
                              <Button
                                onClick={() => setSelectedProjectId(isSelected ? null : project.id)}
                                className="w-full bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white"
                              >
                                {existingSubmission ? 'View Submission' : 'Submit Project'}
                              </Button>
                            ) : (
                              <div className="p-3 bg-slate-50 dark:bg-card rounded-lg text-center">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Enroll to access project submission
                                </p>
                              </div>
                            )}
                          </CardContent>
                          
                          {/* Submission Form */}
                          {isSelected && isEnrolled && (
                            <div className="border-t border-slate-200 dark:border-border p-4 bg-slate-50 dark:bg-card">
                              <ProjectSubmissionComponent
                                project={project}
                                courseId={course.id}
                                studentId={studentInfo.id}
                                studentName={studentInfo.name}
                                existingSubmission={existingSubmission}
                                onSuccess={() => {
                                  setSelectedProjectId(null);
                                  window.location.reload();
                                }}
                              />
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>

                  {/* Leaderboard - Only for Enrolled Students */}
                  {isEnrolled && submissions.some(s => s.courseId === course.id && s.status === 'reviewed') && (
                    <div className="mt-6">
                      <ProjectsLeaderboard
                        courseId={course.id}
                        submissions={submissions.filter(s => s.courseId === course.id)}
                        courseTitle={course.title}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Instructor */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-4">Instructor</h2>
                <div className="flex items-start space-x-4">
                  <img 
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-1">{course.instructor.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{course.instructor.title}</p>
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-slate-900 dark:text-foreground">{course.instructor.rating}</span>
                        <span className="text-slate-600 dark:text-slate-400">Instructor Rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-foreground">{course.instructor.studentsCount.toLocaleString()}</span>
                        <span className="text-slate-600 dark:text-slate-400">Students</span>
                      </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{course.instructor.bio}</p>
                    {mentorCourses.length > 0 && (
                      <Button
                        onClick={() => router.push(`/portal/student/courses?mentor=${course.instructor.id}`)}
                        variant="outline"
                        className="border-slate-300 dark:border-border"
                      >
                        View All Courses
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Student reviews</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      {allReviews.length} reviews • Average rating: {course.rating.toFixed(1)}
                    </p>
                  </div>
                  {isEnrolled && !allReviews.some(r => r.studentName === studentInfo.name) && (
                    <Button
                      onClick={() => setShowWriteReview(!showWriteReview)}
                      variant="outline"
                      className="border-slate-300 dark:border-border"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Write Review
                    </Button>
                  )}
                </div>

                {/* Write Review Form */}
                {showWriteReview && isEnrolled && (
                  <Card className="mb-6 border border-slate-200 dark:border-border">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-slate-900 dark:text-foreground mb-4">Write Your Review</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setNewReview({ ...newReview, rating })}
                                className="focus:outline-none"
                              >
                                <Star className={`w-6 h-6 ${rating <= newReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-600'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Your Review</label>
                          <textarea
                            value={newReview.text}
                            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                            placeholder="Share your experience with this course..."
                            className="w-full p-3 border border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff]"
                            rows={4}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={handleSubmitReview}
                            className="bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white"
                          >
                            Submit Review
                          </Button>
                          <Button
                            onClick={() => {
                              setShowWriteReview(false);
                              setNewReview({ rating: 5, text: '' });
                            }}
                            variant="outline"
                            className="border-slate-300 dark:border-border"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Review Filters */}
                <div className="flex items-center space-x-2 flex-wrap mb-6">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter:</span>
                  {(['all', '5', '4', '3', '2', '1'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setReviewFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        reviewFilter === filter
                          ? 'bg-primary dark:bg-primary text-white'
                          : 'bg-slate-100 dark:bg-card text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-secondary'
                      }`}
                    >
                      {filter === 'all' ? 'All' : `${filter} Stars`}
                    </button>
                  ))}
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-200 dark:border-border pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.studentAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-semibold text-slate-900 dark:text-foreground">{review.studentName}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{review.date}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{review.text}</p>
                          <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                            👍 {review.helpful} helpful
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredReviews.length === 0 && (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    No reviews found for this rating filter.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="border-2 border-slate-200 dark:border-border shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail || course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      {course.price === 0 ? (
                        <div className="flex items-baseline space-x-2 mb-4">
                          <span className="text-4xl font-bold text-slate-900 dark:text-foreground">Free</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline space-x-2 mb-4">
                          <span className="text-4xl font-bold text-slate-900 dark:text-foreground">${course.price}</span>
                          {course.installmentEnabled && (
                            <span className="text-sm text-slate-600 dark:text-slate-400">or pay in installments</span>
                          )}
                        </div>
                      )}
                      
                      {!isEnrolled ? (
                        <div className="space-y-3">
                          <Button
                            onClick={handleEnroll}
                            disabled={isEnrolling}
                            className="w-full bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white py-6 text-lg font-bold"
                          >
                            {isEnrolling ? 'Enrolling...' : course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                          </Button>
                          <Button
                            onClick={handleWishlist}
                            variant="outline"
                            className={`w-full border-2 ${isWishlisted ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-border'}`}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <p className="font-semibold text-green-800 dark:text-green-300">You're enrolled!</p>
                            <p className="text-sm text-green-700 dark:text-green-400 mt-1">Progress: {enrollment?.progress || 0}%</p>
                          </div>
                          <Button
                            onClick={() => router.push(`/portal/student/courses/${course.id}/lessons/${course.modules[0]?.lessons[0]?.id}`)}
                            className="w-full bg-primary hover:bg-[#4f48cc] dark:bg-primary dark:hover:bg-primary text-white py-6 text-lg font-bold"
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Continue Learning
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Course Includes */}
                    <div className="border-t border-slate-200 dark:border-border pt-4 space-y-3">
                      <p className="font-semibold text-slate-900 dark:text-foreground mb-3">This course includes:</p>
                      <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <Video className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span>{totalDuration} hours on-demand video</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span>{totalLessons} lessons</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span>Certificate of completion</span>
                        </div>
                        {course.projects && course.projects.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span>{course.projects.length} hands-on projects</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground mb-6">Students also bought</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCourses.slice(relatedCoursesStart, relatedCoursesStart + 3).map((relatedCourse) => (
                <div 
                  key={relatedCourse.id}
                  onClick={() => router.push(`/portal/student/courses/${relatedCourse.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden rounded-lg mb-3">
                    <img 
                      src={relatedCourse.thumbnail}
                      alt={relatedCourse.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-foreground mb-2 group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2">
                    {relatedCourse.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{relatedCourse.rating}</span>
                    </div>
                    <span className="font-bold text-primary dark:text-primary">${relatedCourse.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {course && (
        <EnrollmentModal
          course={course}
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          onEnroll={handleEnrollmentConfirm}
        />
      )}
    </>
  );
}
