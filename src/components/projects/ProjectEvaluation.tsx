"use client";

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { evaluateProject } from '@/store/features/projects/projectsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Input } from '@/components/forms/Input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ExternalLink, Github, Star, MessageSquare } from 'lucide-react';
import { ProjectSubmission, CourseProject } from '@/data/mock/coursesData';

interface ProjectEvaluationProps {
  submission: ProjectSubmission;
  project: CourseProject;
  onEvaluated: () => void;
}

export function ProjectEvaluation({ submission, project, onEvaluated }: ProjectEvaluationProps) {
  const dispatch = useAppDispatch();
  const [evaluation, setEvaluation] = useState({
    score: submission.score || 0,
    feedback: submission.mentorFeedback || '',
    status: submission.status === 'reviewed' ? 'reviewed' as const : 'reviewed' as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (evaluation.score < 0 || evaluation.score > project.maxScore) {
      alert(`Score must be between 0 and ${project.maxScore}`);
      return;
    }

    setIsSubmitting(true);

    dispatch(evaluateProject({
      submissionId: submission.id,
      score: evaluation.score,
      feedback: evaluation.feedback,
      status: evaluation.status,
    }));

    setIsSubmitting(false);
    onEvaluated();
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Evaluate: {submission.studentName}</span>
          <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
            {project.isFinalProject ? 'Final Project' : `Project ${project.projectNumber}`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Submission Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Github className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                View GitHub Repository
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            {submission.liveLink && (
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <a
                  href={submission.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  View Live Demo
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
            {submission.documents.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Documents:</p>
                <div className="space-y-1">
                  {submission.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {doc.name}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Project Requirements Checklist */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Project Requirements:</h4>
            <ul className="space-y-1">
              {project.requirements.map((req, idx) => (
                <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Technologies Used:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evaluation Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div>
              <Label htmlFor="score" className="mb-2 block flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Score (0 - {project.maxScore}) *
              </Label>
              <Input
                id="score"
                type="number"
                value={evaluation.score}
                onChange={(e) => setEvaluation({ ...evaluation, score: parseInt(e.target.value) || 0 })}
                required
                min={0}
                max={project.maxScore}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Weight: {project.weight}% of final grade
              </p>
            </div>

            <div>
              <Label htmlFor="feedback" className="mb-2 block flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Feedback *
              </Label>
              <textarea
                id="feedback"
                value={evaluation.feedback}
                onChange={(e) => setEvaluation({ ...evaluation, feedback: e.target.value })}
                required
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                placeholder="Provide detailed feedback on code quality, functionality, design, best practices, areas for improvement..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`status-${submission.id}`}
                  checked={evaluation.status === 'reviewed'}
                  onChange={() => setEvaluation({ ...evaluation, status: 'reviewed' })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Approved</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`status-${submission.id}`}
                  checked={evaluation.status === 'returned'}
                  onChange={() => setEvaluation({ ...evaluation, status: 'returned' })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Needs Revision</span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

