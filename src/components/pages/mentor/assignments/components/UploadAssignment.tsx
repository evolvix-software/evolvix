"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Upload, X, FileText, Calendar, BookOpen, Code } from 'lucide-react';
import { Assignment, AssignmentType } from '@/interfaces/assignments';
import { useAppSelector } from '@/hooks';

interface UploadAssignmentProps {
  onSubmit: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'createdBy'>) => void;
  onCancel?: () => void;
}

export function UploadAssignment({ onSubmit, onCancel }: UploadAssignmentProps) {
  const { courses } = useAppSelector(state => state.courses);
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('class');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [attachments, setAttachments] = useState<Array<{ name: string; file: File }>>([]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const availableProjects = selectedCourse?.projects || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      name: file.name,
      file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId || !title || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (assignmentType === 'project' && !selectedProjectId) {
      alert('Please select a project');
      return;
    }

    onSubmit({
      title,
      description,
      type: assignmentType,
      courseId: selectedCourseId,
      courseTitle: selectedCourse?.title || '',
      projectId: assignmentType === 'project' ? selectedProjectId : undefined,
      projectNumber: assignmentType === 'project' 
        ? availableProjects.find(p => p.id === selectedProjectId)?.projectNumber 
        : undefined,
      dueDate,
      maxScore,
      instructions,
      attachments: attachments.map((att, idx) => ({
        id: `att_${idx}`,
        name: att.name,
        url: URL.createObjectURL(att.file),
        type: att.file.type
      }))
    });

    // Reset form
    setTitle('');
    setDescription('');
    setInstructions('');
    setDueDate('');
    setMaxScore(100);
    setAttachments([]);
    setSelectedCourseId('');
    setSelectedProjectId('');
    setAssignmentType('class');
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5" />
          <span>Create New Assignment</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Assignment Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Assignment Type *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  setAssignmentType('class');
                  setSelectedProjectId('');
                }}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  assignmentType === 'class'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-slate-900 dark:text-white">Class Assignment</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  For daily/weekly assignments
                </p>
              </button>
              <button
                type="button"
                onClick={() => setAssignmentType('project')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  assignmentType === 'project'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Code className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <p className="font-semibold text-slate-900 dark:text-white">Project</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  For course projects
                </p>
              </button>
            </div>
          </div>

          {/* Course Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Course *
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedProjectId('');
              }}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Project Selection (if type is project) */}
          {assignmentType === 'project' && selectedCourseId && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Project *
              </label>
              {availableProjects.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    No projects configured for this course. Please add projects first.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a project</option>
                  {availableProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      Project {project.projectNumber}: {project.title}
                      {project.isFinalProject && ' (Final Project)'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Assignment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Daily Assignment: Personal Portfolio Page"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the assignment..."
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Detailed Instructions *
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step-by-step instructions for students..."
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Due Date and Max Score */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Due Date *</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Maximum Score *
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click to upload files or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  PDF, DOC, ZIP, or other files
                </p>
              </label>
            </div>
            {attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900 dark:text-white">{att.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-slate-300 dark:border-slate-700"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

