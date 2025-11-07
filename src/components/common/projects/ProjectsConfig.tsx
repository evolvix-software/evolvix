"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, X } from 'lucide-react';
import { CourseProject } from '@/data/mock/coursesData';

interface ProjectsConfigProps {
  projects: CourseProject[];
  onProjectsChange: (projects: CourseProject[]) => void;
  courseDuration: string; // e.g., "3 months"
}

export function ProjectsConfig({ projects, onProjectsChange, courseDuration }: ProjectsConfigProps) {
  const [showAddProject, setShowAddProject] = useState(false);

  const addProject = (isFinal: boolean = false) => {
    const newProject: CourseProject = {
      id: `project_${Date.now()}`,
      projectNumber: projects.length + 1,
      title: isFinal ? 'Final Project (Student Choice)' : '',
      description: '',
      technologies: [],
      requirements: [],
      difficulty: 'beginner',
      estimatedDuration: '2 weeks',
      maxScore: 100,
      weight: isFinal ? 20 : 10,
      isFinalProject: isFinal,
      finalProjectGuidelines: isFinal ? 'Student can choose their own project idea. It should demonstrate mastery of all course concepts.' : undefined,
    };
    onProjectsChange([...projects, newProject]);
    setShowAddProject(false);
  };

  const removeProject = (id: string) => {
    onProjectsChange(projects.filter(p => p.id !== id).map((p, idx) => ({ ...p, projectNumber: idx + 1 })));
  };

  const updateProject = (id: string, field: string, value: any) => {
    onProjectsChange(projects.map(p => {
      if (p.id === id) {
        if (field === 'technologies' && typeof value === 'string') {
          return { ...p, technologies: value.split(',').map(t => t.trim()).filter(t => t) };
        }
        if (field === 'requirements' && typeof value === 'string') {
          return { ...p, requirements: value.split('\n').filter(r => r.trim()) };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Course Projects</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Define projects for this course. The final project will be student's choice.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => addProject(false)}
            className="border-slate-200 dark:border-slate-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          {!projects.some(p => p.isFinalProject) && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => addProject(true)}
              className="border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Final Project
            </Button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No projects added yet</p>
          <div className="flex justify-center space-x-2">
            <Button type="button" onClick={() => addProject(false)} variant="outline" className="border-slate-200 dark:border-slate-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Project
            </Button>
            <Button type="button" onClick={() => addProject(true)} variant="outline" className="border-green-200 dark:border-green-800 text-green-600 dark:text-green-400">
              <Plus className="w-4 h-4 mr-2" />
              Add Final Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Card key={project.id} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {project.isFinalProject ? '🏆 Final Project (Student Choice)' : `Project ${project.projectNumber}`}
                    </CardTitle>
                    <CardDescription>
                      {project.isFinalProject ? 'Students choose their own project idea' : `Part of course curriculum`}
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeProject(project.id)}
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Project Title *</Label>
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder={project.isFinalProject ? 'Final Project (Student Choice)' : 'e.g., Todo App with React'}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Difficulty Level *</Label>
                    <select
                      value={project.difficulty}
                      onChange={(e) => updateProject(project.id, 'difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Estimated Duration *</Label>
                    <Input
                      value={project.estimatedDuration}
                      onChange={(e) => updateProject(project.id, 'estimatedDuration', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="e.g., 2 weeks, 1 month"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Max Score *</Label>
                    <Input
                      type="number"
                      value={project.maxScore}
                      onChange={(e) => updateProject(project.id, 'maxScore', parseInt(e.target.value) || 100)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      min={1}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Weight (%) *</Label>
                    <Input
                      type="number"
                      value={project.weight}
                      onChange={(e) => updateProject(project.id, 'weight', parseInt(e.target.value) || 10)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Due Date</Label>
                    <Input
                      type="date"
                      value={project.dueDate || ''}
                      onChange={(e) => updateProject(project.id, 'dueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Description *</Label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                    placeholder="Describe what students will build in this project..."
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Technologies (comma-separated) *</Label>
                  <Input
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="e.g., React, Node.js, MongoDB, Express"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Requirements (one per line) *</Label>
                  <textarea
                    value={project.requirements.join('\n')}
                    onChange={(e) => updateProject(project.id, 'requirements', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                    placeholder="User authentication&#10;CRUD operations&#10;Responsive design&#10;API integration"
                  />
                </div>

                {project.isFinalProject && (
                  <div>
                    <Label className="mb-2 block">Final Project Guidelines</Label>
                    <textarea
                      value={project.finalProjectGuidelines || ''}
                      onChange={(e) => updateProject(project.id, 'finalProjectGuidelines', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                      placeholder="Guidelines for students choosing their final project..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

