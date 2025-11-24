"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Trophy, TrendingUp, GraduationCap, Briefcase, Award, Users } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { Scholar } from '@/data/mock/providerData';

interface TopPerformersLeaderboardProps {
  providerId?: string;
  campaignId?: string;
}

type LeaderboardType = 'highest-cgpa' | 'most-improved' | 'fastest-graduates' | 'best-placements' | 'most-engaged';

interface LeaderboardEntry {
  rank: number;
  scholar: Scholar;
  metric: number;
  metricLabel: string;
}

export function TopPerformersLeaderboard({ providerId, campaignId }: TopPerformersLeaderboardProps) {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('highest-cgpa');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!providerId) return;

    const scholars = scholarService.getAll(providerId);
    const filteredScholars = campaignId
      ? scholars.filter(s => s.campaignId === campaignId)
      : scholars;

    let leaderboardEntries: LeaderboardEntry[] = [];

    switch (leaderboardType) {
      case 'highest-cgpa':
        leaderboardEntries = filteredScholars
          .filter(s => s.currentCGPA || s.graduationCGPA)
          .map(s => ({
            rank: 0,
            scholar: s,
            metric: s.currentCGPA || s.graduationCGPA || s.baselineCGPA,
            metricLabel: 'CGPA',
          }))
          .sort((a, b) => b.metric - a.metric)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        break;

      case 'most-improved':
        leaderboardEntries = filteredScholars
          .filter(s => s.currentCGPA && s.baselineCGPA)
          .map(s => ({
            rank: 0,
            scholar: s,
            metric: (s.currentCGPA || s.baselineCGPA) - s.baselineCGPA,
            metricLabel: 'CGPA Improvement',
          }))
          .sort((a, b) => b.metric - a.metric)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        break;

      case 'fastest-graduates':
        leaderboardEntries = filteredScholars
          .filter(s => s.graduationStatus === 'graduated' && s.graduationDate && s.awardDate)
          .map(s => {
            const awardDate = new Date(s.awardDate);
            const graduationDate = new Date(s.graduationDate!);
            const days = Math.floor((graduationDate.getTime() - awardDate.getTime()) / (1000 * 60 * 60 * 24));
            return {
              rank: 0,
              scholar: s,
              metric: days,
              metricLabel: 'Days to Graduate',
            };
          })
          .sort((a, b) => a.metric - b.metric)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        break;

      case 'best-placements':
        leaderboardEntries = filteredScholars
          .filter(s => s.jobPlacement?.verified && s.jobPlacement?.salary?.amount)
          .map(s => ({
            rank: 0,
            scholar: s,
            metric: s.jobPlacement!.salary!.amount,
            metricLabel: 'Salary',
          }))
          .sort((a, b) => b.metric - a.metric)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        break;

      case 'most-engaged':
        leaderboardEntries = filteredScholars
          .map(s => {
            const videoWatch = s.engagement?.videoWatchPercentage || 0;
            const assignmentRate = s.engagement?.assignmentSubmissionRate || 0;
            const completionRate = s.enrollments?.[0]?.completionPercentage || 0;
            const loginScore = Math.min((s.engagement?.totalLogins || 0) / 10, 1) * 100;
            const mentorScore = Math.min((s.engagement?.mentorSessionCount || 0) / 5, 1) * 100;
            
            const engagementScore = (
              (videoWatch * 0.3) +
              (assignmentRate * 0.3) +
              (completionRate * 0.2) +
              (loginScore * 0.1) +
              (mentorScore * 0.1)
            );

            return {
              rank: 0,
              scholar: s,
              metric: engagementScore,
              metricLabel: 'Engagement Score',
            };
          })
          .sort((a, b) => b.metric - a.metric)
          .slice(0, 10)
          .map((entry, index) => ({ ...entry, rank: index + 1 }));
        break;
    }

    setEntries(leaderboardEntries);
  }, [providerId, campaignId, leaderboardType]);

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'highest-cgpa':
        return 'Highest CGPA';
      case 'most-improved':
        return 'Most Improved';
      case 'fastest-graduates':
        return 'Fastest Graduates';
      case 'best-placements':
        return 'Best Job Placements';
      case 'most-engaged':
        return 'Most Engaged';
      default:
        return 'Top Performers';
    }
  };

  const getLeaderboardIcon = () => {
    switch (leaderboardType) {
      case 'highest-cgpa':
        return <Award className="w-5 h-5" />;
      case 'most-improved':
        return <TrendingUp className="w-5 h-5" />;
      case 'fastest-graduates':
        return <GraduationCap className="w-5 h-5" />;
      case 'best-placements':
        return <Briefcase className="w-5 h-5" />;
      case 'most-engaged':
        return <Users className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const formatMetric = (entry: LeaderboardEntry) => {
    if (leaderboardType === 'best-placements') {
      return `₹${(entry.metric / 100000).toFixed(1)}L`;
    }
    if (leaderboardType === 'fastest-graduates') {
      return `${entry.metric} days`;
    }
    if (leaderboardType === 'most-engaged') {
      return `${entry.metric.toFixed(1)}`;
    }
    return entry.metric.toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            {getLeaderboardIcon()}
            Top Performers Leaderboard
          </h3>
          <select
            value={leaderboardType}
            onChange={(e) => setLeaderboardType(e.target.value as LeaderboardType)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
          >
            <option value="highest-cgpa">Highest CGPA</option>
            <option value="most-improved">Most Improved</option>
            <option value="fastest-graduates">Fastest Graduates</option>
            <option value="best-placements">Best Job Placements</option>
            <option value="most-engaged">Most Engaged</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data available for {getLeaderboardTitle()}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.scholar.id}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1 ? 'bg-yellow-500 text-white' :
                  entry.rank === 2 ? 'bg-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-primary/10 text-primary'
                }`}>
                  {entry.rank === 1 ? <Trophy className="w-5 h-5" /> : entry.rank}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{entry.scholar.profile.name}</p>
                  <p className="text-sm text-muted-foreground">{entry.scholar.profile.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{formatMetric(entry)}</p>
                  <p className="text-xs text-muted-foreground">{entry.metricLabel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

