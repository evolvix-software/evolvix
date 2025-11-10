"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/common/layout/Layout';
import { Button } from '@/components/common/forms/Button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { enrollCourse, completeLesson, setCurrentLesson } from '@/store/features/courses/coursesSlice';
import { Course } from '@/data/mock/coursesData';
import { Clock, Users, Star, Shield, BookOpen, CheckCircle, Play, Lock, User, ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Award, Download, X, Code, Trophy } from 'lucide-react';
import { ProjectSubmission as ProjectSubmissionComponent } from '@/components/common/projects/ProjectSubmission';
import { ProjectsLeaderboard } from '@/components/common/projects/ProjectsLeaderboard';
import { EnrollmentModal } from '@/components/pages/student/courses/EnrollmentModal';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  
  const { courses, enrolledCourses } = useAppSelector(state => state.courses);
  const { submissions } = useAppSelector(state => state.projects);
  const kycStatus = useAppSelector(state => state.verification.kycStatus);
  const status = kycStatus?.status || 'pending';
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [relatedCoursesStart, setRelatedCoursesStart] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  
  // Get student info
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
  }, []);

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

  const testimonials = [
    { id: 1, name: 'Alex Johnson', rating: 5, text: 'Excellent course! Very comprehensive and well-structured. The instructor breaks down complex topics into digestible lessons.', avatar: 'AJ' },
    { id: 2, name: 'Maria Garcia', rating: 5, text: 'Best investment I made for my career. Highly recommended! The practical examples are very helpful.', avatar: 'MG' },
    { id: 3, name: 'David Chen', rating: 5, text: 'The instructor explains concepts clearly. Great learning experience with hands-on projects.', avatar: 'DC' },
    { id: 4, name: 'Sarah Williams', rating: 5, text: 'Outstanding content and delivery. Worth every penny. I learned so much!', avatar: 'SW' },
    { id: 5, name: 'Michael Brown', rating: 5, text: 'Amazing course structure. The modules build on each other perfectly.', avatar: 'MB' },
    { id: 6, name: 'Emily Davis', rating: 5, text: 'Perfect for beginners. The pace is just right and explanations are crystal clear.', avatar: 'ED' },
    { id: 7, name: 'James Wilson', rating: 5, text: 'The best React course I\'ve ever taken. Worth the investment!', avatar: 'JW' },
    { id: 8, name: 'Lisa Anderson', rating: 5, text: 'Great instructor and amazing community support.', avatar: 'LA' },
  ];

  const showAlert = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setShowDialog(true);
  };

  const handleEnroll = () => {
    if (!course) return;
    // Show enrollment modal for payment selection
    if (course.price > 0) {
      setShowEnrollmentModal(true);
    } else {
      // Free course - enroll directly
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
      showAlert('Success!', 'Successfully enrolled in course!');
    }, 1000);
  };

  const handleEnrollmentConfirm = (paymentMethod: 'full' | 'installment', installments?: number) => {
    if (!course) return;
    setShowEnrollmentModal(false);
    
    // TODO: Process payment here
    // For now, just enroll
    enrollCourseDirectly();
    
    // Show payment info
    if (paymentMethod === 'installment' && installments) {
      const installmentAmount = course.price / installments;
      showAlert('Payment Plan Selected', `You'll pay $${installmentAmount.toFixed(2)} in ${installments} installments. First payment processed.`);
    } else {
      showAlert('Payment Processed', `Full payment of $${course.price.toLocaleString()} processed successfully.`);
    }
  };

  const handleDownloadStructure = () => {
    // TODO: Re-enable verification check after UI is complete
    // if (status !== 'verified') {
    //   showAlert('Verification Required', 'Please complete your verification before downloading course materials.');
    //   setTimeout(() => router.push('/portal/verification'), 1500);
    //   return;
    // }
    showAlert('Download Started', 'Your course structure is being downloaded...');
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
      const scrollAmount = 370; // width of card + gap
      if (direction === 'left') {
        reviewsScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        reviewsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!course) {
    return (
      <Layout title="Course Details" role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635bff] mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loading course...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  const visibleRelatedCourses = relatedCourses.slice(relatedCoursesStart, relatedCoursesStart + 3);

  return (
    <Layout title={course.title} role="student">
      {/* Dialog Component */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{dialogTitle}</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-6">{dialogMessage}</p>
            <Button
              onClick={() => setShowDialog(false)}
              className="w-full bg-[#635bff] hover:bg-[#4f48cc] text-white"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative h-80 rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold uppercase">
                {course.level}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg opacity-90">{course.description}</p>
          </div>
        </div>

        {/* Stats and CTA Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-slate-900 dark:text-white">{course.rating}</span>
              <span className="text-slate-600 dark:text-slate-400">({course.ratingCount} ratings)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Clock className="w-5 h-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Users className="w-5 h-5" />
              <span>{course.enrolledCount}+ students</span>
            </div>
          </div>
          {!isEnrolled && (
            <>
              {course.price === 0 ? (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-[#635bff] hover:bg-[#4f48cc] text-white px-8 py-3 text-lg font-semibold"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll for Free'}
                </Button>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="bg-[#635bff] hover:bg-[#4f48cc] text-white px-8 py-3 text-lg font-semibold"
                >
                  {isEnrolling ? 'Enrolling...' : `Enroll - $${course.price}`}
                  {course.installmentEnabled && (
                    <span className="ml-2 text-sm opacity-90">(or pay in installments)</span>
                  )}
                </Button>
              )}
            </>
          )}
          {isEnrolled && enrollment && (
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#635bff]">{enrollment.progress}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Complete</div>
              </div>
              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                <div className="bg-[#635bff] h-2 rounded-full" style={{ width: `${enrollment.progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Instructor Info - Top of Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={course.instructor.image}
                alt={course.instructor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{course.instructor.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{course.instructor.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{course.instructor.rating}</span>
                  <span className="text-sm text-slate-500">({course.instructor.studentsCount} students)</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block max-w-md text-sm text-slate-700 dark:text-slate-300">
              {course.instructor.bio}
            </div>
          </div>
        </div>

        {/* What You'll Learn - Full Width */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What You'll Learn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {course.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Course Content with Accordion - Full Width */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Course Content</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons in {course.modules.length} modules
              </p>
            </div>
            <Button
              onClick={handleDownloadStructure}
              variant="outline"
              className="border-[#635bff] text-[#635bff] hover:bg-[#635bff] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Structure
            </Button>
          </div>
          <div className="max-h-[800px] overflow-y-auto p-6 space-y-3">
            {course.modules.map((module, moduleIdx) => {
              const isExpanded = expandedModules.has(module.id);
              return (
                <div key={module.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="text-left">
                      <h4 className="font-bold text-slate-900 dark:text-white">Module {moduleIdx + 1}: {module.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{module.lessons.length} lessons</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-2 bg-slate-50 dark:bg-slate-900/50">
                      {module.lessons.map((lesson) => {
                        const isCompleted = enrollment?.completedLessons.includes(lesson.id);
                        const isLocked = !isEnrolled;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !isLocked && router.push(`/portal/student/courses/${course.id}/lessons/${lesson.id}`)}
                            disabled={isLocked}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                              isLocked
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                : isCompleted
                                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                                : 'bg-white dark:bg-slate-800 hover:border-[#635bff] border-2 border-transparent hover:shadow-sm'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {isLocked ? (
                                <Lock className="w-5 h-5" />
                              ) : isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Play className="w-5 h-5 text-[#635bff]" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`font-medium ${isLocked ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500">{lesson.duration}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects Section - Only for Enrolled Students */}
        {isEnrolled && course.projects && course.projects.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Code className="w-6 h-6 text-[#635bff]" />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Course Projects</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {course.projects.length} project{course.projects.length > 1 ? 's' : ''} • Best 3 students get Certificate & LOR
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Projects List */}
              <div className="space-y-4">
                {course.projects.map((project) => {
                  const existingSubmission = submissions.find(
                    s => s.projectId === project.id && s.studentId === studentInfo.id && s.courseId === course.id
                  );
                  const isSelected = selectedProjectId === project.id;
                  
                  return (
                    <div key={project.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setSelectedProjectId(isSelected ? null : project.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="text-left flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white">
                              {project.isFinalProject ? '🏆 Final Project' : `Project ${project.projectNumber}`}: {project.title}
                            </h4>
                            {existingSubmission && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
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
                          <p className="text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                            <span>Duration: {project.estimatedDuration}</span>
                            <span>Max Score: {project.maxScore}</span>
                            <span>Weight: {project.weight}%</span>
                            {project.dueDate && (
                              <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          {existingSubmission?.score !== undefined && (
                            <div className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                              Your Score: {existingSubmission.score}/{existingSubmission.maxScore}
                            </div>
                          )}
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                      </button>
                      {isSelected && (
                        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                          <ProjectSubmissionComponent
                            project={project}
                            courseId={course.id}
                            studentId={studentInfo.id}
                            studentName={studentInfo.name}
                            existingSubmission={existingSubmission}
                            onSuccess={() => {
                              setSelectedProjectId(null);
                              // Force re-render to show updated status
                              window.location.reload();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Leaderboard */}
              {submissions.some(s => s.courseId === course.id && s.status === 'reviewed') && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <ProjectsLeaderboard
                    courseId={course.id}
                    submissions={submissions.filter(s => s.courseId === course.id)}
                    courseTitle={course.title}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prerequisites - Horizontal Format */}
        {course.prerequisites.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-[#635bff]" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Prerequisites</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {course.prerequisites.map((prereq) => (
                <div
                  key={prereq.id}
                  className="min-w-[280px] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {prereq.completed ? (
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 rounded-full" />
                      )}
                      <div>
                        <p className={`font-semibold ${prereq.completed ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                          {prereq.title}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{prereq.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials - Full Width with Scroll Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-[#635bff]" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Student Reviews</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollReviews('left')}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollReviews('right')}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div 
            ref={reviewsScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-2" 
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="min-w-[350px] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 snap-start hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#635bff] to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{testimonial.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Courses - Carousel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">You May Also Like</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevRelatedCourses}
                disabled={relatedCoursesStart === 0}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400 px-2">
                {Math.floor(relatedCoursesStart / 3) + 1} / {Math.ceil(relatedCourses.length / 3)}
              </span>
              <button
                onClick={nextRelatedCourses}
                disabled={relatedCoursesStart >= relatedCourses.length - 3}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRelatedCourses.map((relatedCourse) => (
              <div 
                key={relatedCourse.id}
                onClick={() => router.push(`/portal/student/courses/${relatedCourse.id}`)}
                className="cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-[#635bff] transition-all group"
              >
                <img 
                  src={relatedCourse.thumbnail}
                  alt={relatedCourse.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#635bff] transition-colors line-clamp-2">
                    {relatedCourse.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{relatedCourse.rating}</span>
                    </div>
                    <span className="font-bold text-[#635bff]">${relatedCourse.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    </Layout>
  );
}