"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateApplication } from '@/store/features/employer/employerSlice';
import { loadEmployerData } from '@/store/features/employer/employerThunks';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Badge } from '@/components/common/ui/Badge';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Download,
  MessageSquare,
  Plus,
  X,
  Edit,
  Check,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Send
} from 'lucide-react';
import { Application } from '@/store/features/employer/employerSlice';
import { cn } from '@/utils';
import { format } from 'date-fns';

const statusColors = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  reviewed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  shortlisted: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  interviewed: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  offered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  hired: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isPrivate: boolean;
}

interface Activity {
  id: string;
  type: 'status_change' | 'note_added' | 'message_sent' | 'interview_scheduled' | 'offer_sent' | 'resume_viewed';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export function ApplicantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id as string;
  const dispatch = useAppDispatch();
  const { applications, jobs } = useAppSelector((state) => state.employer);

  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'notes' | 'activity'>('overview');
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Application['status'] | ''>('');

  // Load employer data if not already loaded
  useEffect(() => {
    if (applications.length === 0 && jobs.length === 0) {
      console.log('[ApplicantDetailsPage] Data not loaded, loading employer data...');
      dispatch(loadEmployerData());
    } else {
      console.log('[ApplicantDetailsPage] Data loaded:', {
        applicationsCount: applications.length,
        jobsCount: jobs.length,
        applicationId,
      });
    }
  }, [dispatch, applications.length, jobs.length, applicationId]);

  // Reserved route segments that should not be treated as application IDs
  const reservedRoutes = ['pipeline', 'all', 'new'];
  
  // Check if this is a valid application ID or a reserved route
  const isValidApplicationId = applicationId && !reservedRoutes.includes(applicationId.toLowerCase());
  const isReservedRoute = applicationId && reservedRoutes.includes(applicationId.toLowerCase());
  
  const application = isValidApplicationId ? applications.find(app => app.id === applicationId) : null;
  const job = jobs.find(j => j.id === application?.jobId || j.title === application?.jobTitle);

  useEffect(() => {
    // Redirect if it's a reserved route
    if (isReservedRoute) {
      console.log('[ApplicantDetailsPage] Reserved route detected, redirecting:', applicationId);
      if (applicationId.toLowerCase() === 'pipeline') {
        // Try to find a job ID, or use the first job, or redirect to jobs page
        const firstJob = jobs.length > 0 ? jobs[0] : null;
        if (firstJob) {
          router.replace(`/portal/employer/jobs/${firstJob.id}/applicants`);
        } else {
          router.replace('/portal/employer/jobs/manage');
        }
      } else {
        router.replace('/portal/employer/applicants');
      }
      return;
    }
    
    // Warn if application not found (only if we have data loaded and it's a valid ID format)
    if (!application && applications.length > 0 && isValidApplicationId) {
      console.warn('[ApplicantDetailsPage] Application not found:', {
        applicationId,
        availableApplicationIds: applications.map(app => app.id),
      });
    }
  }, [application, applicationId, applications, isValidApplicationId, isReservedRoute, router, jobs]);

  useEffect(() => {
    if (application) {
      setSelectedStatus(application.status);
      // Use actual notes and activities from application
      if (application.notes) {
        setNotes(application.notes.map(note => ({
          id: note.id,
          content: note.content,
          author: note.author,
          createdAt: note.createdAt,
          isPrivate: note.isPrivate,
        })));
      }
      if (application.activities) {
        setActivities(application.activities.map(activity => ({
          id: activity.id,
          type: activity.type,
          title: activity.description,
          description: activity.description,
          timestamp: activity.timestamp,
          user: activity.actor,
        })));
      }
    }
  }, [application]);

  const handleStatusChange = (newStatus: Application['status']) => {
    if (application) {
      dispatch(updateApplication({
        ...application,
        status: newStatus,
      }));
      setSelectedStatus(newStatus);
      
      // Add activity
      setActivities([
        {
          id: Date.now().toString(),
          type: 'status_change',
          title: `Status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
          description: `Application moved to ${newStatus} stage`,
          timestamp: new Date().toISOString(),
          user: 'You',
        },
        ...activities,
      ]);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        author: 'You',
        createdAt: new Date().toISOString(),
        isPrivate: isPrivateNote,
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setIsPrivateNote(false);

      // Add activity
      setActivities([
        {
          id: Date.now().toString(),
          type: 'note_added',
          title: 'Note added',
          description: newNote,
          timestamp: new Date().toISOString(),
          user: 'You',
        },
        ...activities,
      ]);
    }
  };

  // Show loading state while checking if it's a reserved route
  if (applicationId && reservedRoutes.includes(applicationId.toLowerCase())) {
    return (
      <Layout noCard title="Redirecting..." role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout noCard title="Applicant Details" role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Applicant not found</p>
            {applicationId && (
              <p className="text-sm text-muted-foreground mb-4">
                Application ID: <code className="bg-muted px-2 py-1 rounded">{applicationId}</code>
              </p>
            )}
            <Button
              variant="default"
              onClick={() => router.back()}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout noCard title="Applicant Details" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{application.candidateName}</h1>
              <p className="text-muted-foreground mt-1">{application.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value as Application['status'])}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            {application.resumeUrl && (
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-4">
            {(['overview', 'resume', 'notes', 'activity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Overview */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Profile Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {application.candidateName}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {application.candidateEmail}
                          </div>
                          {application.matchScore !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Match Score:</span>
                              <Badge
                                className={cn(
                                  application.matchScore >= 80
                                    ? "bg-green-500 text-white"
                                    : application.matchScore >= 60
                                      ? "bg-yellow-500 text-white"
                                      : "bg-red-500 text-white"
                                )}
                              >
                                {application.matchScore}%
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                        <p className="text-foreground mt-1">
                          {format(new Date(application.appliedAt), 'PPP')}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="mt-1">
                          <Badge
                            variant="default"
                            className={cn('border', statusColors[application.status])}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                        <p className="text-foreground mt-1">{application.jobTitle}</p>
                      </div>
                      {application.matchScore !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Match Score</label>
                          <div className="mt-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className={cn(
                                    "h-2 rounded-full",
                                    application.matchScore >= 80
                                      ? "bg-green-500"
                                      : application.matchScore >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  )}
                                  style={{ width: `${application.matchScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{application.matchScore}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'resume' && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.resumeUrl ? (
                    <div className="space-y-4">
                      <iframe
                        src={application.resumeUrl}
                        className="w-full h-[600px] border border-border rounded-lg"
                        title="Resume"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </Button>
                      </div>
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
              <div className="space-y-6">
                {/* Add Note */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Add Note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this applicant..."
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPrivateNote}
                          onChange={(e) => setIsPrivateNote(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-muted-foreground">Private note</span>
                      </label>
                      <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes List */}
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{note.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(note.createdAt), 'PPP p')}
                            </p>
                          </div>
                          {note.isPrivate && (
                            <Badge variant="default" className="text-xs border border-border">Private</Badge>
                          )}
                        </div>
                        <p className="text-foreground">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {index < activities.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{activity.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {activity.description}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          {activity.user && (
                            <p className="text-xs text-muted-foreground mt-1">
                              by {activity.user}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Documents
                </Button>
                {application.resumeUrl && (
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Status History */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activities
                    .filter(a => a.type === 'status_change')
                    .map((activity) => (
                      <div key={activity.id} className="text-sm">
                        <p className="text-foreground">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), 'MMM d, yyyy')}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

