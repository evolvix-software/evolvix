"use client";

import { useState } from 'react';
import { useAppDispatch } from '@/hooks';
import { submitProject } from '@/store/features/projects/projectsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { Upload, Link2, Github, FileText, Save, CheckCircle2 } from 'lucide-react';
import { CourseProject, ProjectSubmission as ProjectSubmissionType } from '@/data/mock/coursesData';

interface ProjectSubmissionProps {
  project: CourseProject;
  courseId: string;
  studentId: string;
  studentName: string;
  existingSubmission?: ProjectSubmissionType;
  onSuccess: () => void;
}

export function ProjectSubmission({ 
  project, 
  courseId, 
  studentId, 
  studentName,
  existingSubmission,
  onSuccess 
}: ProjectSubmissionProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    githubUrl: existingSubmission?.githubUrl || '',
    liveLink: existingSubmission?.liveLink || '',
    documents: existingSubmission?.documents || [] as Array<{ id: string; name: string; url: string; type: 'pdf' | 'doc' | 'zip' | 'other' }>,
    customProjectTitle: project.isFinalProject ? (existingSubmission?.githubUrl ? '' : '') : '',
    customDescription: project.isFinalProject ? (existingSubmission?.githubUrl ? '' : '') : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newDocuments = files.map(file => ({
      id: `doc_${Date.now()}_${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.name.endsWith('.pdf') ? 'pdf' as const : 
            file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' as const :
            file.name.endsWith('.zip') || file.name.endsWith('.rar') ? 'zip' as const : 'other' as const,
    }));
    setFormData({ ...formData, documents: [...formData.documents, ...newDocuments] });
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeDocument = (docId: string) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter(d => d.id !== docId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.githubUrl.trim()) {
      alert('Please provide a GitHub URL');
      return;
    }

    setIsSubmitting(true);

    const submission: ProjectSubmissionType = {
      id: existingSubmission?.id || `submission_${Date.now()}`,
      projectId: project.id,
      courseId,
      studentId,
      studentName,
      githubUrl: formData.githubUrl,
      liveLink: formData.liveLink || undefined,
      documents: formData.documents,
      submittedAt: existingSubmission?.submittedAt || new Date().toISOString(),
      status: 'pending',
      maxScore: project.maxScore,
    };

    dispatch(submitProject(submission));
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {project.isFinalProject ? '🏆 Final Project Submission' : `Project ${project.projectNumber} Submission`}
          </span>
          {existingSubmission && existingSubmission.status === 'reviewed' && (
            <span className="text-sm font-normal text-green-600 dark:text-green-400 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Reviewed: {existingSubmission.score}/{existingSubmission.maxScore}
            </span>
          )}
        </CardTitle>
        <CardDescription>{project.title}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{project.description}</p>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-foreground mb-2">Technologies Required:</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {project.requirements.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-slate-900 dark:text-foreground mb-2">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {project.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.isFinalProject && project.finalProjectGuidelines && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">Final Project Guidelines:</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">{project.finalProjectGuidelines}</p>
              </div>
            )}
          </div>

          {project.isFinalProject && (
            <>
              <div>
                <Label htmlFor="customTitle" className="mb-2 block">Your Project Title *</Label>
                <Input
                  id="customTitle"
                  value={formData.customProjectTitle}
                  onChange={(e) => setFormData({ ...formData, customProjectTitle: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="e.g., E-commerce Platform with MERN Stack"
                />
              </div>
              <div>
                <Label htmlFor="customDescription" className="mb-2 block">Project Description *</Label>
                <textarea
                  id="customDescription"
                  value={formData.customDescription}
                  onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                  placeholder="Describe your project idea and features..."
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="githubUrl" className="mb-2 block flex items-center">
              <Github className="w-4 h-4 mr-2" />
              GitHub Repository URL *</Label>
            <Input
              id="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="https://github.com/username/repository"
            />
          </div>

          <div>
            <Label htmlFor="liveLink" className="mb-2 block flex items-center">
              <Link2 className="w-4 h-4 mr-2" />
              Live Demo URL (Optional)</Label>
            <Input
              id="liveLink"
              type="url"
              value={formData.liveLink}
              onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="https://your-project.vercel.app"
            />
          </div>

          <div>
            <Label className="mb-2 block flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Supporting Documents (Optional)
            </Label>
            <label className="flex items-center space-x-2 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-card dark:bg-slate-800 text-slate-900 dark:text-foreground cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Upload Documents (PDF, DOC, ZIP)</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {formData.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{doc.name}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <span className="text-xs">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {existingSubmission?.mentorFeedback && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Mentor Feedback:</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">{existingSubmission.mentorFeedback}</p>
              {existingSubmission.score !== undefined && (
                <p className="mt-2 text-sm font-medium text-blue-900 dark:text-blue-400">
                  Score: {existingSubmission.score}/{existingSubmission.maxScore}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {existingSubmission ? 'Update Submission' : 'Submit Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

