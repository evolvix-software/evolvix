"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Input } from '@/components/common/forms/Input';
import { Label } from '@/components/ui/label';
import { Course } from '@/data/mock/coursesData';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { updateCourse } from '@/store/features/courses/coursesSlice';
import { Search, CheckCircle2, XCircle, Clock, FileText, Eye, Upload, DollarSign, Users, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminCourseVerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [verificationData, setVerificationData] = useState({
    adminNotes: '',
    adminPricing: 0,
    evolvixCommission: 30,
    mentorCommission: 70,
    contractFile: null as File | null,
  });

  // Get only bundle courses
  const bundleCourses = courses.filter(c => c.isBundleCourse);

  const filteredCourses = bundleCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.courseStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReview = (course: Course) => {
    setSelectedCourse(course);
    setVerificationData({
      adminNotes: course.adminNotes || '',
      adminPricing: course.adminPricing || 0,
      evolvixCommission: course.commissionSplit?.evolvix || 30,
      mentorCommission: course.commissionSplit?.mentor || 70,
      contractFile: null,
    });
    setShowDetailsModal(true);
  };

  const handleVerify = () => {
    if (!selectedCourse) return;

    const updatedCourse: Partial<Course> = {
      courseStatus: 'verified',
      adminNotes: verificationData.adminNotes || undefined,
      adminPricing: verificationData.adminPricing,
      commissionSplit: {
        evolvix: verificationData.evolvixCommission,
        mentor: verificationData.mentorCommission,
      },
      contractDocument: verificationData.contractFile 
        ? URL.createObjectURL(verificationData.contractFile) 
        : selectedCourse.contractDocument,
    };

    dispatch(updateCourse({ id: selectedCourse.id, ...updatedCourse }));
    setShowDetailsModal(false);
    setSelectedCourse(null);
  };

  const handleReject = () => {
    if (!selectedCourse) return;

    const updatedCourse: Partial<Course> = {
      courseStatus: 'rejected',
      adminNotes: verificationData.adminNotes || 'Course rejected. Please review and resubmit.',
    };

    dispatch(updateCourse({ id: selectedCourse.id, ...updatedCourse }));
    setShowDetailsModal(false);
    setSelectedCourse(null);
  };

  const handlePublish = (courseId: string) => {
    if (confirm('Publish this course? It will be visible to students.')) {
      dispatch(updateCourse({
        id: courseId,
        courseStatus: 'published',
        adminApproved: true,
      }));
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'pending-verification':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'verified':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'published':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'verified':
      case 'published':
        return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Course Verification</h1>
        <p className="text-muted-foreground">Review and verify submitted bundle courses</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {bundleCourses.filter(c => c.courseStatus === 'pending-verification').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Verified</p>
                <p className="text-2xl font-bold text-foreground">
                  {bundleCourses.filter(c => c.courseStatus === 'verified').length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Published</p>
                <p className="text-2xl font-bold text-foreground">
                  {bundleCourses.filter(c => c.courseStatus === 'published').length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <p className="text-2xl font-bold text-foreground">
                  {bundleCourses.filter(c => c.courseStatus === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
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
              <option value="draft">Draft</option>
              <option value="pending-verification">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <Card className="border border-border bg-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No courses submitted for verification'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="border border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusBadge(course.courseStatus)}`}>
                        {getStatusIcon(course.courseStatus)}
                        <span>{course.courseStatus?.replace('-', ' ').toUpperCase() || 'DRAFT'}</span>
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>Mentor: {course.instructor.name}</span>
                        <span>•</span>
                        <span>Modules: {course.modules.length}</span>
                        <span>•</span>
                        <span>Lessons: {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}</span>
                      </div>
                      {course.adminPricing && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Pricing: ${course.adminPricing.toLocaleString()}</span>
                        </div>
                      )}
                      {course.commissionSplit && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>
                            Commission: Evolvix {course.commissionSplit.evolvix}% | Mentor {course.commissionSplit.mentor}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/portal/mentor/courses/${course.id}`)}
                      variant="outline"
                      className="border-border"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Course
                    </Button>
                    {course.courseStatus === 'pending-verification' && (
                      <Button
                        onClick={() => handleReview(course)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Review
                      </Button>
                    )}
                    {course.courseStatus === 'verified' && course.mentorSigned && (
                      <Button
                        onClick={() => handlePublish(course.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Verification Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border border-border bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verify Course</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>{selectedCourse.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course Info */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Course Details</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mentor:</span>
                    <p className="font-medium text-foreground">{selectedCourse.instructor.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p className="font-medium text-foreground">{selectedCourse.category}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Modules:</span>
                    <p className="font-medium text-foreground">{selectedCourse.modules.length}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Lessons:</span>
                    <p className="font-medium text-foreground">
                      {selectedCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing & Commission */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Set Pricing & Commission</h4>
                
                <div>
                  <Label htmlFor="adminPricing">Course Pricing ($) *</Label>
                  <Input
                    id="adminPricing"
                    type="number"
                    value={verificationData.adminPricing}
                    onChange={(e) => setVerificationData({ ...verificationData, adminPricing: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                    min="0"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="evolvixCommission">Evolvix Commission (%) *</Label>
                    <Input
                      id="evolvixCommission"
                      type="number"
                      value={verificationData.evolvixCommission}
                      onChange={(e) => {
                        const evolvix = parseFloat(e.target.value) || 0;
                        setVerificationData({ ...verificationData, evolvixCommission: evolvix, mentorCommission: 100 - evolvix });
                      }}
                      className="mt-1"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mentorCommission">Mentor Commission (%) *</Label>
                    <Input
                      id="mentorCommission"
                      type="number"
                      value={verificationData.mentorCommission}
                      onChange={(e) => {
                        const mentor = parseFloat(e.target.value) || 0;
                        setVerificationData({ ...verificationData, mentorCommission: mentor, evolvixCommission: 100 - mentor });
                      }}
                      className="mt-1"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Commission Breakdown:</strong> If course price is ${verificationData.adminPricing.toLocaleString()}, 
                    Evolvix will receive ${(verificationData.adminPricing * verificationData.evolvixCommission / 100).toLocaleString()} 
                    ({verificationData.evolvixCommission}%) and Mentor will receive ${(verificationData.adminPricing * verificationData.mentorCommission / 100).toLocaleString()} 
                    ({verificationData.mentorCommission}%).
                  </p>
                </div>
              </div>

              {/* Contract Upload */}
              <div>
                <Label htmlFor="contractFile">Contract Document *</Label>
                <Input
                  id="contractFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setVerificationData({ ...verificationData, contractFile: e.target.files?.[0] || null })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload the contract PDF to send to mentor for signature
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <textarea
                  id="adminNotes"
                  value={verificationData.adminNotes}
                  onChange={(e) => setVerificationData({ ...verificationData, adminNotes: e.target.value })}
                  className="mt-1 w-full p-2 border border-border rounded-md bg-background text-foreground"
                  rows={4}
                  placeholder="Add notes about the verification..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerify}
                    disabled={!verificationData.contractFile && !selectedCourse.contractDocument}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verify & Send Contract
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

