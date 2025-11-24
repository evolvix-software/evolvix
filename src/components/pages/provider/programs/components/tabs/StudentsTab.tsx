"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Search, Users, TrendingUp, Award, MessageSquare, Download, Eye } from 'lucide-react';
import { Course } from '@/data/mock/providerData';
import { useRouter } from 'next/navigation';

interface StudentsTabProps {
  course: Course;
  courseId: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  completionStatus: 'not-started' | 'in-progress' | 'completed';
  grade?: number;
  scholarshipStatus: 'awarded' | 'pending' | 'none';
  enrolledDate: Date;
  lastActive: Date;
}

export function StudentsTab({ course, courseId }: StudentsTabProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [filterScholarship, setFilterScholarship] = useState<'all' | 'awarded' | 'pending' | 'none'>('all');

  // Mock student data
  const mockStudents: Student[] = [
    {
      id: 'student_1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      progress: 85,
      completionStatus: 'in-progress',
      grade: 92,
      scholarshipStatus: 'awarded',
      enrolledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'student_2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      progress: 100,
      completionStatus: 'completed',
      grade: 95,
      scholarshipStatus: 'awarded',
      enrolledDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'student_3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      progress: 45,
      completionStatus: 'in-progress',
      scholarshipStatus: 'pending',
      enrolledDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'student_4',
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      progress: 10,
      completionStatus: 'not-started',
      scholarshipStatus: 'none',
      enrolledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.completionStatus === filterStatus;
    const matchesScholarship = filterScholarship === 'all' || student.scholarshipStatus === filterScholarship;
    return matchesSearch && matchesStatus && matchesScholarship;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">All Statuses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterScholarship}
                onChange={(e) => setFilterScholarship(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="all">All Scholarship Status</option>
                <option value="awarded">Awarded</option>
                <option value="pending">Pending</option>
                <option value="none">None</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Enrolled Students ({filteredStudents.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Total: {mockStudents.length}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No students found matching your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <StatusBadge
                          status={
                            student.completionStatus === 'completed'
                              ? 'completed'
                              : student.completionStatus === 'in-progress'
                              ? 'open'
                              : 'draft'
                          }
                        />
                        {student.scholarshipStatus === 'awarded' && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Scholarship Awarded
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{student.email}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(student.progress)}`}
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${getProgressColor(student.progress)}`}>
                              {student.progress}%
                            </span>
                          </div>
                        </div>
                        {student.grade && (
                          <div>
                            <p className="text-muted-foreground">Grade</p>
                            <p className="font-semibold text-foreground">{student.grade}%</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Enrolled</p>
                          <p className="font-semibold text-foreground">
                            {student.enrolledDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Active</p>
                          <p className="font-semibold text-foreground">
                            {student.lastActive.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Progress
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {}}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

