"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { Course } from '@/data/mock/coursesData';
import { Megaphone, MessageSquare, HelpCircle, FileText, History, Plus, Trash2, Edit, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CourseCommunicationProps {
  course: Course;
}

export function CourseCommunication({ course }: CourseCommunicationProps) {
  const [announcements, setAnnouncements] = useState<Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    pinned: boolean;
  }>>([
    {
      id: '1',
      title: 'Welcome to the Course!',
      content: 'Welcome everyone! This course will cover...',
      date: new Date().toISOString(),
      pinned: true,
    },
  ]);

  const [forums, setForums] = useState<Array<{
    id: string;
    topic: string;
    author: string;
    replies: number;
    lastActivity: string;
  }>>([
    {
      id: '1',
      topic: 'Introduction and Course Overview',
      author: 'Mentor',
      replies: 5,
      lastActivity: new Date().toISOString(),
    },
  ]);

  const [faqs, setFaqs] = useState<Array<{
    id: string;
    question: string;
    answer: string;
  }>>([
    {
      id: '1',
      question: 'How long does the course take?',
      answer: 'The course typically takes 10-12 weeks to complete.',
    },
  ]);

  const [resources, setResources] = useState<Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }>>([
    {
      id: '1',
      name: 'Course Syllabus.pdf',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: new Date().toISOString(),
    },
  ]);

  const [updates, setUpdates] = useState<Array<{
    id: string;
    version: string;
    date: string;
    changes: string[];
  }>>([
    {
      id: '1',
      version: '1.0.0',
      date: new Date().toISOString(),
      changes: ['Initial course release', 'Added Module 1 content'],
    },
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [newResource, setNewResource] = useState<File | null>(null);
  const [newUpdate, setNewUpdate] = useState({ version: '', changes: '' });

  const addAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      setAnnouncements([
        {
          id: `announcement_${Date.now()}`,
          ...newAnnouncement,
          date: new Date().toISOString(),
          pinned: false,
        },
        ...announcements,
      ]);
      setNewAnnouncement({ title: '', content: '' });
    }
  };

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setFaqs([
        ...faqs,
        {
          id: `faq_${Date.now()}`,
          ...newFAQ,
        },
      ]);
      setNewFAQ({ question: '', answer: '' });
    }
  };

  const addUpdate = () => {
    if (newUpdate.version && newUpdate.changes) {
      setUpdates([
        {
          id: `update_${Date.now()}`,
          version: newUpdate.version,
          date: new Date().toISOString(),
          changes: newUpdate.changes.split('\n').filter(c => c.trim()),
        },
        ...updates,
      ]);
      setNewUpdate({ version: '', changes: '' });
    }
  };

  return (
    <Tabs defaultValue="announcements" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="announcements">
          <Megaphone className="w-4 h-4 mr-2" />
          Announcements
        </TabsTrigger>
        <TabsTrigger value="forums">
          <MessageSquare className="w-4 h-4 mr-2" />
          Forums
        </TabsTrigger>
        <TabsTrigger value="faq">
          <HelpCircle className="w-4 h-4 mr-2" />
          FAQ
        </TabsTrigger>
        <TabsTrigger value="resources">
          <FileText className="w-4 h-4 mr-2" />
          Resources
        </TabsTrigger>
        <TabsTrigger value="updates">
          <History className="w-4 h-4 mr-2" />
          Updates
        </TabsTrigger>
      </TabsList>

      {/* Announcements Tab */}
      <TabsContent value="announcements" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Announcements</span>
              </span>
            </CardTitle>
            <CardDescription>Broadcast messages to enrolled students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div>
                <Label htmlFor="announcementTitle">Title</Label>
                <Input
                  id="announcementTitle"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="mt-1"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <Label htmlFor="announcementContent">Content</Label>
                <textarea
                  id="announcementContent"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  rows={4}
                  placeholder="Announcement content..."
                />
              </div>
              <Button onClick={addAnnouncement} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Post Announcement
              </Button>
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground flex items-center space-x-2">
                        {announcement.pinned && <span className="text-yellow-500">📌</span>}
                        <span>{announcement.title}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(announcement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground">{announcement.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Forums Tab */}
      <TabsContent value="forums" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Course Forums</span>
            </CardTitle>
            <CardDescription>Discussion boards for students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forums.map((forum) => (
                <div key={forum.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{forum.topic}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {forum.author} • {forum.replies} replies • Last activity {new Date(forum.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create New Forum Topic
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* FAQ Tab */}
      <TabsContent value="faq" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>FAQ Management</span>
            </CardTitle>
            <CardDescription>Common questions and answers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div>
                <Label htmlFor="faqQuestion">Question</Label>
                <Input
                  id="faqQuestion"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  className="mt-1"
                  placeholder="Common question..."
                />
              </div>
              <div>
                <Label htmlFor="faqAnswer">Answer</Label>
                <textarea
                  id="faqAnswer"
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  rows={3}
                  placeholder="Answer..."
                />
              </div>
              <Button onClick={addFAQ} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Resources Tab */}
      <TabsContent value="resources" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span>Resource Library</span>
            </CardTitle>
            <CardDescription>Downloadable materials for students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <Label htmlFor="resourceFile">Upload Resource</Label>
              <Input
                id="resourceFile"
                type="file"
                onChange={(e) => setNewResource(e.target.files?.[0] || null)}
                className="mt-1"
              />
              <Button className="mt-3 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Upload Resource
              </Button>
            </div>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium text-foreground">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.type} • {resource.size} • {new Date(resource.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Updates Tab */}
      <TabsContent value="updates" className="space-y-4">
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span>Course Updates</span>
            </CardTitle>
            <CardDescription>Changelog and version history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div>
                <Label htmlFor="updateVersion">Version</Label>
                <Input
                  id="updateVersion"
                  value={newUpdate.version}
                  onChange={(e) => setNewUpdate({ ...newUpdate, version: e.target.value })}
                  className="mt-1"
                  placeholder="e.g., 1.1.0"
                />
              </div>
              <div>
                <Label htmlFor="updateChanges">Changes (one per line)</Label>
                <textarea
                  id="updateChanges"
                  value={newUpdate.changes}
                  onChange={(e) => setNewUpdate({ ...newUpdate, changes: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  rows={4}
                  placeholder="Added new module&#10;Fixed bug in quiz&#10;Updated resources"
                />
              </div>
              <Button onClick={addUpdate} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Update
              </Button>
            </div>
            <div className="space-y-3">
              {updates.map((update) => (
                <div key={update.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">Version {update.version}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                    {update.changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

