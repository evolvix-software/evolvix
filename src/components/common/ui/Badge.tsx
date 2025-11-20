/**
 * Reusable Badge Component
 * For course types, status indicators, etc.
 */

import React from 'react';
import { cn } from '@/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-muted-foreground',
      success: 'bg-success/20 text-success-foreground',
      warning: 'bg-warning/20 text-warning-foreground',
      error: 'bg-destructive/20 text-destructive-foreground',
      info: 'bg-info/20 text-info-foreground',
      primary: 'bg-primary text-primary-foreground',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              variant === 'default' && 'bg-muted-foreground/50',
              variant === 'success' && 'bg-success',
              variant === 'warning' && 'bg-warning',
              variant === 'error' && 'bg-destructive',
              variant === 'info' && 'bg-info',
              variant === 'primary' && 'bg-primary-foreground'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

