"use client";

import { useState } from 'react';
import { Layout } from '@/components/common/layout/Layout';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { ConversationList } from './components/ConversationList';
import { ConversationView } from './components/ConversationView';
import { AnnouncementCreator } from './components/AnnouncementCreator';
import { TemplateLibrary } from './components/TemplateLibrary';
import { MessageSquare, Bell, FileText, Activity, Plus } from 'lucide-react';

type Tab = 'messages' | 'announcements' | 'templates' | 'activity';

export function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('messages');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const tabs = [
    { id: 'messages' as Tab, label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'announcements' as Tab, label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
    { id: 'templates' as Tab, label: 'Templates', icon: <FileText className="w-4 h-4" /> },
    { id: 'activity' as Tab, label: 'Activity', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <Layout title="Communications" role="provider" noCard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Communications</h1>
            <p className="text-muted-foreground mt-1">
              Communicate with scholars and mentors, send announcements, and manage templates
            </p>
          </div>
          {activeTab === 'announcements' && (
            <Button onClick={() => setShowAnnouncementModal(true)} className="bg-gradient-to-r from-primary to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ConversationList
                  onSelectConversation={setSelectedConversation}
                  selectedConversation={selectedConversation}
                />
              </div>
              <div className="lg:col-span-2">
                {selectedConversation ? (
                  <ConversationView conversationId={selectedConversation} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Select a conversation to view messages</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
          {activeTab === 'announcements' && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Announcements</h3>
                <p className="text-muted-foreground mb-4">Create and manage announcements for scholars</p>
                <Button onClick={() => setShowAnnouncementModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </CardContent>
            </Card>
          )}
          {activeTab === 'templates' && <TemplateLibrary />}
          {activeTab === 'activity' && (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Communication Activity</h3>
                <p className="text-muted-foreground">View communication activity and engagement metrics</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <AnnouncementCreator onClose={() => setShowAnnouncementModal(false)} />
        )}
      </div>
    </Layout>
  );
}

