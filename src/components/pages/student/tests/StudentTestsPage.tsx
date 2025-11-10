"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { mockStudents } from '@/data/mock/students';
import { useRouter } from 'next/navigation';

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
  timeLimit?: number;
  attemptsAllowed: number;
  openedAt: string;
  closesAt: string;
  assignedTo: string[];
  createdAt: string;
  status: 'draft' | 'published' | 'closed';
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpent: number; // in minutes
}

export function StudentTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<ModuleTest[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [studentId, setStudentId] = useState<string>('');

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const email = parsedData.email || '';
      
      // Find student by email to get their ID
      const student = mockStudents.find(s => s.email === email);
      if (student) {
        // Use student ID for matching with test assignments
        setStudentId(student.id);
      } else {
        // If student not found in mock data, use email as fallback
        setStudentId(email);
      }
    }
  }, []);

  // Load tests and attempts from localStorage
  useEffect(() => {
    if (!studentId) return;
    
    const storedTests = localStorage.getItem('evolvix_module_tests');
    const storedAttempts = localStorage.getItem('evolvix_test_attempts');
    
    // Get student email for fallback matching
    const storedData = localStorage.getItem('evolvix_registration');
    const studentEmail = storedData ? JSON.parse(storedData).email : '';
    const student = mockStudents.find(s => s.email === studentEmail);
    const actualStudentId = student?.id || studentEmail;
    
    // Debug logging
    console.log('Student Tests Page - Debug:', {
      studentId,
      studentEmail,
      actualStudentId,
      hasStoredTests: !!storedTests,
    });
    
    if (storedTests) {
      try {
        let allTests: ModuleTest[] = JSON.parse(storedTests);
        console.log('All tests from localStorage:', allTests.length);
        console.log('Test assignments:', allTests.map(t => ({ id: t.id, assignedTo: t.assignedTo })));
        
        // Update tests to include this student if they're enrolled in the course
        // This ensures tests are assigned even if they were created before the student was added
        let testsUpdated = false;
        allTests = allTests.map(test => {
          // Check if student is enrolled in the course
          const studentEnrolled = student?.enrolledCourses?.includes(test.courseId);
          const alreadyAssigned = test.assignedTo.includes(actualStudentId) || 
                                 test.assignedTo.includes(studentEmail) ||
                                 test.assignedTo.includes(studentId);
          
          // If student is enrolled but not assigned, add them
          if (studentEnrolled && !alreadyAssigned && student) {
            testsUpdated = true;
            return {
              ...test,
              assignedTo: [...test.assignedTo, actualStudentId, studentEmail]
            };
          }
          return test;
        });
        
        // Save updated tests back to localStorage if changes were made
        if (testsUpdated) {
          localStorage.setItem('evolvix_module_tests', JSON.stringify(allTests));
          console.log('Updated tests to include student assignments');
        }
        
        // Filter tests assigned to this student (by ID or email)
        const assignedTests = allTests.filter(test => {
          const isAssigned = test.assignedTo.includes(actualStudentId) || 
                            test.assignedTo.includes(studentEmail) ||
                            test.assignedTo.includes(studentId);
          const isPublished = test.status === 'published';
          
          console.log(`Test ${test.id}:`, {
            isAssigned,
            isPublished,
            assignedTo: test.assignedTo,
            actualStudentId,
            studentEmail,
            studentId
          });
          
          return isAssigned && isPublished;
        });
        
        console.log('Assigned tests:', assignedTests.length);
        setTests(assignedTests);
      } catch (e) {
        console.error('Error parsing stored tests:', e);
        setTests([]);
      }
    } else {
      console.log('No tests found in localStorage - initializing with mock test');
      // Initialize tests if they don't exist (similar to mentor page)
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
      
      // Filter tests assigned to this student
      const assignedTests = mockTests.filter(test => {
        const isAssigned = test.assignedTo.includes(actualStudentId) || 
                          test.assignedTo.includes(studentEmail) ||
                          test.assignedTo.includes(studentId);
        return isAssigned && test.status === 'published';
      });
      
      // Save to localStorage
      localStorage.setItem('evolvix_module_tests', JSON.stringify(mockTests));
      setTests(assignedTests);
      console.log('Initialized tests and assigned:', assignedTests.length);
    }
    
    if (storedAttempts) {
      try {
        const allAttempts: TestAttempt[] = JSON.parse(storedAttempts);
        // Match attempts by student ID or email
        const studentAttempts = allAttempts.filter(a => 
          a.studentId === actualStudentId || 
          a.studentId === studentEmail ||
          a.studentId === studentId
        );
        setAttempts(studentAttempts);
      } catch (e) {
        console.error('Error parsing stored attempts:', e);
        setAttempts([]);
      }
    }
  }, [studentId]);

  const getTestStatus = (test: ModuleTest) => {
    const now = new Date();
    const opensAt = new Date(test.openedAt);
    const closesAt = new Date(test.closesAt);
    const testAttempts = attempts.filter(a => a.testId === test.id);
    const attemptCount = testAttempts.length;

    if (now < opensAt) {
      return { status: 'scheduled', label: 'Scheduled', canTake: false };
    } else if (now > closesAt) {
      return { status: 'closed', label: 'Closed', canTake: false };
    } else if (attemptCount >= test.attemptsAllowed) {
      return { status: 'completed', label: 'Attempts Used', canTake: false };
    } else {
      return { status: 'available', label: 'Available', canTake: true };
    }
  };

  const getTestAttempt = (testId: string) => {
    return attempts.find(a => a.testId === testId);
  };

  const handleStartTest = (test: ModuleTest) => {
    // Redirect to pledge page
    router.push(`/portal/student/tests/${test.id}/pledge`);
  };

  const handleViewResult = (test: ModuleTest) => {
    // Redirect to pledge page with summary marks (pledge page will show summary if attempt exists)
    router.push(`/portal/student/tests/${test.id}/pledge`);
  };

  if (tests.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Tests Available
          </h3>
          <p className="text-muted-foreground">
            You don't have any tests assigned yet. Check back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          My Tests
        </h2>
        <p className="text-muted-foreground">
          Complete module tests to assess your understanding
        </p>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.map(test => {
          const testStatus = getTestStatus(test);
          const attempt = getTestAttempt(test.id);
          const now = new Date();
          const closesAt = new Date(test.closesAt);

          return (
            <Card
              key={test.id}
              className="border border-border"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {test.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          testStatus.status === 'available'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : testStatus.status === 'completed'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {testStatus.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {test.courseTitle} • {test.moduleTitle}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{test.questions.length} Questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.timeLimit} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Closes: {closesAt.toLocaleDateString()}</span>
                      </div>
                      {attempt && (
                        <div className="flex items-center space-x-1">
                          {attempt.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span>
                            Score: {attempt.score}/{attempt.maxScore} ({attempt.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {testStatus.canTake ? (
                      <Button
                        onClick={() => handleStartTest(test)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Test
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : attempt ? (
                      <Button
                        onClick={() => handleViewResult(test)}
                        variant="outline"
                      >
                        View
                      </Button>
                    ) : (
                      <Button disabled variant="outline">
                        Not Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

