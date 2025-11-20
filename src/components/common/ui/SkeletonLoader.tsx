/**
 * Skeleton Loader Component
 */

import { cn } from '@/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular', 
  width, 
  height,
  lines,
  ...props 
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  if (variant === 'text' && lines) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              i === lines - 1 ? 'w-3/4' : 'w-full',
              height || 'h-4'
            )}
          />
        ))}
      </div>
    );
  }
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={cn(
        baseClasses,
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4',
        !width && variant === 'rectangular' && 'w-full',
        !height && variant === 'rectangular' && 'h-20',
        className
      )}
      style={style}
      {...props}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="p-4 border border-border bg-card rounded-lg space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
    </div>
  );
}

export function JobDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton variant="text" width="70%" height={32} />
        <Skeleton variant="text" width="50%" height={20} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={100} height={28} />
          <Skeleton variant="rectangular" width={100} height={28} />
        </div>
      </div>
      <Skeleton variant="text" lines={5} />
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

