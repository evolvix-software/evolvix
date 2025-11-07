"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { VerificationBadge } from './VerificationBadge';
import { Verification, VerificationStatus, verificationApi } from '@/lib/api/verification';
import { CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react';

interface AdminVerificationDashboardProps {
  initialVerifications?: Verification[];
}

export function AdminVerificationDashboard({ initialVerifications }: AdminVerificationDashboardProps) {
  const [verifications, setVerifications] = useState<Verification[]>(initialVerifications || []);
  const [loading, setLoading] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [filterStatus, setFilterStatus] = useState<VerificationStatus | 'all'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadVerifications();
  }, [filterStatus]);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      // TODO: Implement admin API endpoint to fetch verifications
      // const response = await verificationApi.getAllVerifications({ status: filterStatus });
      // setVerifications(response.verifications);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId: string) => {
    try {
      // TODO: Implement admin API endpoint
      // await verificationApi.approveVerification(verificationId, { adminNotes });
      alert('Verification approved successfully');
      loadVerifications();
      setSelectedVerification(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to approve verification:', error);
      alert('Failed to approve verification');
    }
  };

  const handleReject = async (verificationId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      // TODO: Implement admin API endpoint
      // await verificationApi.rejectVerification(verificationId, { rejectionReason, adminNotes });
      alert('Verification rejected successfully');
      loadVerifications();
      setSelectedVerification(null);
      setRejectionReason('');
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to reject verification:', error);
      alert('Failed to reject verification');
    }
  };

  const filteredVerifications = filterStatus === 'all' 
    ? verifications 
    : verifications.filter(v => v.status === filterStatus);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Verification Review Dashboard</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Review and approve/reject user verifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('approved')}
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('rejected')}
            >
              Rejected
            </Button>
          </div>

          {/* Verifications List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No verifications found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVerifications.map((verification) => (
                <Card
                  key={verification._id}
                  className="border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-colors cursor-pointer"
                  onClick={() => setSelectedVerification(verification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {verification.role} Verification
                          </h3>
                          <VerificationBadge
                            level={verification.verificationLevel}
                            status={verification.status}
                            role={verification.role}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          User ID: {verification.userId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVerification(verification);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification Detail Modal */}
      {selectedVerification && (
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 fixed inset-4 z-50 overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white capitalize">
                  {selectedVerification.role} Verification Details
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Review all submitted information
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedVerification(null);
                  setRejectionReason('');
                  setAdminNotes('');
                }}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Verification Status */}
            <div>
              <VerificationBadge
                level={selectedVerification.verificationLevel}
                status={selectedVerification.status}
                role={selectedVerification.role}
              />
            </div>

            {/* Verification Data */}
            <div className="space-y-4">
              {selectedVerification.personalInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedVerification.personalInfo, null, 2)}
                  </pre>
                </div>
              )}

              {selectedVerification.companyInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Company Information</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedVerification.companyInfo, null, 2)}
                  </pre>
                </div>
              )}

              {selectedVerification.investorInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Investor Information</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedVerification.investorInfo, null, 2)}
                  </pre>
                </div>
              )}

              {selectedVerification.sponsorInfo && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Sponsor Information</h4>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedVerification.sponsorInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Admin Actions */}
            {selectedVerification.status === 'pending' && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this verification..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Rejection Reason (Required for rejection)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Provide reason if rejecting..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleApprove(selectedVerification._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedVerification._id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {selectedVerification.rejectionReason && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Rejection Reason</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedVerification.rejectionReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

