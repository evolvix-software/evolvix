"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  addApplicationNote,
  addApplicationActivity,
  assignRecruiter,
  addApplicationTags,
  updateApplication,
} from '@/store/features/employer/employerSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import {
  X,
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  FileText,
  MessageSquare,
  Tag as TagIcon,
  Download,
  UserPlus,
  MoreVertical,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Application } from '@/store/features/employer/employerSlice';
import { PipelineStageType } from './PipelineStage';
import { cn } from '@/utils';
import { format } from 'date-fns';

interface ApplicantDetailsPanelProps {
  application: Application | null;
  onClose: () => void;
  onMoveToStage?: (stage: PipelineStageType) => void;
}

export function ApplicantDetailsPanel({
  application,
  onClose,
  onMoveToStage,
}: ApplicantDetailsPanelProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pipelineStages } = useAppSelector((state) => state.employer);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'notes' | 'activity'>('overview');
  const [noteContent, setNoteContent] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [showMoveStage, setShowMoveStage] = useState(false);

  if (!application) return null;

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const note = {
      id: `note-${Date.now()}`,
      content: noteContent,
      author: 'Current User', // TODO: Get from auth
      createdAt: new Date().toISOString(),
      isPrivate: isPrivateNote,
    };

    dispatch(addApplicationNote({ applicationId: application.id, note }));
    dispatch(addApplicationActivity({
      applicationId: application.id,
      activity: {
        id: `activity-${Date.now()}`,
        type: 'note_added',
        description: 'Note added',
        actor: 'Current User',
        timestamp: new Date().toISOString(),
      },
    }));

    setNoteContent('');
    setIsPrivateNote(false);
  };

  const handleMoveToStage = (stage: PipelineStageType) => {
    if (onMoveToStage) {
      onMoveToStage(stage);
    }
    dispatch(updateApplication({
      ...application,
      status: stage,
    }));
    dispatch(addApplicationActivity({
      applicationId: application.id,
      activity: {
        id: `activity-${Date.now()}`,
        type: 'status_change',
        description: `Moved to ${stage}`,
        actor: 'Current User',
        timestamp: new Date().toISOString(),
      },
    }));
    setShowMoveStage(false);
  };

  const handleSendMessage = () => {
    router.push(`/portal/employer/messaging?candidate=${application.candidateId}`);
  };

  const handleDownloadResume = () => {
    if (application.resumeUrl) {
      window.open(application.resumeUrl, '_blank');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-background border-l border-border shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{application.candidateName}</h2>
            <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'resume', label: 'Resume' },
          { id: 'notes', label: 'Notes' },
          { id: 'activity', label: 'Activity' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Match Score */}
            {application.matchScore !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Match Score</span>
                    <Badge
                      variant={application.matchScore >= 80 ? 'success' : application.matchScore >= 60 ? 'warning' : 'error'}
                      className="text-sm font-semibold"
                    >
                      {application.matchScore}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        application.matchScore >= 80 ? "bg-green-500" : application.matchScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${application.matchScore}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{application.candidateEmail}</span>
                </div>
                {application.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{application.location}</span>
                  </div>
                )}
                {application.experience && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{application.experience}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    Applied {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {application.skills && application.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {application.tags && application.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {application.tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assigned Recruiter */}
            {application.assignedRecruiter && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      Assigned to: <span className="font-medium">{application.assignedRecruiter}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === 'resume' && (
          <Card>
            <CardContent className="p-4">
              {application.resumeUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">Resume</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <iframe
                    src={application.resumeUrl}
                    className="w-full h-[600px] border border-border rounded-lg"
                    title="Resume"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No resume available</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Add Note Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Write a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleAddNote();
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isPrivateNote}
                      onChange={(e) => setIsPrivateNote(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Private note
                  </label>
                  <Button size="sm" onClick={handleAddNote} disabled={!noteContent.trim()}>
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes List */}
            <div className="space-y-3">
              {application.notes && application.notes.length > 0 ? (
                application.notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-foreground">{note.author}</span>
                            {note.isPrivate && (
                              <Badge variant="default" className="text-xs">Private</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No notes yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-3">
            {application.activities && application.activities.length > 0 ? (
              application.activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {activity.type === 'status_change' && <CheckCircle className="w-4 h-4 text-primary" />}
                        {activity.type === 'note_added' && <FileText className="w-4 h-4 text-primary" />}
                        {activity.type === 'message_sent' && <MessageSquare className="w-4 h-4 text-primary" />}
                        {activity.type === 'resume_viewed' && <FileText className="w-4 h-4 text-primary" />}
                        {activity.type === 'interview_scheduled' && <Calendar className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.actor}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {showMoveStage ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {pipelineStages.map((stage) => (
                <Button
                  key={stage.id}
                  variant={application.status === stage.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleMoveToStage(stage.id as PipelineStageType)}
                  disabled={application.status === stage.id}
                >
                  {stage.name}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoveStage(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoveStage(true)}
              className="flex-1"
            >
              Move to Stage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessage}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            {application.resumeUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

