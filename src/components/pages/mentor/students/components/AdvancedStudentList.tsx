"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  Star,
  Tag,
  X,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Student } from '@/interfaces/students';
import { useAppSelector } from '@/hooks';

interface AdvancedStudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onBulkAction: (action: string, studentIds: string[]) => void;
  selectedStudentId?: string;
}

export function AdvancedStudentList({ 
  students, 
  onSelectStudent, 
  onBulkAction,
  selectedStudentId 
}: AdvancedStudentListProps) {
  const { courses } = useAppSelector(state => state.courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'recent' | 'rating' | 'engagement'>('name');
  const [filterByCourse, setFilterByCourse] = useState<string>('all');
  const [filterByPerformance, setFilterByPerformance] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterByEngagement, setFilterByEngagement] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterByStatus, setFilterByStatus] = useState<'all' | 'enrolled' | 'completed' | 'dropped' | 'at-risk'>('all');
  const [filterByPayment, setFilterByPayment] = useState<'all' | 'paid' | 'unpaid' | 'partial'>('all');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      // Search filter
      const matchesSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Course filter
      const matchesCourse = filterByCourse === 'all' || 
        student.enrolledCourses.includes(filterByCourse);
      
      // Performance filter
      const matchesPerformance = filterByPerformance === 'all' ||
        (filterByPerformance === 'high' && (student.performanceLevel === 'high' || student.overallProgress >= 80)) ||
        (filterByPerformance === 'medium' && (student.performanceLevel === 'medium' || (student.overallProgress >= 50 && student.overallProgress < 80))) ||
        (filterByPerformance === 'low' && (student.performanceLevel === 'low' || student.overallProgress < 50));
      
      // Engagement filter
      const matchesEngagement = filterByEngagement === 'all' ||
        (filterByEngagement === 'high' && (student.engagementLevel === 'high' || (student.loginFrequency || 0) >= 5)) ||
        (filterByEngagement === 'medium' && (student.engagementLevel === 'medium' || ((student.loginFrequency || 0) >= 2 && (student.loginFrequency || 0) < 5))) ||
        (filterByEngagement === 'low' && (student.engagementLevel === 'low' || (student.loginFrequency || 0) < 2));
      
      // Status filter
      const matchesStatus = filterByStatus === 'all' ||
        student.status === filterByStatus;
      
      // Payment filter
      const matchesPayment = filterByPayment === 'all' ||
        student.paymentStatus === filterByPayment;
      
      return matchesSearch && matchesCourse && matchesPerformance && matchesEngagement && matchesStatus && matchesPayment;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return b.overallProgress - a.overallProgress;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'engagement':
          return (b.loginFrequency || 0) - (a.loginFrequency || 0);
        case 'recent':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [students, searchQuery, sortBy, filterByCourse, filterByPerformance, filterByEngagement, filterByStatus, filterByPayment]);

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredAndSortedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredAndSortedStudents.map(s => s.id)));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkAction = (action: string) => {
    if (selectedStudents.size === 0) return;
    onBulkAction(action, Array.from(selectedStudents));
    setSelectedStudents(new Set());
  };

  const handleExport = () => {
    const data = filteredAndSortedStudents.map(s => ({
      name: s.name,
      email: s.email,
      progress: s.overallProgress,
      courses: s.enrolledCourses.length,
      assignments: `${s.assignmentsCompleted}/${s.assignmentsTotal}`,
      rating: s.rating || 0,
      status: s.status || 'enrolled',
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const mentorCourses = courses.filter(c => c.instructor.id === 'suhxil14@gmail.com' || 
    localStorage.getItem('evolvix_registration')?.includes('email') ? 
    JSON.parse(localStorage.getItem('evolvix_registration') || '{}').email : '');

  return (
    <div className="space-y-4">
      {/* Enhanced Header with Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, email, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Filter */}
          <select
            value={filterByCourse}
            onChange={(e) => setFilterByCourse(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Courses</option>
            {mentorCourses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {/* Performance Filter */}
          <select
            value={filterByPerformance}
            onChange={(e) => setFilterByPerformance(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Performance</option>
            <option value="high">High Achievers</option>
            <option value="medium">Medium Achievers</option>
            <option value="low">Low Achievers</option>
          </select>

          {/* Engagement Filter */}
          <select
            value={filterByEngagement}
            onChange={(e) => setFilterByEngagement(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Engagement</option>
            <option value="high">High Engagement</option>
            <option value="medium">Medium Engagement</option>
            <option value="low">Low Engagement</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="at-risk">At Risk</option>
          </select>

          {/* Payment Filter */}
          <select
            value={filterByPayment}
            onChange={(e) => setFilterByPayment(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="all">All Payment</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="rating">Sort by Rating</option>
            <option value="engagement">Sort by Engagement</option>
            <option value="recent">Sort by Recent</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 border border-slate-300 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-foreground' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-foreground' : 'text-slate-600 dark:text-slate-400'}`}
            >
              List
            </button>
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-slate-300 dark:border-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedStudents.size > 0 && (
          <Card className="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-900 dark:text-foreground">
                    {selectedStudents.size} student{selectedStudents.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStudents(new Set())}
                    className="text-slate-600 dark:text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('message')}
                    className="border-slate-300 dark:border-slate-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('email')}
                    className="border-slate-300 dark:border-slate-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export')}
                    className="border-slate-300 dark:border-slate-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            Showing {filteredAndSortedStudents.length} of {students.length} students
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Filter className="w-4 h-4" />
            <span>{showFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Student Cards/List */}
      {filteredAndSortedStudents.length === 0 ? (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-2">
              No students found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery || filterByCourse !== 'all' || filterByPerformance !== 'all' || filterByEngagement !== 'all' || filterByStatus !== 'all' || filterByPayment !== 'all'
                ? 'Try adjusting your filters'
                : 'No students enrolled yet'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
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
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectStudent(student.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1 -left-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600 bg-card dark:bg-slate-800 z-10"
                    />
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
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-card dark:border-slate-800 rounded-full ${
                      student.status === 'at-risk' ? 'bg-slate-500' :
                      student.status === 'completed' ? 'bg-slate-600' :
                      'bg-slate-400 dark:bg-slate-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-foreground truncate">
                          {student.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {student.email}
                        </p>
                      </div>
                      {student.status && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          student.status === 'at-risk' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                          student.status === 'completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                          'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                        }`}>
                          {student.status.replace('-', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
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
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {student.overallProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-slate-600 dark:bg-slate-500"
                      style={{ width: `${student.overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Assignments</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                      {student.assignmentsCompleted}/{student.assignmentsTotal}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-1 mb-1">
                      <Users className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs text-slate-600 dark:text-slate-400">Courses</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-foreground">
                      {student.enrolledCourses.length}
                    </p>
                  </div>
                </div>

                {/* Engagement & Performance Indicators */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  {student.engagementLevel && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Engagement:</span>
                      <span className={`text-xs font-semibold ${
                        student.engagementLevel === 'high' ? 'text-slate-900 dark:text-foreground' :
                        student.engagementLevel === 'medium' ? 'text-slate-700 dark:text-slate-300' :
                        'text-slate-500 dark:text-slate-500'
                      }`}>
                        {student.engagementLevel.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {student.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-foreground">
                        {student.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {student.tags && student.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {student.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {student.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-slate-600 dark:text-slate-400 text-xs">
                        +{student.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
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
                    <FileText className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedStudents.map((student) => (
            <Card
              key={student.id}
              className={`border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                selectedStudentId === student.id
                  ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800/50'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              onClick={() => onSelectStudent(student)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.has(student.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectStudent(student.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                  />
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-foreground">{student.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Progress: </span>
                      <span className="font-semibold text-slate-900 dark:text-foreground">{student.overallProgress}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Courses: </span>
                      <span className="font-semibold text-slate-900 dark:text-foreground">{student.enrolledCourses.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Assignments: </span>
                      <span className="font-semibold text-slate-900 dark:text-foreground">{student.assignmentsCompleted}/{student.assignmentsTotal}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {student.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-slate-600 dark:text-slate-400 fill-slate-600 dark:fill-slate-400" />
                          <span className="text-sm font-semibold text-slate-900 dark:text-foreground">{student.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {student.status && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          student.status === 'at-risk' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                          student.status === 'completed' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                          'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                        }`}>
                          {student.status.replace('-', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

