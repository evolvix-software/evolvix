"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Course, Module } from '@/data/mock/coursesData';
import { ModuleTest, TestQuestion } from '../TestsPage';
import {
  Upload,
  Bot,
  Loader2,
  X,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { mockStudents } from '@/data/mock/students';

interface CreateTestModalProps {
  courses: Course[];
  preSelectedCourseId?: string;
  preSelectedModuleId?: string;
  onClose: () => void;
  onSubmit: (test: Omit<ModuleTest, 'id' | 'createdAt' | 'status'>) => void;
}

export function CreateTestModal({ courses, preSelectedCourseId, preSelectedModuleId, onClose, onSubmit }: CreateTestModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(preSelectedCourseId || '');
  const [selectedModuleId, setSelectedModuleId] = useState<string>(preSelectedModuleId || '');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [testTitle, setTestTitle] = useState<string>('');
  const [passingScore, setPassingScore] = useState<number>(60);
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [attemptsAllowed, setAttemptsAllowed] = useState<number>(1);
  const [openedAt, setOpenedAt] = useState<string>('');
  const [closesAt, setClosesAt] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<TestQuestion[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setOpenedAt(now.toISOString().slice(0, 16));
    setClosesAt(nextMonth.toISOString().slice(0, 16));
  }, []);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedModule = selectedCourse?.modules.find(m => m.id === selectedModuleId);

  // Get enrolled students for selected course
  const enrolledStudents = mockStudents.filter(student =>
    student.enrolledCourses.includes(selectedCourseId)
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setError('Please upload a PDF file');
        return;
      }
      setDocumentFile(file);
      setError('');
    }
  };

  const generateQuestions = async () => {
    if (!documentFile || !selectedModuleId) {
      setError('Please select a module and upload a document');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Simulate AI question generation (in production, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock generated questions based on module - 10 questions with MCQ options
      const baseTime = Date.now();
      const mockQuestions: TestQuestion[] = [
        {
          id: `q_${baseTime}_1`,
          question: `What is the main topic covered in ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'Introduction to the topic',
            'Advanced concepts',
            'Practical applications',
            'All of the above',
          ],
          correctAnswer: 'All of the above',
          points: 10,
        },
        {
          id: `q_${baseTime}_2`,
          question: `Which concept is most important in ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'Basic understanding',
            'Hands-on practice',
            'Theoretical knowledge',
            'All are equally important',
          ],
          correctAnswer: 'All are equally important',
          points: 10,
        },
        {
          id: `q_${baseTime}_3`,
          question: `What should students focus on when studying ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'Memorization only',
            'Understanding concepts',
            'Practical application',
            'Both understanding and practice',
          ],
          correctAnswer: 'Both understanding and practice',
          points: 10,
        },
        {
          id: `q_${baseTime}_4`,
          question: `How does ${selectedModule?.title || 'this module'} relate to the overall course?`,
          type: 'multiple-choice',
          options: [
            'It is independent',
            'It builds on previous modules',
            'It is optional',
            'It replaces other modules',
          ],
          correctAnswer: 'It builds on previous modules',
          points: 10,
        },
        {
          id: `q_${baseTime}_5`,
          question: `What is the best approach to master ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'Reading only',
            'Watching videos only',
            'Combining reading, videos, and practice',
            'Skipping to next module',
          ],
          correctAnswer: 'Combining reading, videos, and practice',
          points: 10,
        },
        {
          id: `q_${baseTime}_6`,
          question: `Which of the following best describes the learning objectives of ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'To introduce basic concepts only',
            'To provide comprehensive understanding and practical skills',
            'To focus on advanced topics',
            'To review previous material',
          ],
          correctAnswer: 'To provide comprehensive understanding and practical skills',
          points: 10,
        },
        {
          id: `q_${baseTime}_7`,
          question: `What type of assessment is most appropriate for ${selectedModule?.title || 'this module'}?`,
          type: 'multiple-choice',
          options: [
            'Written exams only',
            'Practical projects only',
            'Combination of quizzes and hands-on exercises',
            'No assessment needed',
          ],
          correctAnswer: 'Combination of quizzes and hands-on exercises',
          points: 10,
        },
        {
          id: `q_${baseTime}_8`,
          question: `Students should complete ${selectedModule?.title || 'this module'} before moving to the next module because:`,
          type: 'multiple-choice',
          options: [
            'It is mandatory',
            'It provides foundational knowledge for subsequent topics',
            'It contains important assignments',
            'All of the above',
          ],
          correctAnswer: 'All of the above',
          points: 10,
        },
        {
          id: `q_${baseTime}_9`,
          question: `The key takeaway from ${selectedModule?.title || 'this module'} is:`,
          type: 'multiple-choice',
          options: [
            'Understanding theoretical concepts',
            'Applying knowledge in real-world scenarios',
            'Both theoretical understanding and practical application',
            'Memorizing facts and figures',
          ],
          correctAnswer: 'Both theoretical understanding and practical application',
          points: 10,
        },
        {
          id: `q_${baseTime}_10`,
          question: `To succeed in ${selectedModule?.title || 'this module'}, students should:`,
          type: 'multiple-choice',
          options: [
            'Study passively without practice',
            'Focus only on assignments',
            'Engage actively with all materials, complete assignments, and practice regularly',
            'Skip difficult sections',
          ],
          correctAnswer: 'Engage actively with all materials, complete assignments, and practice regularly',
          points: 10,
        },
      ];

      setGeneratedQuestions(mockQuestions);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedCourseId || !selectedModuleId || !testTitle || generatedQuestions.length === 0) {
      setError('Please fill in all required fields and generate questions');
      return;
    }

    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    const testData: Omit<ModuleTest, 'id' | 'createdAt' | 'status'> = {
      courseId: selectedCourseId,
      moduleId: selectedModuleId,
      moduleTitle: selectedModule?.title || '',
      courseTitle: selectedCourse?.title || '',
      title: testTitle,
      documentName: documentFile?.name,
      questions: generatedQuestions,
      passingScore,
      timeLimit,
      attemptsAllowed,
      openedAt,
      closesAt,
      assignedTo: selectedStudents,
    };

    onSubmit(testData);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Create Module Test</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
            Select Course *
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedModuleId('');
            }}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground"
          >
            <option value="">Choose a course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Module Selection */}
        {selectedCourse && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
              Select Module *
            </label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground"
            >
              <option value="">Choose a module...</option>
              {selectedCourse.modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document Upload */}
        {selectedModule && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
              Upload Module Document (PDF) *
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {documentFile ? documentFile.name : 'Click to upload PDF document'}
                </span>
              </label>
            </div>
            {documentFile && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <FileText className="w-4 h-4" />
                <span>{documentFile.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Generate Questions Button */}
        {documentFile && selectedModuleId && (
          <div>
            <Button
              onClick={generateQuestions}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Generate MCQ Questions with AI
                </>
              )}
            </Button>
          </div>
        )}

        {/* Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-slate-900 dark:text-foreground">
                {generatedQuestions.length} Questions Generated
              </span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {generatedQuestions.map((q, idx) => (
                <div key={q.id} className="text-sm">
                  <p className="font-medium text-slate-900 dark:text-foreground">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Correct: {q.correctAnswer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Configuration */}
        {generatedQuestions.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                Test Title *
              </label>
              <Input
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="e.g., Module 1 Assessment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                  Passing Score (%)
                </label>
                <Input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                  Attempts Allowed
                </label>
                <Input
                  type="number"
                  value={attemptsAllowed}
                  onChange={(e) => setAttemptsAllowed(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                  Opens At
                </label>
                <Input
                  type="datetime-local"
                  value={openedAt}
                  onChange={(e) => setOpenedAt(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                  Closes At
                </label>
                <Input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) => setClosesAt(e.target.value)}
                />
              </div>
            </div>

            {/* Student Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-foreground mb-2">
                Assign to Students *
              </label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                {enrolledStudents.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    No students enrolled in this course
                  </p>
                ) : (
                  <div className="space-y-2">
                    {enrolledStudents.map(student => (
                      <label
                        key={student.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-900 dark:text-foreground">
                          {student.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={generatedQuestions.length === 0 || selectedStudents.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Create & Send Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

