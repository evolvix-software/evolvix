/**
 * Mentor Hackathons Management Page
 * Help students with practice problems and send external hackathon links
 * Available only for Full Career Bootcamp mentors
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Plus,
  Search,
  Send,
  Link as LinkIcon,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/Card';
import { Button } from '@/components/common/ui/Button';
import { Badge } from '@/components/common/ui/Badge';
import { Modal } from '@/components/common/ui/Modal';
import { useAppSelector } from '@/hooks';
import { ExternalLink as ExternalLinkType } from '@/interfaces/mentor';

export function MentorHackathonsManagementPage() {
  const { courses } = useAppSelector(state => state.courses);
  const [mentorId, setMentorId] = useState<string>('');
  const [links, setLinks] = useState<ExternalLinkType[]>([]);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [newLink, setNewLink] = useState<{
    title: string;
    url: string;
    type: 'practice-problem';
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    platform: 'leetcode' | 'hackerrank' | 'codeforces' | 'other';
    tags: string[];
  }>({
    title: '',
    url: '',
    type: 'practice-problem',
    category: '',
    difficulty: 'beginner',
    platform: 'leetcode',
    tags: [],
  });

  // Get mentor ID from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMentorId(parsedData.email || '');
    }
  }, []);

  // Check if mentor has bootcamp courses
  const hasBootcampAccess = courses.some(
    course => course.instructor.id === mentorId && course.courseCategory === 'bootcamp'
  );

  useEffect(() => {
    // Mock data - replace with API call
    const mockLinks: ExternalLinkType[] = [
      {
        id: '1',
        title: 'LeetCode - Two Sum',
        url: 'https://leetcode.com/problems/two-sum',
        type: 'practice-problem',
        category: 'arrays',
        difficulty: 'beginner',
        platform: 'leetcode',
        tags: ['arrays', 'hash-table'],
        createdAt: new Date().toISOString(),
        sentToStudents: [],
      },
    ];
    setLinks(mockLinks);
  }, []);

  if (!hasBootcampAccess) {
    return (
      <div className="p-8 text-center">
        <ExternalLink className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Hackathons Management Unavailable
        </h2>
        <p className="text-gray-600 mb-4">
          This feature is only available for Full Career Bootcamp mentors.
        </p>
        <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLink = () => {
    // Add link logic
    const link: ExternalLinkType = {
      id: Date.now().toString(),
      ...newLink,
      createdAt: new Date().toISOString(),
      sentToStudents: [],
    };
    setLinks([...links, link]);
    setShowAddLinkModal(false);
    setNewLink({
      title: '',
      url: '',
      type: 'practice-problem',
      category: '',
      difficulty: 'beginner',
      platform: 'leetcode',
      tags: [],
    });
  };

  const handleSendToStudents = (linkId: string) => {
    // Send link to selected students
    console.log('Sending link to students:', linkId, selectedStudents);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hackathons Management
          </h1>
          <p className="text-gray-600 mt-1">
            Find and send external hackathon links to help students practice
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddLinkModal(true)}
        >
          Add Link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{links.length}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent to Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {links.reduce((sum, link) => sum + link.sentToStudents.length, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI-Assisted</p>
                <p className="text-2xl font-bold text-purple-600">
                  {links.filter(l => l.tags.length > 0).length}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card variant="outlined">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI-Assisted Link Finder */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Assisted Link Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Use AI to find relevant practice problems based on student progress and course
              modules
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter topic or skill..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                Find Links
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Library */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Link Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map(link => (
            <Card key={link.id} variant="elevated" hover>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{link.title}</CardTitle>
                  <Badge
                    variant={
                      link.difficulty === 'beginner'
                        ? 'success'
                        : link.difficulty === 'intermediate'
                        ? 'warning'
                        : 'error'
                    }
                    size="sm"
                  >
                    {link.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="sm">
                      {link.category}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {link.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Sent to {link.sentToStudents.length} students</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => window.open(link.url, '_blank')}
                      leftIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      View Link
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleSendToStudents(link.id)}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Send to Students
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Link Modal */}
      <Modal
        isOpen={showAddLinkModal}
        onClose={() => setShowAddLinkModal(false)}
        title="Add External Link"
        description="Add a new practice problem or hackathon link"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={newLink.title}
              onChange={e => setNewLink({ ...newLink, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., LeetCode - Two Sum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={newLink.url}
              onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={newLink.category}
                onChange={e => setNewLink({ ...newLink, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., arrays"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={newLink.difficulty}
                onChange={e =>
                  setNewLink({
                    ...newLink,
                    difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced',
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddLinkModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddLink}>
              Add Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


