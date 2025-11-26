"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { Button } from '@/components/common/forms/Button';
import { MoreVertical, User, Calendar, X } from 'lucide-react';
import { Application } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

interface ApplicantCardProps {
  application: Application;
  onView: (id: string) => void;
  onMove?: (id: string, newStatus: Application['status']) => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

const matchScoreColors = {
  high: 'bg-green-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-red-500 text-white',
};

export function ApplicantCard({
  application,
  onView,
  onMove,
  isDragging = false,
  isSelected = false,
  onSelect,
}: ApplicantCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getMatchScoreColor = (score?: number) => {
    if (!score) return matchScoreColors.medium;
    if (score >= 80) return matchScoreColors.high;
    if (score >= 60) return matchScoreColors.medium;
    return matchScoreColors.low;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('applicationId', application.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = () => {
    onView(application.id);
  };

  return (
    <Card
      draggable={!!onMove}
      onDragStart={handleDragStart}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border border-border",
        "bg-background hover:bg-accent/50",
        isDragging && "opacity-50 scale-95",
        isSelected && "ring-2 ring-primary border-primary shadow-md"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect?.(application.id, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
          )}
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
            "bg-gradient-to-br from-primary to-purple-600",
            application.candidatePhoto && "ring-2 ring-background"
          )}>
            {application.candidatePhoto ? (
              <img
                src={application.candidatePhoto}
                alt={application.candidateName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {application.candidateName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground truncate mb-0.5">
                  {application.candidateName}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {application.jobTitle}
                </p>
              </div>
              {application.matchScore !== undefined && (
                <Badge
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 ml-2 flex-shrink-0",
                    getMatchScoreColor(application.matchScore)
                  )}
                >
                  {application.matchScore}%
                </Badge>
              )}
            </div>
            
            {/* Match Score Progress Bar */}
            {application.matchScore !== undefined && (
              <div className="mb-2">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      application.matchScore >= 80
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : application.matchScore >= 60
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                    )}
                    style={{ width: `${application.matchScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Applied Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>
                Applied {new Date(application.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Tags */}
            {application.tags && application.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {application.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded border border-border"
                  >
                    {tag}
                  </span>
                ))}
                {application.tags.length > 2 && (
                  <span className="text-xs px-1.5 py-0.5 text-muted-foreground">
                    +{application.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

