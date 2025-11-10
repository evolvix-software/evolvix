"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Upload,
  Bot,
  Send,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Edit,
  Download,
} from 'lucide-react';
import { Course, Module } from '@/data/mock/coursesData';
import { CreateTestModal } from './components/CreateTestModal';
import { TestList } from './components/TestList';

export interface TestQuestion {
  id: string;
  question: string;
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface ModuleTest {
  id: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  title: string;
  documentUrl?: string;
  documentName?: string;
  questions: TestQuestion[];
  passingScore: number;
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  openedAt: string;
  closesAt: string;
  assignedTo: string[]; // Student IDs
  createdAt: string;
  status: 'draft' | 'published' | 'closed';
}

export function TestsPage() {
  const searchParams = useSearchParams();
  const { courses } = useAppSelector(state => state.courses);
  const [mentorId, setMentorId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tests, setTests] = useState<ModuleTest[]>([]);
  const [preSelectedCourseId, setPreSelectedCourseId] = useState<string>('');
  const [preSelectedModuleId, setPreSelectedModuleId] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
    }
  }, []);

  // Handle query parameters and sessionStorage for pre-selection
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('moduleId');
    const create = searchParams.get('create');

    if (courseId && moduleId && create === 'true') {
      // Check sessionStorage for pending course info
      const pendingCourse = sessionStorage.getItem('pending_test_course');
      if (pendingCourse) {
        try {
          const data = JSON.parse(pendingCourse);
          setPreSelectedCourseId(data.courseId || courseId);
          setPreSelectedModuleId(data.moduleId || moduleId);
          setActiveTab('create');
          setShowCreateModal(true);
          // Clear sessionStorage after use
          sessionStorage.removeItem('pending_test_course');
        } catch (e) {
          console.error('Error parsing pending course data:', e);
        }
      } else {
        // Use query params directly
        setPreSelectedCourseId(courseId);
        setPreSelectedModuleId(moduleId);
        setActiveTab('create');
        setShowCreateModal(true);
      }
    }
  }, [searchParams]);

  // Load tests from localStorage or initialize with mock data
  useEffect(() => {
    const storedTests = localStorage.getItem('evolvix_module_tests');
    if (storedTests) {
      try {
        const parsedTests = JSON.parse(storedTests);
        // If stored tests exist but is empty array, initialize with mock data
        if (Array.isArray(parsedTests) && parsedTests.length === 0) {
          // Initialize with mock tests
          const mockTests: ModuleTest[] = [
            {
              id: 'test_module1_course7',
              courseId: '7',
              moduleId: 'm12',
              moduleTitle: 'Python for Data Science',
              courseTitle: 'Complete Python Data Science & Machine Learning',
              title: 'Module 1 Assessment',
              documentName: 'python_basics.pdf',
              questions: [
                {
                  id: 'q_1',
                  question: 'What is the main topic covered in Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['Introduction to the topic', 'Advanced concepts', 'Practical applications', 'All of the above'],
                  correctAnswer: 'All of the above',
                  points: 10,
                },
                {
                  id: 'q_2',
                  question: 'Which concept is most important in Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['Basic understanding', 'Hands-on practice', 'Theoretical knowledge', 'All are equally important'],
                  correctAnswer: 'All are equally important',
                  points: 10,
                },
                {
                  id: 'q_3',
                  question: 'What should students focus on when studying Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['Memorization only', 'Understanding concepts', 'Practical application', 'Both understanding and practice'],
                  correctAnswer: 'Both understanding and practice',
                  points: 10,
                },
                {
                  id: 'q_4',
                  question: 'How does Python for Data Science relate to the overall course?',
                  type: 'multiple-choice' as const,
                  options: ['It is independent', 'It builds on previous modules', 'It is optional', 'It replaces other modules'],
                  correctAnswer: 'It builds on previous modules',
                  points: 10,
                },
                {
                  id: 'q_5',
                  question: 'What is the best approach to master Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['Reading only', 'Watching videos only', 'Combining reading, videos, and practice', 'Skipping to next module'],
                  correctAnswer: 'Combining reading, videos, and practice',
                  points: 10,
                },
                {
                  id: 'q_6',
                  question: 'Which of the following best describes the learning objectives of Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['To introduce basic concepts only', 'To provide comprehensive understanding and practical skills', 'To focus on advanced topics', 'To review previous material'],
                  correctAnswer: 'To provide comprehensive understanding and practical skills',
                  points: 10,
                },
                {
                  id: 'q_7',
                  question: 'What type of assessment is most appropriate for Python for Data Science?',
                  type: 'multiple-choice' as const,
                  options: ['Written exams only', 'Practical projects only', 'Combination of quizzes and hands-on exercises', 'No assessment needed'],
                  correctAnswer: 'Combination of quizzes and hands-on exercises',
                  points: 10,
                },
                {
                  id: 'q_8',
                  question: 'Students should complete Python for Data Science before moving to the next module because:',
                  type: 'multiple-choice' as const,
                  options: ['It is mandatory', 'It provides foundational knowledge for subsequent topics', 'It contains important assignments', 'All of the above'],
                  correctAnswer: 'All of the above',
                  points: 10,
                },
                {
                  id: 'q_9',
                  question: 'The key takeaway from Python for Data Science is:',
                  type: 'multiple-choice' as const,
                  options: ['Understanding theoretical concepts', 'Applying knowledge in real-world scenarios', 'Both theoretical understanding and practical application', 'Memorizing facts and figures'],
                  correctAnswer: 'Both theoretical understanding and practical application',
                  points: 10,
                },
                {
                  id: 'q_10',
                  question: 'To succeed in Python for Data Science, students should:',
                  type: 'multiple-choice' as const,
                  options: ['Study passively without practice', 'Focus only on assignments', 'Engage actively with all materials, complete assignments, and practice regularly', 'Skip difficult sections'],
                  correctAnswer: 'Engage actively with all materials, complete assignments, and practice regularly',
                  points: 10,
                },
              ],
              passingScore: 60,
              timeLimit: 15,
              attemptsAllowed: 1,
              openedAt: new Date().toISOString(),
              closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              assignedTo: ['student_1', 'student_2', 'student_3', 'student_6', 'rasmioff@gmail.com'],
              createdAt: new Date().toISOString(),
              status: 'published' as const,
            },
          ];
          setTests(mockTests);
          localStorage.setItem('evolvix_module_tests', JSON.stringify(mockTests));
        } else {
          setTests(parsedTests);
        }
      } catch (e) {
        console.error('Error parsing stored tests:', e);
        // Initialize with mock tests if parsing fails
        const mockTests: ModuleTest[] = [
          {
            id: 'test_module1_course7',
            courseId: '7',
            moduleId: 'm12',
            moduleTitle: 'Python for Data Science',
            courseTitle: 'Complete Python Data Science & Machine Learning',
            title: 'Module 1 Assessment',
            documentName: 'python_basics.pdf',
            questions: [
              {
                id: 'q_1',
                question: 'What is the main topic covered in Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['Introduction to the topic', 'Advanced concepts', 'Practical applications', 'All of the above'],
                correctAnswer: 'All of the above',
                points: 10,
              },
              {
                id: 'q_2',
                question: 'Which concept is most important in Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['Basic understanding', 'Hands-on practice', 'Theoretical knowledge', 'All are equally important'],
                correctAnswer: 'All are equally important',
                points: 10,
              },
              {
                id: 'q_3',
                question: 'What should students focus on when studying Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['Memorization only', 'Understanding concepts', 'Practical application', 'Both understanding and practice'],
                correctAnswer: 'Both understanding and practice',
                points: 10,
              },
              {
                id: 'q_4',
                question: 'How does Python for Data Science relate to the overall course?',
                type: 'multiple-choice' as const,
                options: ['It is independent', 'It builds on previous modules', 'It is optional', 'It replaces other modules'],
                correctAnswer: 'It builds on previous modules',
                points: 10,
              },
              {
                id: 'q_5',
                question: 'What is the best approach to master Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['Reading only', 'Watching videos only', 'Combining reading, videos, and practice', 'Skipping to next module'],
                correctAnswer: 'Combining reading, videos, and practice',
                points: 10,
              },
              {
                id: 'q_6',
                question: 'Which of the following best describes the learning objectives of Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['To introduce basic concepts only', 'To provide comprehensive understanding and practical skills', 'To focus on advanced topics', 'To review previous material'],
                correctAnswer: 'To provide comprehensive understanding and practical skills',
                points: 10,
              },
              {
                id: 'q_7',
                question: 'What type of assessment is most appropriate for Python for Data Science?',
                type: 'multiple-choice' as const,
                options: ['Written exams only', 'Practical projects only', 'Combination of quizzes and hands-on exercises', 'No assessment needed'],
                correctAnswer: 'Combination of quizzes and hands-on exercises',
                points: 10,
              },
              {
                id: 'q_8',
                question: 'Students should complete Python for Data Science before moving to the next module because:',
                type: 'multiple-choice' as const,
                options: ['It is mandatory', 'It provides foundational knowledge for subsequent topics', 'It contains important assignments', 'All of the above'],
                correctAnswer: 'All of the above',
                points: 10,
              },
              {
                id: 'q_9',
                question: 'The key takeaway from Python for Data Science is:',
                type: 'multiple-choice' as const,
                options: ['Understanding theoretical concepts', 'Applying knowledge in real-world scenarios', 'Both theoretical understanding and practical application', 'Memorizing facts and figures'],
                correctAnswer: 'Both theoretical understanding and practical application',
                points: 10,
              },
              {
                id: 'q_10',
                question: 'To succeed in Python for Data Science, students should:',
                type: 'multiple-choice' as const,
                options: ['Study passively without practice', 'Focus only on assignments', 'Engage actively with all materials, complete assignments, and practice regularly', 'Skip difficult sections'],
                correctAnswer: 'Engage actively with all materials, complete assignments, and practice regularly',
                points: 10,
              },
            ],
            passingScore: 60,
            timeLimit: 15,
            attemptsAllowed: 1,
            openedAt: new Date().toISOString(),
            closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: ['student_1', 'student_2', 'student_3', 'student_6', 'rasmioff@gmail.com'],
            createdAt: new Date().toISOString(),
            status: 'published' as const,
          },
        ];
        setTests(mockTests);
        localStorage.setItem('evolvix_module_tests', JSON.stringify(mockTests));
      }
    } else {
      // Initialize with mock tests if no stored tests exist
      // Use courseId '7' which belongs to the mentor (suhxil14@gmail.com)
      const mockTests: ModuleTest[] = [
        {
          id: 'test_module1_course7',
          courseId: '7',
          moduleId: 'm12',
          moduleTitle: 'Python for Data Science',
          courseTitle: 'Complete Python Data Science & Machine Learning',
          title: 'Module 1 Assessment',
          documentName: 'python_basics.pdf',
          questions: [
            {
              id: 'q_1',
              question: 'What is the main topic covered in Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['Introduction to the topic', 'Advanced concepts', 'Practical applications', 'All of the above'],
              correctAnswer: 'All of the above',
              points: 10,
            },
            {
              id: 'q_2',
              question: 'Which concept is most important in Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['Basic understanding', 'Hands-on practice', 'Theoretical knowledge', 'All are equally important'],
              correctAnswer: 'All are equally important',
              points: 10,
            },
            {
              id: 'q_3',
              question: 'What should students focus on when studying Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['Memorization only', 'Understanding concepts', 'Practical application', 'Both understanding and practice'],
              correctAnswer: 'Both understanding and practice',
              points: 10,
            },
            {
              id: 'q_4',
              question: 'How does Python for Data Science relate to the overall course?',
              type: 'multiple-choice' as const,
              options: ['It is independent', 'It builds on previous modules', 'It is optional', 'It replaces other modules'],
              correctAnswer: 'It builds on previous modules',
              points: 10,
            },
            {
              id: 'q_5',
              question: 'What is the best approach to master Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['Reading only', 'Watching videos only', 'Combining reading, videos, and practice', 'Skipping to next module'],
              correctAnswer: 'Combining reading, videos, and practice',
              points: 10,
            },
            {
              id: 'q_6',
              question: 'Which of the following best describes the learning objectives of Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['To introduce basic concepts only', 'To provide comprehensive understanding and practical skills', 'To focus on advanced topics', 'To review previous material'],
              correctAnswer: 'To provide comprehensive understanding and practical skills',
              points: 10,
            },
            {
              id: 'q_7',
              question: 'What type of assessment is most appropriate for Python for Data Science?',
              type: 'multiple-choice' as const,
              options: ['Written exams only', 'Practical projects only', 'Combination of quizzes and hands-on exercises', 'No assessment needed'],
              correctAnswer: 'Combination of quizzes and hands-on exercises',
              points: 10,
            },
            {
              id: 'q_8',
              question: 'Students should complete Python for Data Science before moving to the next module because:',
              type: 'multiple-choice' as const,
              options: ['It is mandatory', 'It provides foundational knowledge for subsequent topics', 'It contains important assignments', 'All of the above'],
              correctAnswer: 'All of the above',
              points: 10,
            },
            {
              id: 'q_9',
              question: 'The key takeaway from Python for Data Science is:',
              type: 'multiple-choice' as const,
              options: ['Understanding theoretical concepts', 'Applying knowledge in real-world scenarios', 'Both theoretical understanding and practical application', 'Memorizing facts and figures'],
              correctAnswer: 'Both theoretical understanding and practical application',
              points: 10,
            },
            {
              id: 'q_10',
              question: 'To succeed in Python for Data Science, students should:',
              type: 'multiple-choice' as const,
              options: ['Study passively without practice', 'Focus only on assignments', 'Engage actively with all materials, complete assignments, and practice regularly', 'Skip difficult sections'],
              correctAnswer: 'Engage actively with all materials, complete assignments, and practice regularly',
              points: 10,
            },
          ],
          passingScore: 60,
          timeLimit: 15,
          attemptsAllowed: 1,
          openedAt: new Date().toISOString(),
          closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          assignedTo: ['student_1', 'student_2', 'student_3', 'student_6', 'rasmioff@gmail.com'],
          createdAt: new Date().toISOString(),
          status: 'published' as const,
        },
      ];
      setTests(mockTests);
      localStorage.setItem('evolvix_module_tests', JSON.stringify(mockTests));
    }
  }, []);

  // Save tests to localStorage whenever tests change
  useEffect(() => {
    if (tests.length > 0 || localStorage.getItem('evolvix_module_tests')) {
      localStorage.setItem('evolvix_module_tests', JSON.stringify(tests));
    }
  }, [tests]);

  // Get mentor's courses
  const mentorCourses = useMemo(() => {
    if (!mentorId) return [];
    return courses.filter(c => c.instructor.id === mentorId);
  }, [courses, mentorId]);

  // Filter tests to only show tests for mentor's courses
  const mentorTests = useMemo(() => {
    if (!mentorId) return [];
    const mentorCourseIds = mentorCourses.map(c => c.id);
    return tests.filter(t => mentorCourseIds.includes(t.courseId));
  }, [tests, mentorCourses, mentorId]);

  const handleCreateTest = (testData: Omit<ModuleTest, 'id' | 'createdAt' | 'status'>) => {
    const newTest: ModuleTest = {
      ...testData,
      id: `test_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'published',
    };
    setTests([...tests, newTest]);
    setShowCreateModal(false);
    setActiveTab('list');
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      setTests(tests.filter(t => t.id !== testId));
    }
  };

  // Get tests for selected course/module
  const getTestsForModule = (courseId: string, moduleId: string) => {
    return tests.filter(t => t.courseId === courseId && t.moduleId === moduleId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Module Tests
          </h2>
          <p className="text-muted-foreground">
            Upload module documents, generate AI-powered MCQ questions, and send tests to students
          </p>
        </div>
        <Button
          onClick={() => {
            setShowCreateModal(true);
            setActiveTab('create');
          }}
          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'create')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>All Tests</span>
            {mentorTests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-slate-700 dark:bg-slate-600 text-white text-xs rounded-full">
                {mentorTests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Test</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <TestList
            tests={mentorTests}
            courses={mentorCourses}
            onSelectTest={() => {}} // Not used anymore, kept for interface compatibility
            onDelete={handleDeleteTest}
          />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          {showCreateModal && (
            <CreateTestModal
              courses={mentorCourses}
              preSelectedCourseId={preSelectedCourseId}
              preSelectedModuleId={preSelectedModuleId}
              onClose={() => {
                setShowCreateModal(false);
                setActiveTab('list');
                setPreSelectedCourseId('');
                setPreSelectedModuleId('');
              }}
              onSubmit={handleCreateTest}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

