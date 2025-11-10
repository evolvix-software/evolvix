"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ModuleTest } from '../TestsPage';
import { Course } from '@/data/mock/coursesData';
import {
  FileText,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Calendar,
} from 'lucide-react';

interface TestListProps {
  tests: ModuleTest[];
  courses: Course[];
  onSelectTest: (test: ModuleTest) => void;
  onDelete: (testId: string) => void;
}

export function TestList({ tests, courses, onSelectTest, onDelete }: TestListProps) {
  const router = useRouter();

  const getCourseTitle = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.title || 'Unknown Course';
  };

  const handleViewTest = (test: ModuleTest, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/portal/mentor/tests/${test.id}`);
  };

  const getStatusBadge = (test: ModuleTest) => {
    const now = new Date();
    const opensAt = new Date(test.openedAt);
    const closesAt = new Date(test.closesAt);

    if (now < opensAt) {
      return { label: 'Scheduled', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
    } else if (now > closesAt) {
      return { label: 'Closed', color: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400' };
    } else {
      return { label: 'Active', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
    }
  };

  if (tests.length === 0) {
    return (
      <Card className="border border-border">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Tests Yet
          </h3>
          <p className="text-muted-foreground">
            Create your first module test to assess student understanding
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map(test => {
        const status = getStatusBadge(test);
        return (
          <Card
            key={test.id}
            className="border border-border hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectTest(test)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {test.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getCourseTitle(test.courseId)} • {test.moduleTitle}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{test.questions.length} Questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{test.timeLimit} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{test.assignedTo.length} Students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(test.openedAt).toLocaleDateString()} - {new Date(test.closesAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleViewTest(test, e)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(test.id);
                    }}
                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

