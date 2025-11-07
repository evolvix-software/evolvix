"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { X, Star, Send, User } from 'lucide-react';
import { Student, StudentFeedback } from '@/interfaces/students';

interface FeedbackFormProps {
  student: Student;
  courseId?: string;
  existingFeedback?: StudentFeedback;
  onClose: () => void;
  onSubmit: (feedback: Omit<StudentFeedback, 'id' | 'submittedAt' | 'submittedBy'>) => void;
}

export function FeedbackForm({
  student,
  courseId,
  existingFeedback,
  onClose,
  onSubmit
}: FeedbackFormProps) {
  const [participation, setParticipation] = useState(existingFeedback?.participation || 0);
  const [skills, setSkills] = useState(existingFeedback?.skills || 0);
  const [communication, setCommunication] = useState(existingFeedback?.communication || 0);
  const [comments, setComments] = useState(existingFeedback?.comments || '');

  const overallRating = participation > 0 && skills > 0 && communication > 0
    ? ((participation + skills + communication) / 3).toFixed(2)
    : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (participation === 0 || skills === 0 || communication === 0) {
      alert('Please rate all criteria before submitting');
      return;
    }

    onSubmit({
      studentId: student.id,
      courseId,
      participation,
      skills,
      communication,
      overallRating: parseFloat(overallRating),
      comments: comments.trim()
    });

    // Reset form
    setParticipation(0);
    setSkills(0);
    setCommunication(0);
    setComments('');
    onClose();
  };

  const RatingSelector = ({
    label,
    value,
    onChange,
    description
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    description: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            {label}
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        </div>
        {value > 0 && (
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {value}/5
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              value >= rating
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                value >= rating ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-2 border-blue-500 dark:border-blue-400">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50">
                  <span className="text-white font-bold">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-white">Give Feedback</CardTitle>
                <p className="text-sm text-white/90">{student.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating Display */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Rating</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {overallRating}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">/ 5.0</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star
                      key={rating}
                      className={`w-6 h-6 ${
                        parseFloat(overallRating) >= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Criteria */}
            <div className="space-y-6">
              <RatingSelector
                label="Participation"
                value={participation}
                onChange={setParticipation}
                description="Active engagement in classes, discussions, and activities"
              />

              <RatingSelector
                label="Skills"
                value={skills}
                onChange={setSkills}
                description="Technical proficiency and application of learned concepts"
              />

              <RatingSelector
                label="Communication"
                value={communication}
                onChange={setCommunication}
                description="Clarity in expressing ideas and asking questions"
              />
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Additional Comments
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide detailed feedback about the student's performance, strengths, and areas for improvement..."
                rows={6}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {comments.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={participation === 0 || skills === 0 || communication === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

