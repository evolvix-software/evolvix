/**
 * Apply Modal Component
 * Handles job application with resume and cover letter
 */

'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/common/ui/Modal';
import { Button } from '@/components/common/ui/Button';
import { Resume, CoverLetter } from '@/interfaces/jobs';
import { 
  getResumes, 
  getCoverLetters, 
  createResume, 
  createCoverLetter,
  submitApplication,
  getApplicationByJobId
} from '@/services/jobService';
import { Job } from '@/data/mock/jobsData';
import { cn } from '@/utils';

export interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSuccess?: () => void;
}

export function ApplyModal({ isOpen, onClose, job, onSuccess }: ApplyModalProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedCoverLetterId, setSelectedCoverLetterId] = useState<string>('');
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [useCustomCoverLetter, setUseCustomCoverLetter] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      loadData();
      checkExistingApplication();
    }
  }, [isOpen, job]);

  const loadData = async () => {
    const [resumesData, lettersData] = await Promise.all([
      getResumes(),
      getCoverLetters(),
    ]);
    
    setResumes(resumesData);
    setCoverLetters(lettersData);
    
    // Set default resume
    const defaultResume = resumesData.find(r => r.isDefault) || resumesData[0];
    if (defaultResume) {
      setSelectedResumeId(defaultResume.id);
    }
    
    // Set default cover letter if exists
    if (lettersData.length > 0) {
      setSelectedCoverLetterId(lettersData[0].id);
      setCoverLetterContent(lettersData[0].content);
    }
  };

  const checkExistingApplication = async () => {
    if (!job) return;
    const existing = await getApplicationByJobId(job.id);
    if (existing) {
      setHasApplied(true);
      setSelectedResumeId(existing.resumeId);
      if (existing.coverLetterContent) {
        setCoverLetterContent(existing.coverLetterContent);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError('');
    
    try {
      // In a real app, upload to server and get URL
      // For now, create a local reference
      const fileUrl = URL.createObjectURL(file);
      
      const resume = await createResume(
        file.name,
        file.name,
        fileUrl,
        undefined
      );
      
      setResumes(prev => [...prev, resume]);
      setSelectedResumeId(resume.id);
      setResumeFile(null);
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!coverLetterContent.trim()) return;
    
    try {
      const letter = await createCoverLetter(
        `Cover Letter for ${job?.title || 'Job'}`,
        coverLetterContent,
        false
      );
      setCoverLetters(prev => [...prev, letter]);
      setSelectedCoverLetterId(letter.id);
      setUseCustomCoverLetter(false);
    } catch (err) {
      setError('Failed to save cover letter.');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!job) return;
    
    if (!selectedResumeId) {
      setError('Please select or upload a resume');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await submitApplication(
        job.id,
        selectedResumeId,
        selectedCoverLetterId || undefined,
        useCustomCoverLetter ? coverLetterContent : undefined,
        undefined
      );
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setResumeFile(null);
    setCoverLetterContent('');
    setUseCustomCoverLetter(false);
    onClose();
  };

  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={hasApplied ? "Application Details" : "Apply for Job"}
      size="lg"
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle2 className="w-16 h-16 text-success mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Application Submitted!
          </h3>
          <p className="text-muted-foreground text-center">
            Your application for {job.title} at {job.company} has been submitted successfully.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Job Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
          </div>

          {/* Resume Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Resume <span className="text-destructive">*</span>
            </label>
            
            {resumes.length > 0 && (
              <div className="space-y-2 mb-3">
                {resumes.map(resume => (
                  <label
                    key={resume.id}
                    className={cn(
                      'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                      selectedResumeId === resume.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted'
                    )}
                  >
                    <input
                      type="radio"
                      name="resume"
                      value={resume.id}
                      checked={selectedResumeId === resume.id}
                      onChange={() => setSelectedResumeId(resume.id)}
                      className="text-primary"
                    />
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{resume.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {resume.fileName} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {resume.isDefault && (
                      <span className="text-xs text-primary">Default</span>
                    )}
                  </label>
                ))}
              </div>
            )}
            
            {/* Upload New Resume */}
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setResumeFile(file);
                    handleFileUpload(file);
                  }
                }}
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading...' : 'Upload new resume'}</span>
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Cover Letter (Optional)
              </label>
              {coverLetters.length > 0 && !useCustomCoverLetter && (
                <button
                  onClick={() => setUseCustomCoverLetter(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Write custom
                </button>
              )}
            </div>
            
            {useCustomCoverLetter ? (
              <div className="space-y-2">
                <textarea
                  value={coverLetterContent}
                  onChange={(e) => setCoverLetterContent(e.target.value)}
                  placeholder="Write your cover letter here..."
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUseCustomCoverLetter(false);
                      setCoverLetterContent(coverLetters.find(l => l.id === selectedCoverLetterId)?.content || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveCoverLetter}
                    disabled={!coverLetterContent.trim()}
                  >
                    Save & Use
                  </Button>
                </div>
              </div>
            ) : coverLetters.length > 0 ? (
              <select
                value={selectedCoverLetterId}
                onChange={(e) => {
                  setSelectedCoverLetterId(e.target.value);
                  const letter = coverLetters.find(l => l.id === e.target.value);
                  if (letter) setCoverLetterContent(letter.content);
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">No cover letter</option>
                {coverLetters.map(letter => (
                  <option key={letter.id} value={letter.id}>
                    {letter.title}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setUseCustomCoverLetter(true)}
                className="w-full px-4 py-3 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                + Add cover letter
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            {!hasApplied && (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedResumeId || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

