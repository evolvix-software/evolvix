"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { CourseApplication, CourseVacancy } from '@/data/mock/coursesData';
import { mockApplications, mockVacancies } from '@/data/mock/vacanciesData';
import { Search, CheckCircle2, XCircle, Clock, FileText, Video, User, Mail, Calendar, AlertCircle, Eye, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CourseApplication[]>(mockApplications);
  const [vacancies] = useState<CourseVacancy[]>(mockVacancies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<CourseApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.mentorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVacancy = (vacancyId: string) => {
    return vacancies.find(v => v.id === vacancyId);
  };

  const handleReview = (application: CourseApplication) => {
    setSelectedApplication(application);
    setAdminNotes(application.adminNotes || '');
    setShowDetailsModal(true);
  };

  const handleStatusChange = (status: 'accepted' | 'rejected' | 'verified') => {
    if (!selectedApplication) return;

    const updatedApplication: CourseApplication = {
      ...selectedApplication,
      status,
      adminNotes: adminNotes || undefined,
      reviewedAt: new Date().toISOString(),
      verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
    };

    setApplications(applications.map(app => 
      app.id === selectedApplication.id ? updatedApplication : app
    ));

    setShowDetailsModal(false);
    setSelectedApplication(null);
    setAdminNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'verified':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  const selectedVacancy = selectedApplication ? getVacancy(selectedApplication.vacancyId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Applications</h1>
        <p className="text-muted-foreground">Review mentor applications for course vacancies</p>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by mentor name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="border border-border bg-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No applications submitted yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => {
            const vacancy = getVacancy(application.vacancyId);
            return (
              <Card key={application.id} className="border border-border bg-card hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{application.mentorName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusBadge(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{application.mentorEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Vacancy: {vacancy?.title || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                        {application.qualifications && (
                          <p className="text-xs mt-2 line-clamp-2">{application.qualifications}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleReview(application)}
                      variant="outline"
                      className="border-border"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {showDetailsModal && selectedApplication && selectedVacancy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border border-border bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Review Application</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                {selectedApplication.mentorName} - {selectedVacancy.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mentor Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Mentor Name</Label>
                  <p className="font-medium text-foreground">{selectedApplication.mentorName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium text-foreground">{selectedApplication.mentorEmail}</p>
                </div>
              </div>

              {/* Vacancy Info */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Vacancy Details</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                    <p className="font-medium text-foreground">{selectedVacancy.title}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <p className="font-medium text-foreground">{selectedVacancy.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pricing:</span>
                    <p className="font-medium text-foreground">${selectedVacancy.adminPricing.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commission:</span>
                    <p className="font-medium text-foreground">
                      Evolvix {selectedVacancy.commissionSplit.evolvix}% | Mentor {selectedVacancy.commissionSplit.mentor}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-4">
                <div>
                  <Label>Experience</Label>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{selectedApplication.experience}</p>
                </div>

                <div>
                  <Label>Qualifications & Certifications</Label>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{selectedApplication.qualifications}</p>
                </div>

                <div>
                  <Label>Cover Letter</Label>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>

                {selectedApplication.portfolio && (
                  <div>
                    <Label>Portfolio</Label>
                    <a
                      href={selectedApplication.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center space-x-1 mt-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Portfolio</span>
                    </a>
                  </div>
                )}

                {(selectedApplication.demoClassUrl || selectedApplication.demoClassFile) && (
                  <div>
                    <Label>Demo Class</Label>
                    <div className="mt-1">
                      {selectedApplication.demoClassUrl ? (
                        <a
                          href={selectedApplication.demoClassUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center space-x-1"
                        >
                          <Video className="w-4 h-4" />
                          <span>Watch Demo Class</span>
                        </a>
                      ) : selectedApplication.demoClassFile ? (
                        <a
                          href={selectedApplication.demoClassFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center space-x-1"
                        >
                          <Video className="w-4 h-4" />
                          <span>Download Demo Class</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  rows={3}
                  placeholder="Add notes about this application..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-2">
                  {selectedApplication.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusChange('accepted')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept Application
                      </Button>
                      <Button
                        onClick={() => handleStatusChange('rejected')}
                        variant="outline"
                        className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === 'accepted' && (
                    <Button
                      onClick={() => handleStatusChange('verified')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verify & Enable Course Creation
                    </Button>
                  )}
                </div>
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

