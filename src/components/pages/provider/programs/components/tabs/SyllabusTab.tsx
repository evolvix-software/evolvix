"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { ChevronDown, ChevronRight, Clock, BookOpen, FileText } from 'lucide-react';
import { Course } from '@/data/mock/providerData';

interface SyllabusTabProps {
  course: Course;
}

interface SyllabusModule {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedTime: number; // in hours
  topics: string[];
  resources: { name: string; url: string; type: string }[];
}

export function SyllabusTab({ course }: SyllabusTabProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module_1']));

  // Mock syllabus data
  const syllabus: SyllabusModule[] = [
    {
      id: 'module_1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development and modern development practices.',
      order: 1,
      estimatedTime: 8,
      topics: [
        'HTML5 and Semantic HTML',
        'CSS3 and Modern Styling',
        'JavaScript Basics',
        'Developer Tools and Debugging',
      ],
      resources: [
        { name: 'Course Slides', url: '#', type: 'PDF' },
        { name: 'Code Examples', url: '#', type: 'GitHub' },
      ],
    },
    {
      id: 'module_2',
      title: 'Frontend Frameworks',
      description: 'Master React and modern frontend development patterns.',
      order: 2,
      estimatedTime: 12,
      topics: [
        'React Fundamentals',
        'Component Lifecycle',
        'State Management',
        'Hooks and Context API',
      ],
      resources: [
        { name: 'React Documentation', url: '#', type: 'Link' },
        { name: 'Practice Projects', url: '#', type: 'GitHub' },
      ],
    },
    {
      id: 'module_3',
      title: 'Backend Development',
      description: 'Build robust backend services with Node.js and Express.',
      order: 3,
      estimatedTime: 10,
      topics: [
        'Node.js Basics',
        'Express.js Framework',
        'RESTful APIs',
        'Database Integration',
      ],
      resources: [
        { name: 'API Documentation', url: '#', type: 'PDF' },
        { name: 'Database Schema', url: '#', type: 'SQL' },
      ],
    },
    {
      id: 'module_4',
      title: 'Full Stack Integration',
      description: 'Combine frontend and backend to build complete applications.',
      order: 4,
      estimatedTime: 14,
      topics: [
        'Authentication & Authorization',
        'API Integration',
        'Deployment Strategies',
        'Performance Optimization',
      ],
      resources: [
        { name: 'Deployment Guide', url: '#', type: 'PDF' },
        { name: 'Final Project Template', url: '#', type: 'GitHub' },
      ],
    },
  ];

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Learning Objectives</h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Master modern web development technologies and frameworks</li>
            <li>Build full-stack applications from scratch</li>
            <li>Understand best practices for code organization and architecture</li>
            <li>Deploy applications to production environments</li>
            <li>Implement authentication and security best practices</li>
          </ul>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Prerequisites</h2>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Basic understanding of programming concepts</li>
            <li>Familiarity with HTML, CSS, and JavaScript</li>
            <li>Computer with internet connection</li>
            <li>Code editor (VS Code recommended)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Course Outline */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Course Outline</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {syllabus.map((module) => (
              <div key={module.id} className="border border-border rounded-lg">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">Module {module.order}</span>
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                      </div>
                      {expandedModules.has(module.id) && (
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.estimatedTime} hours</span>
                      </div>
                    </div>
                  </div>
                </button>
                {expandedModules.has(module.id) && (
                  <div className="px-4 pb-4 border-t border-border">
                    <div className="pt-4 space-y-4">
                      {/* Topics */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Topics Covered
                        </h4>
                        <ul className="space-y-1 ml-6">
                          {module.topics.map((topic, index) => (
                            <li key={index} className="text-sm text-muted-foreground list-disc">
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Resources */}
                      {module.resources.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Resources
                          </h4>
                          <div className="space-y-1 ml-6">
                            {module.resources.map((resource, index) => (
                              <a
                                key={index}
                                href={resource.url}
                                className="text-sm text-primary hover:underline flex items-center gap-1"
                              >
                                {resource.name}
                                <span className="text-xs text-muted-foreground">({resource.type})</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

