"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/common/forms/Button';
import {
  Upload,
  X,
  FileText,
  Github,
  Link as LinkIcon,
  Code,
  File,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Assignment, AssignmentSubmission } from '@/interfaces/assignments';

interface SubmissionInterfaceProps {
  assignment: Assignment;
  existingSubmission?: AssignmentSubmission | null;
  onSuccess: (submission: AssignmentSubmission) => void;
  onCancel: () => void;
}

export function SubmissionInterface({
  assignment,
  existingSubmission,
  onSuccess,
  onCancel
}: SubmissionInterfaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [githubUrl, setGithubUrl] = useState(existingSubmission?.githubUrl || '');
  const [liveLink, setLiveLink] = useState(existingSubmission?.liveLink || '');
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    // At least one submission method required
    if (files.length === 0 && !githubUrl && !liveLink && !notes.trim()) {
      newErrors.general = 'Please provide at least one submission method (files, GitHub link, live link, or notes)';
    }

    // Validate GitHub URL format
    if (githubUrl && !githubUrl.match(/^https?:\/\/github\.com\/.+/i)) {
      newErrors.githubUrl = 'Please enter a valid GitHub URL';
    }

    // Validate live link format
    if (liveLink && !liveLink.match(/^https?:\/\/.+/i)) {
      newErrors.liveLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Simulate file upload
      const uploadedFiles = files.map((file, index) => ({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        url: URL.createObjectURL(file), // In real app, upload to server
        type: file.type,
        size: file.size
      }));

      const submission: AssignmentSubmission = {
        id: existingSubmission?.id || `sub_${Date.now()}`,
        assignmentId: assignment.id,
        studentId: 'student_1', // In real app, get from auth context
        studentName: 'John Doe', // In real app, get from auth context
        studentEmail: 'john@example.com', // In real app, get from auth context
        submittedAt: new Date().toISOString(),
        dueDate: assignment.dueDate,
        status: existingSubmission?.status === 'returned' ? 'submitted' : 'submitted',
        files: uploadedFiles,
        githubUrl: githubUrl || undefined,
        liveLink: liveLink || undefined,
        notes: notes.trim() || undefined,
        maxScore: assignment.maxScore,
        isLate: new Date() > new Date(assignment.dueDate)
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSuccess(submission);
    } catch (error) {
      setErrors({ general: 'Failed to submit assignment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {errors.general && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">{errors.general}</p>
        </div>
      )}

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-primary dark:text-primary" />
          <span>Upload Files</span>
        </label>
        <div className="space-y-3">
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-2 border-slate-200 dark:border-border rounded-lg bg-slate-50 dark:bg-card"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <File className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-6 border-2 border-dashed border-slate-300 dark:border-border rounded-lg hover:border-[#635bff] dark:hover:border-[#735fff] hover:bg-slate-50 dark:hover:bg-card transition-all flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="w-8 h-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Multiple files supported (Max 50MB per file)
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* GitHub Link */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
          <Github className="w-5 h-5 text-primary dark:text-primary" />
          <span>GitHub Repository (Optional)</span>
        </label>
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => {
            setGithubUrl(e.target.value);
            setErrors(prev => ({ ...prev, githubUrl: '' }));
          }}
          placeholder="https://github.com/username/repository"
          className={`w-full px-4 py-2.5 border-2 rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 ${
            errors.githubUrl
              ? 'border-red-300 dark:border-red-800'
              : 'border-slate-300 dark:border-border focus:border-[#635bff] dark:focus:border-[#735fff]'
          }`}
        />
        {errors.githubUrl && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.githubUrl}</p>
        )}
      </div>

      {/* Live Demo Link */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-primary dark:text-primary" />
          <span>Live Demo Link (Optional)</span>
        </label>
        <input
          type="url"
          value={liveLink}
          onChange={(e) => {
            setLiveLink(e.target.value);
            setErrors(prev => ({ ...prev, liveLink: '' }));
          }}
          placeholder="https://your-demo-site.com"
          className={`w-full px-4 py-2.5 border-2 rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 ${
            errors.liveLink
              ? 'border-red-300 dark:border-red-800'
              : 'border-slate-300 dark:border-border focus:border-[#635bff] dark:focus:border-[#735fff]'
          }`}
        />
        {errors.liveLink && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.liveLink}</p>
        )}
      </div>

      {/* Notes / Written Submission */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary dark:text-primary" />
          <span>Additional Notes or Written Submission (Optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes, explanations, or written content for your submission..."
          rows={8}
          className="w-full px-4 py-3 border-2 border-slate-300 dark:border-border rounded-lg bg-card dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 dark:focus:ring-[#735fff]/30 focus:border-[#635bff] dark:focus:border-[#735fff] resize-none font-mono text-sm"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {notes.length} characters
        </p>
      </div>

      {/* Code Editor Note */}
      {assignment.type === 'class' && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg flex items-start space-x-3">
          <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Code Submission
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              For coding assignments, you can upload your code files or provide a GitHub repository link. Make sure your code is well-commented and follows best practices.
            </p>
          </div>
        </div>
      )}

      {/* Preview Note */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
            Review Before Submitting
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Please review all your files and links before submitting. Once submitted, you may need to request resubmission if changes are needed.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-border">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-slate-300 dark:border-border"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-primary hover:from-[#4f48cc] hover:to-[#635bff] text-white"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-card mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {existingSubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}



