"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Search,
  Plus,
  Copy,
  Edit,
  Trash2,
  Share2,
  BookOpen,
  Filter,
  X,
} from 'lucide-react';
import { AssignmentTemplate } from '@/interfaces/assignments';
import { useAppSelector } from '@/hooks';

interface AssignmentTemplatesProps {
  templates: AssignmentTemplate[];
  onSelectTemplate: (template: AssignmentTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onShareTemplate: (templateId: string) => void;
}

export function AssignmentTemplates({
  templates,
  onSelectTemplate,
  onDeleteTemplate,
  onShareTemplate,
}: AssignmentTemplatesProps) {
  const { courses } = useAppSelector(state => state.courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const categories = ['programming', 'design', 'data-science', 'business', 'other'];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = !searchQuery ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
      const matchesCourse = courseFilter === 'all' || template.courseId === courseFilter;
      
      return matchesSearch && matchesCategory && matchesCourse;
    });
  }, [templates, searchQuery, categoryFilter, courseFilter]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Assignment Templates
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Reusable assignment templates for quick creation
          </p>
        </div>
        <Button
          onClick={() => {
            // Open create template modal
            console.log('Create new template');
          }}
          className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="border border-slate-200 dark:border-slate-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No templates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery || categoryFilter !== 'all' || courseFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first assignment template to get started'}
            </p>
            <Button
              onClick={() => console.log('Create template')}
              className="bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const course = template.courseId ? courses.find(c => c.id === template.courseId) : null;
            
            return (
              <Card
                key={template.id}
                className="border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                        {template.title}
                      </CardTitle>
                      {course && (
                        <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 mt-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{course.title}</span>
                        </div>
                      )}
                    </div>
                    {template.isShared && (
                      <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        {template.category}
                      </span>
                      <span>Max Score: {template.maxScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                      className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onShareTemplate(template.id)}
                      className="border-slate-300 dark:border-slate-600"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTemplate(template.id)}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

