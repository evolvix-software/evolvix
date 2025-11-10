"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  MessageSquare, 
  User,
  CheckCircle2,
  Clock,
  Star,
  ClipboardCheck
} from 'lucide-react';
import { Student } from '@/interfaces/students';
import { mockStudentProgress } from '@/data/mock/students';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudentId?: string;
}

export function StudentList({ students, onSelectStudent, selectedStudentId }: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'recent'>('name');
  const [filterByProgress, setFilterByProgress] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      // Search filter
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Progress filter
      const matchesProgress = 
        filterByProgress === 'all' ||
        (filterByProgress === 'high' && student.overallProgress >= 80) ||
        (filterByProgress === 'medium' && student.overallProgress >= 50 && student.overallProgress < 80) ||
        (filterByProgress === 'low' && student.overallProgress < 50);
      
      return matchesSearch && matchesProgress;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.overallProgress - a.overallProgress;
        case 'recent':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [students, searchQuery, sortBy, filterByProgress]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressLabel = (progress: number) => {
    if (progress >= 80) return 'Excellent';
    if (progress >= 50) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Students ({filteredAndSortedStudents.length})
          </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'progress' | 'recent')}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="recent">Sort by Recent</option>
          </select>

          {/* Filter */}
          <select
            value={filterByProgress}
            onChange={(e) => setFilterByProgress(e.target.value as 'all' | 'high' | 'medium' | 'low')}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Progress</option>
            <option value="high">High (80%+)</option>
            <option value="medium">Medium (50-79%)</option>
            <option value="low">Low (&lt;50%)</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredAndSortedStudents.length === 0 ? (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No students found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? 'Try adjusting your search query' : 'No students enrolled yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedStudents.map((student) => (
            <Card
              key={student.id}
              className={`border transition-all duration-200 cursor-pointer hover:shadow-md ${
                selectedStudentId === student.id
                  ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/50'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => onSelectStudent(student)}
            >
              <CardContent className="p-5">
                {/* Student Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                          {student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 dark:bg-slate-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                      {student.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {student.email}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {student.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Overall Progress
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {student.overallProgress}%
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({getProgressLabel(student.overallProgress)})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(student.overallProgress)}`}
                      style={{ width: `${student.overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Assignments</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {student.assignmentsCompleted}/{student.assignmentsTotal}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <User className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Courses</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {student.enrolledCourses.length}
                    </p>
                  </div>
                </div>

                {/* Test Completions Badge */}
                {(() => {
                  const studentProgress = mockStudentProgress[student.id] || [];
                  const totalTests = studentProgress.reduce((sum, p) => sum + (p.testCompletions?.length || 0), 0);
                  const passedTests = studentProgress.reduce((sum, p) => 
                    sum + (p.testCompletions?.filter(t => t.passed).length || 0), 0
                  );
                  
                  if (totalTests > 0) {
                    return (
                      <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ClipboardCheck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">Module Tests</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              {passedTests}/{totalTests} passed
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Rating */}
                {student.rating && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {student.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

