"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Calendar, FileText, MessageSquare, Plus, Bell, FileDown, CalendarIcon, Phone } from 'lucide-react';
import { Input } from '@/components/common/forms/Input';
import { X } from 'lucide-react';

interface QuickActionsProps {
  isVerified: boolean;
}

export function QuickActions({ isVerified }: QuickActionsProps) {
  const router = useRouter();
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showSendAnnouncement, setShowSendAnnouncement] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', message: '' });

  const handleCreateAssignment = () => {
    // TODO: Implement assignment creation
    console.log('Creating assignment:', assignmentForm);
    setShowCreateAssignment(false);
    setAssignmentForm({ title: '', description: '', dueDate: '' });
    router.push('/portal/mentor/assignments');
  };

  const handleSendAnnouncement = () => {
    // TODO: Implement announcement sending
    console.log('Sending announcement:', announcementForm);
    setShowSendAnnouncement(false);
    setAnnouncementForm({ title: '', message: '' });
    alert('Announcement sent to all students!');
  };

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    alert('Generating analytics report... This will download shortly.');
  };

  const handleEmergencyContact = () => {
    window.open('mailto:support@evolvix.com?subject=Emergency Support Request', '_blank');
  };

  return (
    <>
      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Create Assignment</h3>
              <button
                onClick={() => setShowCreateAssignment(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Quickly create a new assignment for your students</p>
            <div className="space-y-4">
              <Input
                placeholder="Assignment Title"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Input
                type="date"
                placeholder="Due Date"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateAssignment(false)}>Cancel</Button>
                <Button onClick={handleCreateAssignment}>Create</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Announcement Modal */}
      {showSendAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Send Announcement</h3>
              <button
                onClick={() => setShowSendAnnouncement(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Send an announcement to all your students</p>
            <div className="space-y-4">
              <Input
                placeholder="Announcement Title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              />
              <textarea
                placeholder="Message"
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSendAnnouncement(false)}>Cancel</Button>
                <Button onClick={handleSendAnnouncement}>Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-muted-foreground">Common mentoring tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
        <Button
          onClick={() => router.push('/portal/mentor/classes')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Class
        </Button>

        <Button
          onClick={() => setShowCreateAssignment(true)}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>

        <Button
          onClick={() => setShowSendAnnouncement(true)}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <Bell className="w-4 h-4 mr-2" />
          Send Announcement
        </Button>

        <Button
          onClick={handleGenerateReport}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Generate Report
        </Button>

        <Button
          onClick={() => router.push('/portal/mentor/calendar')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          View Calendar
        </Button>

        <Button
          onClick={() => router.push('/portal/mentor/assignments')}
          variant="outline"
          className="w-full justify-start border-border hover:bg-muted"
        >
          <FileText className="w-4 h-4 mr-2" />
          Review Assignments
        </Button>

        <Button
          onClick={handleEmergencyContact}
          variant="outline"
          className="w-full justify-start border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
        >
          <Phone className="w-4 h-4 mr-2" />
          Emergency Contact
        </Button>
      </CardContent>
    </Card>
    </>
  );
}

