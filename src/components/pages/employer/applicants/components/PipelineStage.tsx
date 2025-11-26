"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Badge } from '@/components/common/ui/Badge';
import { Application } from '@/store/features/employer/employerSlice';
import { ApplicantCard } from './ApplicantCard';
import { cn } from '@/utils';

export type PipelineStageType = Application['status'];

interface PipelineStageProps {
  stage: {
    id: PipelineStageType;
    name: string;
    color: string;
  };
  applications: Application[];
  onViewApplication: (id: string) => void;
  onMoveApplication?: (id: string, newStatus: PipelineStageType) => void;
  selectedApplications?: Set<string>;
  onSelectApplication?: (id: string, selected: boolean) => void;
}

export function PipelineStage({
  stage,
  applications,
  onViewApplication,
  onMoveApplication,
  selectedApplications,
  onSelectApplication,
}: PipelineStageProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const applicationId = e.dataTransfer.getData('applicationId');
    if (applicationId && onMoveApplication) {
      onMoveApplication(applicationId, stage.id);
    }
  };

  const stageColors: Record<string, { bg: string; border: string; text: string }> = {
    new: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600 dark:text-blue-400' },
    reviewed: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600 dark:text-purple-400' },
    shortlisted: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-600 dark:text-green-400' },
    interviewed: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-600 dark:text-yellow-400' },
    offered: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400' },
    hired: { bg: 'bg-green-600/10', border: 'border-green-600/30', text: 'text-green-700 dark:text-green-500' },
    rejected: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600 dark:text-red-400' },
  };

  const stageColor = stageColors[stage.id] || stageColors.new;

  return (
    <div
      className="flex-1 min-w-[300px] max-w-[320px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card
        className={cn(
          "h-full border-2 transition-all shadow-sm hover:shadow-md",
          stageColor.border,
          isDraggingOver && "ring-2 ring-primary border-primary shadow-lg scale-[1.02]"
        )}
      >
        <CardHeader className={cn("pb-3 border-b", stageColor.border)}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", stage.color)} />
              <span className={cn("font-semibold text-base", stageColor.text)}>
                {stage.name}
              </span>
            </div>
            <Badge 
              variant="default" 
              className={cn(
                "ml-2 font-semibold min-w-[28px] justify-center",
                stageColor.bg,
                stageColor.text,
                "border-0"
              )}
            >
              {applications.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-3 p-4 max-h-[calc(100vh-380px)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent", stageColor.bg)}>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <div className={cn(
                "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center transition-all hover:scale-110",
                stageColor.bg,
                stageColor.border,
                "border-2 border-dashed"
              )}>
                <span className={cn("text-2xl font-light", stageColor.text)}>+</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">No applicants</p>
              <p className="text-xs text-muted-foreground">Drag applicants here to move them</p>
            </div>
          ) : (
            <>
              {applications.map((application) => (
                <ApplicantCard
                  key={application.id}
                  application={application}
                  onView={onViewApplication}
                  onMove={onMoveApplication}
                  isSelected={selectedApplications?.has(application.id)}
                  onSelect={onSelectApplication}
                />
              ))}
              {/* Drop zone indicator at bottom */}
              <div className={cn(
                "h-2 rounded-lg border-2 border-dashed transition-all pointer-events-none",
                stageColor.border,
                "opacity-0"
              )} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

