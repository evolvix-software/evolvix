"use client";

import { Card, CardContent } from '@/components/forms/Card';
import { Button } from '@/components/forms/Button';
import { Lightbulb, CheckCircle, TrendingUp } from 'lucide-react';

export function ProjectsContent() {
  const projects = [
    { id: 1, title: 'E-commerce Platform', entrepreneur: 'John Doe', milestone: 3, totalMilestones: 5, status: 'active' },
    { id: 2, title: 'Mobile App Development', entrepreneur: 'Jane Smith', milestone: 2, totalMilestones: 4, status: 'active' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Project Mentorship</h2>
        <p className="text-slate-600 dark:text-slate-400">Track assigned projects and approve milestones</p>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Entrepreneur: {project.entrepreneur}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Milestone Progress</span>
                      <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${(project.milestone / project.totalMilestones) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {project.milestone}/{project.totalMilestones}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve Milestone
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



