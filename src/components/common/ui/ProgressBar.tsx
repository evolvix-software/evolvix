/**
 * Reusable Progress Bar Component
 */

import React from 'react';
import { cn } from '@/utils';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      variant = 'primary',
      showLabel = false,
      label,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), 100);

    const variants = {
      default: 'bg-muted-foreground',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-destructive',
      primary: 'bg-primary',
    };

    const sizes = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">
              {label || 'Progress'}
            </span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(clampedValue)}%
            </span>
          </div>
        )}
        <div
          className={cn(
            'w-full bg-muted rounded-full overflow-hidden',
            sizes[size]
          )}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out',
              variants[variant]
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

