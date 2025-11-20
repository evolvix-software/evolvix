/**
 * Course Type Badge Component
 * Displays course type with appropriate styling
 */

import React from 'react';
import { Badge } from '../ui/Badge';
import { CourseType } from '@/interfaces/course';
import { GraduationCap, Zap, BookOpen } from 'lucide-react';

export interface CourseTypeBadgeProps {
  courseType: CourseType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const CourseTypeBadge: React.FC<CourseTypeBadgeProps> = ({
  courseType,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    crash: {
      label: 'Crash Course',
      variant: 'info' as const,
      icon: <Zap className="w-3 h-3" />,
      color: 'blue',
    },
    'skill-focused': {
      label: 'Skill Course',
      variant: 'success' as const,
      icon: <BookOpen className="w-3 h-3" />,
      color: 'green',
    },
    bootcamp: {
      label: 'Full Career Bootcamp',
      variant: 'primary' as const,
      icon: <GraduationCap className="w-3 h-3" />,
      color: 'purple',
    },
  };

  const { label, variant, icon } = config[courseType];

  return (
    <Badge variant={variant} size={size}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {label}
    </Badge>
  );
};

