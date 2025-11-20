"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Target, Heart, TrendingUp, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/common/forms/Button';
import { Card } from '@/components/common/forms/Card';
import { cn } from '@/utils';
import { providerService } from '@/data/mock/providerData';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  required: boolean;
}

const providerSurveyQuestions: SurveyQuestion[] = [
  {
    id: '1',
    question: 'What is your primary motivation for providing scholarships?',
    type: 'single',
    options: [
      'Social impact and giving back',
      'Corporate social responsibility',
      'Talent acquisition and development',
      'Supporting specific fields/industries',
      'Other',
    ],
    required: true,
  },
  {
    id: '2',
    question: 'What types of scholarships are you interested in offering?',
    type: 'multiple',
    options: [
      'Merit-based scholarships',
      'Need-based scholarships',
      'Course-specific scholarships',
      'General scholarships',
      'Full scholarships',
      'Partial scholarships',
    ],
    required: true,
  },
  {
    id: '3',
    question: 'What is your estimated annual scholarship budget?',
    type: 'single',
    options: [
      'Less than ₹5 Lakhs',
      '₹5 Lakhs - ₹25 Lakhs',
      '₹25 Lakhs - ₹1 Crore',
      '₹1 Crore - ₹5 Crores',
      'More than ₹5 Crores',
    ],
    required: true,
  },
  {
    id: '4',
    question: 'Which fields or courses are you most interested in supporting?',
    type: 'multiple',
    options: [
      'Technology & Software Development',
      'Data Science & AI',
      'Business & Management',
      'Design & Creative Arts',
      'Healthcare & Medicine',
      'Engineering',
      'All fields',
    ],
    required: true,
  },
  {
    id: '5',
    question: 'What are your expectations from scholars after they complete their courses?',
    type: 'multiple',
    options: [
      'Job placement tracking',
      'Graduation rate monitoring',
      'Academic progress tracking',
      'Success stories and testimonials',
      'ROI and impact reports',
      'No specific expectations',
    ],
    required: true,
  },
  {
    id: '6',
    question: 'Tell us about your organization and its mission (optional)',
    type: 'text',
    required: false,
  },
];

export default function ProviderSurveyPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [textAnswer, setTextAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if provider exists
    const provider = providerService.getCurrentProvider();
    if (!provider) {
      router.push('/auth/provider-signup');
      return;
    }
  }, [router]);

  const currentQuestion = providerSurveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / providerSurveyQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === providerSurveyQuestions.length - 1;
  const currentAnswer = answers[currentQuestion?.id] || '';

  const getIcon = () => {
    const icons = [
      <Target className="w-8 h-8" />,
      <Heart className="w-8 h-8" />,
      <TrendingUp className="w-8 h-8" />,
      <Sparkles className="w-8 h-8" />,
      <GraduationCap className="w-8 h-8" />,
      <Target className="w-8 h-8" />,
    ];
    return icons[currentQuestionIndex % icons.length];
  };

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'single') {
      setAnswers({ ...answers, [currentQuestion.id]: option });
    } else if (currentQuestion.type === 'multiple') {
      const existing = (answers[currentQuestion.id] as string[]) || [];
      const updated = existing.includes(option)
        ? existing.filter((a) => a !== option)
        : [...existing, option];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    }
    setError('');
  };

  const handleTextChange = (value: string) => {
    setTextAnswer(value);
    setError('');
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTextAnswer('');
    }
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    // Validation
    if (currentQuestion.required) {
      if (currentQuestion.type === 'text') {
        if (!textAnswer.trim()) {
          setError('Please provide an answer to continue');
          return;
        }
        setAnswers({ ...answers, [currentQuestion.id]: textAnswer });
      } else if (currentQuestion.type === 'multiple') {
        const selected = answers[currentQuestion.id] as string[];
        if (!selected || selected.length === 0) {
          setError('Please select at least one option');
          return;
        }
      } else {
        if (!currentAnswer) {
          setError('Please select an option to continue');
          return;
        }
      }
    }

    setError('');

    if (isLastQuestion) {
      // Save final answer if text type
      if (currentQuestion.type === 'text' && textAnswer.trim()) {
        setAnswers({ ...answers, [currentQuestion.id]: textAnswer });
      }

      // Submit complete survey
      setIsSubmitting(true);
      try {
        // Store survey answers in localStorage
        const surveyData = {
          role: 'provider',
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
          completedAt: new Date().toISOString(),
        };
        localStorage.setItem('evolvix_provider_survey', JSON.stringify(surveyData));

        // Redirect to provider dashboard
        router.push('/portal/provider/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to submit survey. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      // Save current answer incrementally
      if (currentQuestion.type === 'text' && textAnswer.trim()) {
        setAnswers({ ...answers, [currentQuestion.id]: textAnswer });
      }

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTextAnswer('');
    }
  };

  const isSelected = (option: string) => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'single') {
      return currentAnswer === option;
    } else if (currentQuestion.type === 'multiple') {
      const existing = (answers[currentQuestion.id] as string[]) || [];
      return existing.includes(option);
    }
    return false;
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Scrollable Content */}
      <div className="relative h-full overflow-y-auto content-scroll">
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-2xl my-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {providerSurveyQuestions.length}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="shadow-xl">
              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white">
                    {getIcon()}
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground text-center mb-8">
                  {currentQuestion?.question}
                </h2>

                {/* Error */}
                {error && (
                  <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Options */}
                {currentQuestion?.type !== 'text' && currentQuestion?.options && (
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleOptionSelect(option)}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 text-left transition-all flex items-center justify-between',
                          isSelected(option)
                            ? 'border-primary bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <span className="font-medium">{option}</span>
                        {isSelected(option) && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Text Input */}
                {currentQuestion?.type === 'text' && (
                  <div className="mb-8">
                    <textarea
                      value={textAnswer}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full min-h-[150px] p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-card dark:bg-gray-900 text-gray-900 dark:text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {currentQuestion.required ? 'Required' : 'Optional'}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentQuestionIndex === 0}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : isLastQuestion ? (
                      <>
                        Complete
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Skip Option */}
            {!currentQuestion?.required && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => handleNext()}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
                >
                  Skip this question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

