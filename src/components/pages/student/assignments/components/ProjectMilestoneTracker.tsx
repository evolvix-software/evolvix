"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Assignment } from '@/interfaces/assignments';

interface ProjectMilestoneTrackerProps {
  assignment: Assignment;
}

interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
}

interface ProjectMilestone {
  id: string;
  title: string;
  tasks: ProjectTask[];
  deadline: string;
}

interface MentorGuidance {
  id: string;
  milestoneId: string;
  note: string;
  createdAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export function ProjectMilestoneTracker({ assignment }: ProjectMilestoneTrackerProps) {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [guidance, setGuidance] = useState<MentorGuidance[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Generate mock milestones based on assignment
  useEffect(() => {
    if (assignment.type !== 'project') return;

    // Mock milestones - in real app, fetch from API
    const mockMilestones: ProjectMilestone[] = [
      {
        id: 'milestone_1',
        title: 'Planning & Design',
        tasks: [
          {
            id: 'task_1',
            title: 'Create wireframes and mockups',
            description: 'Design the user interface for all pages',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true,
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'task_2',
            title: 'Set up project structure',
            description: 'Initialize repository and folder structure',
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            completed: true,
            completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'task_3',
            title: 'Create database schema',
            description: 'Design and implement database structure',
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          }
        ],
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone_2',
        title: 'Core Development',
        tasks: [
          {
            id: 'task_4',
            title: 'Implement authentication',
            description: 'User login, registration, and session management',
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          },
          {
            id: 'task_5',
            title: 'Build main features',
            description: 'Implement core functionality',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          },
          {
            id: 'task_6',
            title: 'API integration',
            description: 'Connect frontend with backend APIs',
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          }
        ],
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'milestone_3',
        title: 'Testing & Deployment',
        tasks: [
          {
            id: 'task_7',
            title: 'Write unit tests',
            description: 'Test all components and functions',
            deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          },
          {
            id: 'task_8',
            title: 'Deploy to production',
            description: 'Deploy application to hosting platform',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false
          }
        ],
        deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const mockGuidance: MentorGuidance[] = [
      {
        id: 'guidance_1',
        milestoneId: 'milestone_1',
        note: 'Great start on the wireframes! Consider adding more detail to the user flow diagrams.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'guidance_2',
        milestoneId: 'milestone_1',
        note: 'Make sure to follow the design system guidelines we discussed in class.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Mock team members (if group project)
    const mockTeamMembers: TeamMember[] = assignment.projectNumber === 1 ? [
      {
        id: 'member_1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Frontend Developer'
      },
      {
        id: 'member_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Backend Developer'
      }
    ] : [];

    setMilestones(mockMilestones);
    setGuidance(mockGuidance);
    setTeamMembers(mockTeamMembers);
  }, [assignment]);

  const toggleTaskCompletion = (milestoneId: string, taskId: string) => {
    setMilestones(prev => prev.map(milestone => {
      if (milestone.id === milestoneId) {
        return {
          ...milestone,
          tasks: milestone.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined
              };
            }
            return task;
          })
        };
      }
      return milestone;
    }));
  };

  const overallProgress = useMemo(() => {
    const allTasks = milestones.flatMap(m => m.tasks);
    if (allTasks.length === 0) return 0;
    const completedTasks = allTasks.filter(t => t.completed).length;
    return Math.round((completedTasks / allTasks.length) * 100);
  }, [milestones]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (assignment.type !== 'project') return null;

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Project Milestone Tracker</span>
          </h2>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall Progress</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {overallProgress}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="mb-6 p-4 bg-card dark:bg-card rounded-lg border-2 border-slate-200 dark:border-border">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Team Members</span>
            </h3>
            <div className="space-y-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-foreground">{member.name}</p>
                    {member.role && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{member.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone, milestoneIndex) => {
            const completedTasks = milestone.tasks.filter(t => t.completed).length;
            const milestoneProgress = milestone.tasks.length > 0
              ? Math.round((completedTasks / milestone.tasks.length) * 100)
              : 0;
            const daysUntilDeadline = getDaysUntilDeadline(milestone.deadline);
            const milestoneGuidance = guidance.filter(g => g.milestoneId === milestone.id);

            return (
              <div
                key={milestone.id}
                className="p-5 bg-card dark:bg-card rounded-lg border-2 border-slate-200 dark:border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center font-bold text-sm">
                        {milestoneIndex + 1}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">
                        {milestone.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 ml-11">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {formatDate(milestone.deadline)}</span>
                      </div>
                      {daysUntilDeadline < 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-semibold">
                          Overdue
                        </span>
                      )}
                      {daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && (
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-semibold">
                          Due Soon
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Progress</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {milestoneProgress}%
                    </p>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="mb-4 ml-11">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                      style={{ width: `${milestoneProgress}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 ml-11">
                  {milestone.tasks.map(task => {
                    const taskDaysUntilDeadline = getDaysUntilDeadline(task.deadline);
                    return (
                      <div
                        key={task.id}
                        className="p-3 border-2 border-slate-200 dark:border-border rounded-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleTaskCompletion(milestone.id, task.id)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 hover:text-purple-500" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  task.completed
                                    ? 'text-slate-500 dark:text-slate-400 line-through'
                                    : 'text-slate-900 dark:text-foreground'
                                }`}>
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Due: {formatDate(task.deadline)}</span>
                                  </div>
                                  {task.completed && task.completedAt && (
                                    <span className="text-green-600 dark:text-green-400">
                                      Completed {formatDate(task.completedAt)}
                                    </span>
                                  )}
                                  {!task.completed && taskDaysUntilDeadline < 0 && (
                                    <span className="text-red-600 dark:text-red-400 font-semibold">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mentor Guidance */}
                {milestoneGuidance.length > 0 && (
                  <div className="mt-4 ml-11 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Mentor Guidance</span>
                    </h4>
                    <div className="space-y-2">
                      {milestoneGuidance.map(g => (
                        <div key={g.id} className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="mb-1">{g.note}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {formatDate(g.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}



