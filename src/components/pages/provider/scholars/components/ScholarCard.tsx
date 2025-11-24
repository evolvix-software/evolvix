"use client";

import { Scholar } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import {
  User,
  Award,
  TrendingUp,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  Eye,
  MessageSquare,
  FileText,
  Calendar,
} from 'lucide-react';

interface ScholarCardProps {
  scholar: Scholar;
  viewMode: 'grid' | 'list';
  onClick?: () => void;
}

export function ScholarCard({ scholar, viewMode, onClick }: ScholarCardProps) {
  const progress = scholar.enrollments.length > 0
    ? scholar.enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / scholar.enrollments.length
    : 0;

  const isAtRisk = (scholar.riskScore || 0) >= 70;
  const isGraduated = scholar.graduationStatus === 'graduated';
  const isPlaced = scholar.jobPlacement?.status === 'started';

  if (viewMode === 'list') {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {scholar.profile.photo ? (
                  <img src={scholar.profile.photo} alt={scholar.profile.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{scholar.profile.name}</h3>
                <p className="text-sm text-muted-foreground">{scholar.profile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-muted-foreground">
                    CGPA: {scholar.currentCGPA || scholar.baselineCGPA}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Progress: {Math.round(progress)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isGraduated && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    Graduated
                  </span>
                )}
                {isPlaced && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-medium flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Placed
                  </span>
                )}
                {isAtRisk && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-xs font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    At Risk
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {scholar.profile.photo ? (
                <img src={scholar.profile.photo} alt={scholar.profile.name} className="w-12 h-12 rounded-full" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{scholar.profile.name}</h3>
              <p className="text-sm text-muted-foreground">{scholar.profile.email}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {isGraduated && (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 text-xs font-medium flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              Graduated
            </span>
          )}
          {isPlaced && (
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Job Placed
            </span>
          )}
          {isAtRisk && (
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              At Risk
            </span>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Current CGPA</p>
            <p className="text-lg font-bold text-foreground flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              {scholar.currentCGPA || scholar.baselineCGPA}
            </p>
            {scholar.currentCGPA && scholar.baselineCGPA && (
              <p className="text-xs text-green-600 mt-1">
                +{(scholar.currentCGPA - scholar.baselineCGPA).toFixed(2)} improvement
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground mb-1">Progress</p>
            <p className="text-lg font-bold text-foreground">{Math.round(progress)}%</p>
            <div className="w-full bg-background rounded-full h-1.5 mt-2">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Award Info */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Award className="w-4 h-4 text-primary" />
              Award Amount
            </span>
            <span className="text-sm font-semibold text-foreground">
              ₹{scholar.awardAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            <Eye className="w-4 h-4 mr-1" />
            View Profile
          </Button>
          <div className="relative group">
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              <MessageSquare className="w-4 h-4" />
            </Button>
            {/* Quick Actions Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                >
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <FileText className="w-4 h-4" />
                  Add Note
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Mentor Session
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Briefcase className="w-4 h-4" />
                  Update Job Placement
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <GraduationCap className="w-4 h-4" />
                  Record Graduation
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <TrendingUp className="w-4 h-4" />
                  View Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

