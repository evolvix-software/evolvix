"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient?: string; // e.g., 'from-blue-500 via-blue-600 to-indigo-600'
  bgGradient?: string; // e.g., 'from-blue-50 via-blue-100/50 to-indigo-50 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-indigo-950/30'
  iconBg?: string; // e.g., 'bg-blue-500/10 dark:bg-blue-500/20'
  iconColor?: string; // e.g., 'text-blue-600 dark:text-blue-400'
  shadow?: string; // e.g., 'shadow-blue-500/20 dark:shadow-blue-500/10'
  onClick?: () => void;
  className?: string;
  showHoverBadge?: boolean;
  hoverBadgeText?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Predefined color schemes for convenience
export const STAT_CARD_COLORS = {
  blue: {
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 via-blue-100/50 to-indigo-50 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-indigo-950/30',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    shadow: 'shadow-blue-500/20 dark:shadow-blue-500/10',
  },
  purple: {
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 via-purple-100/50 to-pink-50 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-pink-950/30',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    shadow: 'shadow-purple-500/20 dark:shadow-purple-500/10',
  },
  green: {
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    bgGradient: 'from-green-50 via-emerald-100/50 to-teal-50 dark:from-green-950/30 dark:via-emerald-900/20 dark:to-teal-950/30',
    iconBg: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
    shadow: 'shadow-green-500/20 dark:shadow-green-500/10',
  },
  yellow: {
    gradient: 'from-yellow-500 via-amber-600 to-orange-600',
    bgGradient: 'from-yellow-50 via-amber-100/50 to-orange-50 dark:from-yellow-950/30 dark:via-amber-900/20 dark:to-orange-950/30',
    iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    shadow: 'shadow-yellow-500/20 dark:shadow-yellow-500/10',
  },
  indigo: {
    gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
    bgGradient: 'from-indigo-50 via-indigo-100/50 to-blue-50 dark:from-indigo-950/30 dark:via-indigo-900/20 dark:to-blue-950/30',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    shadow: 'shadow-indigo-500/20 dark:shadow-indigo-500/10',
  },
  pink: {
    gradient: 'from-pink-500 via-rose-600 to-red-600',
    bgGradient: 'from-pink-50 via-rose-100/50 to-red-50 dark:from-pink-950/30 dark:via-rose-900/20 dark:to-red-950/30',
    iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
    shadow: 'shadow-pink-500/20 dark:shadow-pink-500/10',
  },
  emerald: {
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    bgGradient: 'from-emerald-50 via-teal-100/50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-900/20 dark:to-cyan-950/30',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    shadow: 'shadow-emerald-500/20 dark:shadow-emerald-500/10',
  },
  red: {
    gradient: 'from-red-500 via-rose-600 to-pink-600',
    bgGradient: 'from-red-50 via-rose-100/50 to-pink-50 dark:from-red-950/30 dark:via-rose-900/20 dark:to-pink-950/30',
    iconBg: 'bg-red-500/10 dark:bg-red-500/20',
    iconColor: 'text-red-600 dark:text-red-400',
    shadow: 'shadow-red-500/20 dark:shadow-red-500/10',
  },
  gray: {
    gradient: 'from-gray-500 via-slate-600 to-zinc-600',
    bgGradient: 'from-gray-50 via-slate-100/50 to-zinc-50 dark:from-gray-950/30 dark:via-slate-900/20 dark:to-zinc-950/30',
    iconBg: 'bg-gray-500/10 dark:bg-gray-500/20',
    iconColor: 'text-gray-600 dark:text-gray-400',
    shadow: 'shadow-gray-500/20 dark:shadow-gray-500/10',
  },
} as const;

export function StatsCard({
  icon: Icon,
  label,
  value,
  gradient,
  bgGradient,
  iconBg,
  iconColor,
  shadow,
  onClick,
  className,
  showHoverBadge = true,
  hoverBadgeText = 'View',
  trend,
  ...props
}: StatsCardProps) {
  // Use provided colors or default to blue
  const finalGradient = gradient || STAT_CARD_COLORS.blue.gradient;
  const finalBgGradient = bgGradient || STAT_CARD_COLORS.blue.bgGradient;
  const finalIconBg = iconBg || STAT_CARD_COLORS.blue.iconBg;
  const finalIconColor = iconColor || STAT_CARD_COLORS.blue.iconColor;
  const finalShadow = shadow || STAT_CARD_COLORS.blue.shadow;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br',
        finalBgGradient,
        'border border-slate-200/50 dark:border-slate-700/50',
        'p-6 transition-all duration-300',
        onClick && 'cursor-pointer hover:scale-105 hover:shadow-2xl',
        finalShadow,
        className
      )}
      {...props}
    >
      {/* Animated background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br',
          finalGradient,
          'opacity-0 group-hover:opacity-5 transition-opacity duration-300'
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'p-3 rounded-xl',
              finalIconBg,
              'group-hover:scale-110 transition-transform duration-300'
            )}
          >
            <Icon className={cn('w-6 h-6', finalIconColor)} />
          </div>
          {showHoverBadge && (
            <div
              className={cn(
                'text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r',
                finalGradient,
                'text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
              )}
            >
              {hoverBadgeText}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {label}
          </p>
          <p
            className={cn(
              'text-4xl font-bold bg-gradient-to-r',
              finalGradient,
              'bg-clip-text text-transparent'
            )}
          >
            {value}
          </p>
          {trend && (
            <div className={cn(
              'flex items-center mt-2 text-xs font-medium',
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="ml-1 text-slate-500 dark:text-slate-400">vs last month</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative corner element */}
      <div
        className={cn(
          'absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br',
          finalGradient,
          'opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300'
        )}
      />
    </div>
  );
}

