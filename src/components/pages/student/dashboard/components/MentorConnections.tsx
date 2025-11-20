"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Users, BookOpen, MessageSquare, Video, Star, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/hooks';

interface MentorInfo {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  coursesCount: number;
  studentsCount: number;
}

interface MentorCourse {
  id: string;
  title: string;
  mentor: MentorInfo;
  progress: number;
}

interface MentorFeedback {
  id: string;
  assignmentTitle: string;
  mentor: MentorInfo;
  feedback: string;
  score: number;
  date: string;
}

interface UpcomingMentorClass {
  id: string;
  title: string;
  mentor: MentorInfo;
  date: string;
  time: string;
  course: string;
}

export function MentorConnections() {
  const router = useRouter();
  const { courses } = useAppSelector((state) => state.courses);

  // Get enrolled courses from localStorage
  const getEnrolledCourses = () => {
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (enrollments) {
      try {
        const parsed = JSON.parse(enrollments);
        return parsed || [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const enrollments = getEnrolledCourses();

  // Get courses created by mentors (enrolled courses)
  const mentorCourses: MentorCourse[] = enrollments.map((enrollment: any) => {
    const course = courses.find(c => c.id === enrollment.courseId);
    if (course) {
      return {
        id: course.id,
        title: course.title,
        mentor: {
          id: course.instructor.id,
          name: course.instructor.name,
          rating: course.instructor.rating || course.rating || 4.5,
          coursesCount: 5, // TODO: Get from mentor data
          studentsCount: course.instructor.studentsCount || course.enrolledCount || 0
        },
        progress: enrollment.progress || 0
      };
    }
    return null;
  }).filter(Boolean) as MentorCourse[];

  // Mock mentor feedback data
  const mentorFeedback: MentorFeedback[] = [
    {
      id: '1',
      assignmentTitle: 'React Portfolio Project',
      mentor: {
        id: '1',
        name: 'John Doe',
        rating: 4.9,
        coursesCount: 8,
        studentsCount: 200
      },
      feedback: 'Excellent work! Your component structure is clean and well-organized. Consider adding more error handling.',
      score: 92,
      date: '2 days ago'
    },
    {
      id: '2',
      assignmentTitle: 'JavaScript Fundamentals Quiz',
      mentor: {
        id: '2',
        name: 'Jane Smith',
        rating: 4.7,
        coursesCount: 6,
        studentsCount: 150
      },
      feedback: 'Great progress! Keep practicing with async/await patterns.',
      score: 88,
      date: '5 days ago'
    }
  ];

  // Mock upcoming classes from mentors
  const upcomingMentorClasses: UpcomingMentorClass[] = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      mentor: {
        id: '1',
        name: 'John Doe',
        rating: 4.9,
        coursesCount: 8,
        studentsCount: 200
      },
      date: 'Today',
      time: '3:00 PM',
      course: 'React Development'
    },
    {
      id: '2',
      title: 'Node.js Best Practices',
      mentor: {
        id: '2',
        name: 'Jane Smith',
        rating: 4.7,
        coursesCount: 6,
        studentsCount: 150
      },
      date: 'Tomorrow',
      time: '2:00 PM',
      course: 'Node.js Basics'
    }
  ];

  const handleViewMentor = (mentorId: string) => {
    router.push(`/portal/student/mentors?mentor=${mentorId}`);
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/portal/student/courses/${courseId}`);
  };

  const handleJoinClass = (classId: string) => {
    router.push(`/portal/student/classes?join=${classId}`);
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700/50 bg-card dark:bg-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-foreground">
          <Users className="w-5 h-5 text-primary dark:text-primary" />
          <span>Mentor Connections</span>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Your mentors, courses, and upcoming sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Courses Created by Mentors */}
        {mentorCourses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-foreground flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>My Mentor Courses</span>
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/student/courses')}
                className="text-xs h-7"
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {mentorCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => handleViewCourse(course.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-foreground">{course.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-slate-600 dark:text-slate-400">by {course.mentor.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{course.mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Live Classes from Mentors */}
        {upcomingMentorClasses.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-foreground flex items-center space-x-2">
                <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Upcoming Mentor Classes</span>
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/student/classes')}
                className="text-xs h-7"
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {upcomingMentorClasses.slice(0, 2).map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-3 border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg hover:bg-purple-100/70 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-foreground">{classItem.title}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {classItem.mentor.name} • {classItem.course}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap ml-2">
                      {classItem.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{classItem.time}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => handleJoinClass(classItem.id)}
                    >
                      Join Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentor Feedback */}
        {mentorFeedback.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-foreground flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Recent Mentor Feedback</span>
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/portal/student/assignments')}
                className="text-xs h-7"
              >
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {mentorFeedback.slice(0, 2).map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-3 border border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10 rounded-lg hover:bg-green-100/70 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
                  onClick={() => router.push('/portal/student/assignments')}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-foreground">{feedback.assignmentTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-slate-600 dark:text-slate-400">by {feedback.mentor.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">{feedback.mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap ml-2">
                      {feedback.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2">
                    {feedback.feedback}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{feedback.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Mentors Link */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="outline"
            className="w-full border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => router.push('/portal/student/mentors')}
          >
            <Users className="w-4 h-4 mr-2" />
            View All Mentors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

