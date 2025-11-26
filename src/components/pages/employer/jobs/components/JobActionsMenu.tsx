"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/common/forms/Button';
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  X,
  Users,
  BarChart3,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Job } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';

interface JobActionsMenuProps {
  job: Job;
  onViewDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onPause: () => void;
  onResume: () => void;
  onClose: () => void;
  onViewApplicants: () => void;
  onViewAnalytics: () => void;
  onDelete: () => void;
  className?: string;
}

export function JobActionsMenu({
  job,
  onViewDetails,
  onEdit,
  onDuplicate,
  onPause,
  onResume,
  onClose,
  onViewApplicants,
  onViewAnalytics,
  onDelete,
  className,
}: JobActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-border bg-background shadow-lg">
          <div className="p-1">
            <button
              onClick={() => handleAction(onViewDetails)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => handleAction(onEdit)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Job
            </button>
            <button
              onClick={() => handleAction(onDuplicate)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Copy className="w-4 h-4" />
              Duplicate Job
            </button>
            <div className="h-px bg-border my-1" />
            {job.status === 'active' && (
              <button
                onClick={() => handleAction(onPause)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause Job
              </button>
            )}
            {job.status === 'paused' && (
              <button
                onClick={() => handleAction(onResume)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume Job
              </button>
            )}
            {job.status === 'active' && (
              <button
                onClick={() => handleAction(onClose)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
                Close Job
              </button>
            )}
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => handleAction(onViewApplicants)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Users className="w-4 h-4" />
              View Applicants ({job.applications})
            </button>
            <button
              onClick={() => handleAction(onViewAnalytics)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </button>
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

