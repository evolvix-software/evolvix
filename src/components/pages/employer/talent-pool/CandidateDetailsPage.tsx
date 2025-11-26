"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Briefcase, 
  GraduationCap,
  FileText,
  MessageSquare,
  Tag,
  Star,
  Calendar,
  Plus,
  X,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  headline: string;
  location: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  resumes: Array<{
    id: string;
    name: string;
    uploadedAt: string;
    url: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    author: string;
    createdAt: string;
    tags: string[];
  }>;
  activity: Array<{
    id: string;
    type: 'added' | 'contacted' | 'note_added' | 'tagged' | 'matched';
    description: string;
    date: string;
  }>;
  matchedJobs: Array<{
    jobId: string;
    jobTitle: string;
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
  }>;
  interestLevel: 'high' | 'medium' | 'low';
  tags: string[];
  addedAt: string;
  lastContactAt?: string;
}

const mockCandidate: Candidate = {
  id: 'c1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  headline: 'Senior Software Engineer',
  location: 'San Francisco, CA',
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      description: 'Led development of web applications using React and Node.js',
    },
    {
      company: 'Startup Inc',
      position: 'Software Engineer',
      startDate: '2018-06',
      endDate: '2019-12',
      description: 'Developed full-stack applications',
    },
  ],
  education: [
    {
      school: 'University of California',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: '2018',
    },
  ],
  resumes: [
    {
      id: 'r1',
      name: 'John_Doe_Resume.pdf',
      uploadedAt: '2024-01-15',
      url: '#',
    },
  ],
  notes: [
    {
      id: 'n1',
      content: 'Great candidate, strong React skills. Follow up next week.',
      author: 'Jane Recruiter',
      createdAt: '2024-01-20',
      tags: ['Follow Up'],
    },
  ],
  activity: [
    {
      id: 'a1',
      type: 'added',
      description: 'Added to talent pool',
      date: '2024-01-15',
    },
    {
      id: 'a2',
      type: 'contacted',
      description: 'Sent message about Frontend Developer position',
      date: '2024-01-18',
    },
    {
      id: 'a3',
      type: 'note_added',
      description: 'Note added by Jane Recruiter',
      date: '2024-01-20',
    },
  ],
  matchedJobs: [
    {
      jobId: 'job-1',
      jobTitle: 'Frontend Developer',
      matchScore: 92,
      matchingSkills: ['React', 'TypeScript'],
      missingSkills: ['Vue.js'],
    },
    {
      jobId: 'job-2',
      jobTitle: 'Full Stack Developer',
      matchScore: 88,
      matchingSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      missingSkills: ['MongoDB'],
    },
  ],
  interestLevel: 'high',
  tags: ['Frontend', 'Full Stack'],
  addedAt: '2024-01-15',
  lastContactAt: '2024-03-10',
};

export function CandidateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTags, setNewTags] = useState<string[]>([]);

  useEffect(() => {
    // Load candidate data (in real app, fetch from API)
    setCandidate(mockCandidate);
  }, [candidateId]);

  if (!candidate) {
    return (
      <Layout noCard title="Candidate Details" role="employer">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading candidate details...</div>
        </div>
      </Layout>
    );
  }

  const getInterestColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4" />;
      case 'contacted':
        return <MessageSquare className="w-4 h-4" />;
      case 'note_added':
        return <FileText className="w-4 h-4" />;
      case 'tagged':
        return <Tag className="w-4 h-4" />;
      case 'matched':
        return <Star className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Layout noCard title="Candidate Details" role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Talent Pool
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
              <p className="text-muted-foreground mt-1">{candidate.headline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button className="bg-gradient-to-r from-primary to-purple-600">
              <Star className="w-4 h-4 mr-2" />
              Match to Jobs
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{candidate.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getInterestColor(candidate.interestLevel)}>
                        {candidate.interestLevel} Interest
                      </Badge>
                      {candidate.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                    <h3 className="font-semibold text-foreground">{exp.position}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-foreground mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                    <p className="text-muted-foreground">{edu.school}</p>
                    <p className="text-sm text-muted-foreground">Graduated {edu.graduationDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resumes */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resumes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {candidate.resumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{resume.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {format(new Date(resume.uploadedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Notes
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddNote(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddNote && (
                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note about this candidate..."
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {newTags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer">
                            {tag}
                            <X className="w-3 h-3 ml-1" onClick={() => setNewTags(newTags.filter((_, i) => i !== index))} />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setShowAddNote(false);
                          setNewNote('');
                          setNewTags([]);
                        }}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => {
                          // Add note logic
                          setShowAddNote(false);
                          setNewNote('');
                          setNewTags([]);
                        }}>
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {candidate.notes.map((note) => (
                  <div key={note.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">{note.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(note.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <p className="text-foreground mb-2">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.activity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(activity.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Matches */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Job Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {candidate.matchedJobs.map((match) => (
                  <div key={match.jobId} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{match.jobTitle}</h3>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Matching Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchingSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-500/10">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      {match.missingSkills.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Missing Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {match.missingSkills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-gray-500/10">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Job
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                  <Tag className="w-4 h-4 mr-2" />
                  Assign Tags
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Match to Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Remove from Pool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

