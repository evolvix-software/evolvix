"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Calendar, Clock, Users, Video, Play, BookOpen } from 'lucide-react';
import { useAppSelector } from '@/hooks';
import { MentorClass } from '@/store/features/classes/classesSlice';
import { JoinClassComponent } from '@/components/pages/student/classes/components';

export default function StudentClassesPage() {
  const { classes } = useAppSelector((state) => state.classes);
  const { courses } = useAppSelector((state) => state.courses);
  const [selectedClass, setSelectedClass] = useState<MentorClass | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  // Get classes for courses the student is enrolled in
  const enrolledCourseIds = courses
    .filter(c => {
      const enrollments = localStorage.getItem('evolvix_enrollments');
      if (enrollments) {
        const enrollmentList = JSON.parse(enrollments);
        return enrollmentList.some((e: any) => e.courseId === c.id);
      }
      return false;
    })
    .map(c => c.id);

  // Filter classes for enrolled courses
  const myClasses = classes.filter(c => 
    c.courseId && enrolledCourseIds.includes(c.courseId) && 
    (c.status === 'upcoming' || c.status === 'live')
  );

  // Sort by date/time
  const upcomingClasses = myClasses
    .filter(c => c.status === 'upcoming')
    .sort((a, b) => 
      new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );

  const liveClasses = myClasses.filter(c => c.status === 'live');

  const canJoinClass = (classItem: MentorClass) => {
    if (!classItem.date || !classItem.time) return true;
    
    const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
    const now = new Date();
    const joinTime = new Date(classDateTime.getTime() - 5 * 60 * 1000);
    
    return now >= joinTime;
  };

  return (
    <Layout title="My Classes" role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">My Classes</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Join live classes for your enrolled courses
          </p>
        </div>

        {/* Live Classes */}
        {liveClasses.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse" />
              Live Classes
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveClasses.map((classItem) => (
                <Card key={classItem.id} className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                          {classItem.topic}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{classItem.date} at {classItem.time}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        LIVE
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Course:</span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate ml-2">
                          {classItem.courseName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                        <span className="font-semibold">{classItem.duration} min</span>
                      </div>
                      <Button
                        onClick={() => setSelectedClass(classItem)}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
              Upcoming Classes
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingClasses.map((classItem) => {
                const canJoin = canJoinClass(classItem);
                const classDateTime = new Date(`${classItem.date}T${classItem.time}`);
                const now = new Date();
                const diff = classDateTime.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                return (
                  <Card key={classItem.id} className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                        {classItem.topic}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.date} at {classItem.time}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Course:</span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate ml-2">
                            {classItem.courseName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                          <span className="font-semibold">{classItem.duration} min</span>
                        </div>
                        {canJoin ? (
                          <Button
                            onClick={() => setSelectedClass(classItem)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Join Class
                          </Button>
                        ) : (
                          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                Starts in {hours > 0 && `${hours}h `}{minutes}m
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {liveClasses.length === 0 && upcomingClasses.length === 0 && (
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No classes scheduled
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Enroll in courses to see upcoming live classes
              </p>
              <Button
                onClick={() => window.location.href = '/portal/student/courses'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Join Class Modal */}
        {selectedClass && userData && (
          <JoinClassComponent
            classItem={selectedClass}
            studentName={userData.fullName || 'Student'}
            studentEmail={userData.email || 'student@example.com'}
            onClose={() => setSelectedClass(null)}
          />
        )}
      </div>
    </Layout>
  );
}

