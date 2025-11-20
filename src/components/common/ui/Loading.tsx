/**
 * Loading Components
 * Skeleton loaders and spinners
 */

import React from 'react';
import { cn } from '@/utils';
import { Loader2 } from 'lucide-react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  style,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-muted rounded';

  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? undefined : '1rem'),
        ...style,
      }}
      {...props}
    />
  );
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary';
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'default',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variants = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <Loader2
        className={cn('animate-spin', sizes[size], variants[variant])}
      />
    </div>
  );
};

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm z-10">
        <div className="text-center">
          <Spinner size="lg" variant="primary" />
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

