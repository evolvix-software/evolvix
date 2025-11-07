"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { useAppSelector } from '@/store/hooks';
import { Course } from '@/data/mock/coursesData';
import { ProjectEvaluation } from '@/components/projects/ProjectEvaluation';
import { ProjectsLeaderboard } from '@/components/projects/ProjectsLeaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Users, Trophy, Calendar, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, Play, Video, BookOpen } from 'lucide-react';

export default function MentorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const { submissions, doubtClearingSessions } = useAppSelector(state => state.projects);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === params.id);
    if (foundCourse) {
      setCourse(foundCourse);
    }
  }, [courses, params.id]);

  if (!course) {
    return (
      <Layout title="Course Details" role="mentor">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loading course...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  const courseSubmissions = submissions.filter(s => s.courseId === course.id);
  const pendingSubmissions = courseSubmissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = courseSubmissions.filter(s => s.status === 'reviewed');
  const returnedSubmissions = courseSubmissions.filter(s => s.status === 'returned');

  const getProjectSubmissions = (projectId: string) => {
    return courseSubmissions.filter(s => s.projectId === projectId);
  };

  const getUnreviewedCount = (projectId: string) => {
    return getProjectSubmissions(projectId).filter(s => s.status === 'pending').length;
  };

  return (
    <Layout title={course.title} role="mentor">
      <div className="space-y-6">
        {/* Course Header */}
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{course.enrolledCount} enrolled</span>
                  <span>•</span>
                  <span>{course.projects?.length || 0} projects</span>
                  <span>•</span>
                  <span>{courseSubmissions.length} submissions</span>
                </div>
              </div>
              <Button
                onClick={() => router.push('/portal/mentor/courses')}
                variant="outline"
                className="border-slate-200 dark:border-slate-700"
              >
                Back to Courses
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Modules</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span>Projects</span>
              {pendingSubmissions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {pendingSubmissions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
            {course.enableSundayDoubtClearing && (
              <TabsTrigger value="doubt-sessions" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Doubt Sessions</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules.map((module, moduleIdx) => {
                  const isExpanded = expandedModules.has(module.id);
                  const toggleModule = () => {
                    const newExpanded = new Set(expandedModules);
                    if (isExpanded) {
                      newExpanded.delete(module.id);
                    } else {
                      newExpanded.add(module.id);
                    }
                    setExpandedModules(newExpanded);
                  };

                  return (
                    <Card key={module.id} className="border border-slate-200 dark:border-slate-700">
                      <CardHeader>
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={toggleModule}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {moduleIdx + 1}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {module.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center space-x-1">
                                  <Play className="w-3 h-3" />
                                  <span>{module.lessons.length} {module.lessons.length === 1 ? 'Lesson' : 'Lessons'}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModule();
                            }}
                            className="ml-4"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="pt-0">
                          <div className="space-y-3 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                            {module.lessons.map((lesson, lessonIdx) => (
                              <div
                                key={lesson.id}
                                className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5">
                                  <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs">
                                    {lessonIdx + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                        {lesson.type === 'video' && <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                        {lesson.type === 'reading' && <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                        {lesson.type === 'quiz' && <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                                        <span>{lesson.title}</span>
                                      </h4>
                                      {lesson.content && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                          {lesson.content}
                                        </p>
                                      )}
                                      {lesson.videoUrl && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                          Video available
                                        </p>
                                      )}
                                      {lesson.liveSessionLink && (
                                        <a
                                          href={lesson.liveSessionLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                                        >
                                          Join Live Session →
                                        </a>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-3 ml-4">
                                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{lesson.duration}</span>
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Assignment */}
                                  {lesson.assignment && (
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                      <div className="flex items-start space-x-2">
                                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                            Assignment: {lesson.assignment.title}
                                          </h5>
                                          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                            {lesson.assignment.description}
                                          </p>
                                          <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
                                            <span>Max Score: {lesson.assignment.maxScore}</span>
                                            {lesson.assignment.dueDate && (
                                              <span>Due: {new Date(lesson.assignment.dueDate).toLocaleDateString()}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Test */}
                                  {lesson.test && (
                                    <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                                      <div className="flex items-start space-x-2">
                                        <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                          <h5 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                                            Quiz: {lesson.test.title}
                                          </h5>
                                          <div className="flex items-center space-x-4 mt-2 text-xs text-orange-600 dark:text-orange-400">
                                            <span>{lesson.test.questions.length} Questions</span>
                                            <span>Passing Score: {lesson.test.passingScore}%</span>
                                            {lesson.test.timeLimit && (
                                              <span>Time Limit: {lesson.test.timeLimit} min</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Modules Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This course doesn't have any modules configured yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {course.projects && course.projects.length > 0 ? (
              <div className="space-y-6">
                {course.projects.map((project) => {
                  const projectSubmissions = getProjectSubmissions(project.id);
                  const unreviewedCount = getUnreviewedCount(project.id);
                  
                  return (
                    <Card key={project.id} className="border border-slate-200 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span>
                              {project.isFinalProject ? '🏆 Final Project' : `Project ${project.projectNumber}`}: {project.title}
                            </span>
                            {unreviewedCount > 0 && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {unreviewedCount} pending
                              </span>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{project.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Technologies:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.map((tech, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Max Score:</span>
                                <p className="font-semibold text-slate-900 dark:text-white">{project.maxScore}</p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Weight:</span>
                                <p className="font-semibold text-slate-900 dark:text-white">{project.weight}%</p>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Submissions:</span>
                                <p className="font-semibold text-slate-900 dark:text-white">{projectSubmissions.length}</p>
                              </div>
                            </div>
                          </div>

                          {/* Submissions List */}
                          {projectSubmissions.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                              <p className="text-slate-600 dark:text-slate-400">No submissions yet</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4 text-sm">
                                <button
                                  onClick={() => {/* Filter by pending */}}
                                  className={`px-3 py-1 rounded-lg ${
                                    activeTab === 'projects' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  Pending ({projectSubmissions.filter(s => s.status === 'pending').length})
                                </button>
                                <button
                                  onClick={() => {/* Filter by reviewed */}}
                                  className={`px-3 py-1 rounded-lg ${
                                    activeTab === 'projects' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  Reviewed ({projectSubmissions.filter(s => s.status === 'reviewed').length})
                                </button>
                                <button
                                  onClick={() => {/* Filter by returned */}}
                                  className={`px-3 py-1 rounded-lg ${
                                    activeTab === 'projects' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  Returned ({projectSubmissions.filter(s => s.status === 'returned').length})
                                </button>
                              </div>
                              
                              {projectSubmissions.map((submission) => (
                                <ProjectEvaluation
                                  key={submission.id}
                                  submission={submission}
                                  project={project}
                                  onEvaluated={() => {
                                    // Refresh page to update rankings
                                    window.location.reload();
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Code className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Projects Configured</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Add projects to this course to enable student submissions
                  </p>
                  <Button
                    onClick={() => router.push('/portal/mentor/courses')}
                    variant="outline"
                    className="border-slate-200 dark:border-slate-700"
                  >
                    Edit Course to Add Projects
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            {courseSubmissions.some(s => s.status === 'reviewed') ? (
              <ProjectsLeaderboard
                courseId={course.id}
                submissions={courseSubmissions}
                courseTitle={course.title}
              />
            ) : (
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Rankings Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Leaderboard will appear after you evaluate at least one project submission
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Doubt Sessions Tab */}
          {course.enableSundayDoubtClearing && (
            <TabsContent value="doubt-sessions">
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Sunday Doubt Clearing Sessions
                    </CardTitle>
                    <Button
                      onClick={() => {
                        // Navigate to classes page to schedule doubt session
                        router.push(`/portal/mentor/classes?courseId=${course.id}&type=doubt-session`);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Session
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {doubtClearingSessions.filter(s => s.courseId === course.id).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">No sessions scheduled yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {doubtClearingSessions
                        .filter(s => s.courseId === course.id)
                        .map((session) => (
                          <div
                            key={session.id}
                            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {session.time} • {session.duration} minutes • {session.platform}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {session.attendance.length} students attended
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded text-xs font-medium ${
                                  session.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                  session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                }`}>
                                  {session.status === 'scheduled' ? <Clock className="w-3 h-3 inline mr-1" /> :
                                   session.status === 'completed' ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> :
                                   <XCircle className="w-3 h-3 inline mr-1" />}
                                  {session.status}
                                </span>
                                {session.meetingLink && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(session.meetingLink, '_blank')}
                                    className="border-slate-200 dark:border-slate-700"
                                  >
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}

