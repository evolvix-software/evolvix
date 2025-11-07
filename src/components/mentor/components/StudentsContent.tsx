"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  User,
  FileText
} from 'lucide-react';
import { StudentList, StudentProfile, FeedbackForm, DirectMessages } from './students';
import { Student, StudentFeedback, ChatConversation, ChatMessage } from './students/types';
import { 
  mockStudents, 
  mockStudentProgress, 
  mockFeedbacks, 
  mockChatConversations 
} from './students/mockData';

export function StudentsContent() {
  const { courses } = useAppSelector(state => state.courses);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'messages'>('list');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackCourseId, setFeedbackCourseId] = useState<string | undefined>();
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(mockFeedbacks);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockChatConversations);

  // Get mentor ID
  const [mentorId, setMentorId] = useState<string>('suhxil14@gmail.com');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || 'suhxil14@gmail.com');
    }
  }, []);

  // Get students enrolled in mentor's courses (using mock data)
  const enrolledStudents = useMemo(() => {
    // For now, use all mock students since they're enrolled in courses 5-9 which belong to the mentor
    // In production, this would filter based on actual enrollments
    const mentorCourseIds = courses
      .filter(c => c.instructor.id === mentorId)
      .map(c => c.id);
    
    // If no courses found or filtering returns empty, show all mock students
    const filtered = mockStudents.filter(student =>
      student.enrolledCourses.some(courseId => mentorCourseIds.includes(courseId))
    );
    
    // Return filtered students or all mock students if filter is empty
    return filtered.length > 0 ? filtered : mockStudents;
  }, [courses, mentorId]);

  // Get course progress for selected student
  const selectedStudentProgress = useMemo(() => {
    if (!selectedStudent) return [];
    return mockStudentProgress[selectedStudent.id] || [];
  }, [selectedStudent]);

  // Get existing feedback for selected student
  const existingFeedback = useMemo(() => {
    if (!selectedStudent || !feedbackCourseId) return undefined;
    return feedbacks.find(
      f => f.studentId === selectedStudent.id && f.courseId === feedbackCourseId
    );
  }, [selectedStudent, feedbackCourseId, feedbacks]);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('list');
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setActiveTab('list');
  };

  const handleGiveFeedback = (courseId?: string) => {
    setFeedbackCourseId(courseId);
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = (feedbackData: Omit<StudentFeedback, 'id' | 'submittedAt' | 'submittedBy'>) => {
    const newFeedback: StudentFeedback = {
      ...feedbackData,
      id: `feedback_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: mentorId
    };

    // Remove existing feedback for same student/course if updating
    const updatedFeedbacks = feedbacks.filter(
      f => !(f.studentId === feedbackData.studentId && f.courseId === feedbackData.courseId)
    );
    
    setFeedbacks([...updatedFeedbacks, newFeedback]);
    setShowFeedbackForm(false);
    setFeedbackCourseId(undefined);
  };

  const handleSendMessage = (studentId: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      studentId,
      mentorId,
      message,
      sender: 'mentor',
      timestamp: new Date().toISOString(),
      read: false
    };

    setConversations(prev => prev.map(conv => {
      if (conv.studentId === studentId) {
        return {
          ...conv,
          lastMessage: message,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMessage],
          unreadCount: 0
        };
      }
      return conv;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Student Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage students, track progress, provide feedback, and communicate
          </p>
        </div>
      </div>

      {/* Main Content */}
      {selectedStudent ? (
        // Show Student Profile
        <StudentProfile
          student={selectedStudent}
          courseProgress={selectedStudentProgress}
          onBack={handleBackToList}
          onMessage={() => setActiveTab('messages')}
          onGiveFeedback={() => handleGiveFeedback()}
        />
      ) : (
        // Show Tabs: Student List or Messages
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'messages')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Student List</span>
              {enrolledStudents.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                  {enrolledStudents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Direct Messages</span>
              {conversations.some(c => c.unreadCount > 0) && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <StudentList
              students={enrolledStudents}
              onSelectStudent={handleSelectStudent}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <DirectMessages
              conversations={conversations}
              mentorId={mentorId}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && selectedStudent && (
        <FeedbackForm
          student={selectedStudent}
          courseId={feedbackCourseId}
          existingFeedback={existingFeedback}
          onClose={() => {
            setShowFeedbackForm(false);
            setFeedbackCourseId(undefined);
          }}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
