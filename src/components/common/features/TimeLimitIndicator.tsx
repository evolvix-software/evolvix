/**
 * Time Limit Indicator Component
 * Shows time remaining for Crash/Skill courses
 */

import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { CourseType } from '@/interfaces/course';
import { isCourseAccessExpired } from '@/utils/accessControl';

export interface TimeLimitIndicatorProps {
  courseType: CourseType;
  enrollmentDate: string;
  timeLimitDays?: number;
  showIcon?: boolean;
}

export const TimeLimitIndicator: React.FC<TimeLimitIndicatorProps> = ({
  courseType,
  enrollmentDate,
  timeLimitDays,
  showIcon = true,
}) => {
  // Bootcamp courses have no time limits
  if (courseType === 'bootcamp') {
    return null;
  }

  if (!timeLimitDays) {
    return null;
  }

  const isExpired = isCourseAccessExpired(enrollmentDate, courseType, timeLimitDays);

  if (isExpired) {
    return (
      <Badge variant="error" size="sm">
        {showIcon && <AlertCircle className="w-3 h-3 mr-1" />}
        Access Expired
      </Badge>
    );
  }

  const enrollment = new Date(enrollmentDate);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - enrollment.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = timeLimitDays - daysDiff;

  if (daysRemaining <= 0) {
    return (
      <Badge variant="error" size="sm">
        {showIcon && <AlertCircle className="w-3 h-3 mr-1" />}
        Expired
      </Badge>
    );
  }

  const isWarning = daysRemaining <= 3;

  return (
    <Badge variant={isWarning ? 'warning' : 'info'} size="sm">
      {showIcon && <Clock className="w-3 h-3 mr-1" />}
      {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
    </Badge>
  );
};

