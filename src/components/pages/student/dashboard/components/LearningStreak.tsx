"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';

interface LearningStreakProps {
  streak?: number;
}

export function LearningStreak({ streak = 12 }: LearningStreakProps) {
  const streakData = Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: i < streak ? 1 : 0,
    maxValue: 1
  }));

  // Calculate milestones
  const nextMilestone = streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : streak < 60 ? 60 : 100;
  const daysToNextMilestone = nextMilestone - streak;
  const progressToMilestone = (streak / nextMilestone) * 100;

  // Get milestone badge
  const getMilestoneBadge = () => {
    if (streak >= 100) return { icon: Trophy, text: 'Centurion', color: 'text-warning' };
    if (streak >= 60) return { icon: Trophy, text: 'Dedicated', color: 'text-primary' };
    if (streak >= 30) return { icon: Trophy, text: 'Monthly', color: 'text-primary' };
    if (streak >= 14) return { icon: Target, text: 'Bi-weekly', color: 'text-success' };
    if (streak >= 7) return { icon: TrendingUp, text: 'Weekly', color: 'text-warning' };
    return null;
  };

  const milestone = getMilestoneBadge();

  return (
    <Card className="border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-foreground">
          <Flame className="w-5 h-5 text-warning" />
          <span>Learning Streak</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">Your daily learning consistency</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Streak Display */}
        <div className="flex items-center justify-center py-2">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="text-5xl font-bold text-warning mb-1">{streak}</div>
              <div className="absolute -top-1 -right-1">
                <Flame className="w-6 h-6 text-warning animate-pulse" />
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-1">Days in a row</div>
          </div>
        </div>

        {/* Milestone Badge */}
        {milestone && (
          <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-warning/10 to-warning/10 border border-warning/20`}>
            <milestone.icon className={`w-5 h-5 ${milestone.color}`} />
            <span className={`text-sm font-semibold ${milestone.color}`}>{milestone.text} Achiever!</span>
          </div>
        )}

        {/* Streak Calendar Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Last 30 Days</span>
            <span className="text-xs text-muted-foreground">{streak}/30 active</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 p-2 bg-muted rounded-lg">
            {streakData.map((day, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md flex items-center justify-center transition-all ${
                  day.value === 1
                    ? 'bg-gradient-to-br from-warning to-warning shadow-sm'
                    : 'bg-secondary'
                }`}
                title={`Day ${index + 1}${day.value === 1 ? ' ✓' : ''}`}
              >
                {day.value === 1 && (
                  <Flame className="w-2.5 h-2.5 text-warning-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Milestone Progress */}
        {daysToNextMilestone > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Next Milestone</span>
              <span className="text-xs font-semibold text-warning">{daysToNextMilestone} days</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-warning to-warning h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressToMilestone, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {daysToNextMilestone} more day{daysToNextMilestone !== 1 ? 's' : ''} until {nextMilestone}-day milestone! 🎯
            </p>
          </div>
        )}

        {/* Motivational Message */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center font-medium">
            {streak >= 30 
              ? '🔥 Incredible dedication! Keep it up!' 
              : streak >= 14
              ? '💪 You\'re building an amazing habit!'
              : streak >= 7
              ? '⭐ Great start! Consistency is key!'
              : '🚀 Keep your streak going! Every day counts!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

