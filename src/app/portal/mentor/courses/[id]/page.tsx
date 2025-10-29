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
import { Code, FileText, Users, Trophy, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function MentorCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courses } = useAppSelector(state => state.courses);
  const { submissions, doubtClearingSessions } = useAppSelector(state => state.projects);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('projects');

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
          <TabsList className="grid w-full grid-cols-3">
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

