"use client";

import { useState } from 'react';
import { Button } from '@/components/common/forms/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { VerificationData } from '@/lib/api';

interface VerificationDetailsModalProps {
  show: boolean;
  verification: VerificationData | null;
  error: string;
  actionLoading: string | null;
  onClose: () => void;
  onApprove: (id: string, adminNotes?: string) => void;
  onReject: (id: string, rejectionReason: string, adminNotes?: string) => void;
}

export function VerificationDetailsModal({
  show,
  verification,
  error,
  actionLoading,
  onClose,
  onApprove,
  onReject,
}: VerificationDetailsModalProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!show || !verification) return null;

  const handleClose = () => {
    setAdminNotes('');
    setRejectionReason('');
    onClose();
  };

  const handleApprove = () => {
    onApprove(verification._id || verification.id || '', adminNotes || undefined);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    onReject(verification._id || verification.id || '', rejectionReason, adminNotes || undefined);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Verification Details</h3>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        <div className="space-y-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-foreground mb-2">User Information</h4>
            {typeof verification.userId === 'object' && verification.userId ? (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p><strong>Name:</strong> {verification.userId.fullName}</p>
                <p><strong>Email:</strong> {verification.userId.email}</p>
                <p><strong>Role:</strong> {verification.userId.primaryRole || verification.userId.roles.join(', ')}</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">User ID: {verification.userId}</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-foreground mb-2">Verification Information</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
              <p><strong>Role:</strong> {verification.role}</p>
              <p><strong>Level:</strong> {verification.verificationLevel}</p>
              <p><strong>Status:</strong> 
                {verification.status === 'pending' && <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>}
                {verification.status === 'approved' && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>}
                {verification.status === 'rejected' && <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Rejected</span>}
                {verification.status === 'incomplete' && <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Incomplete</span>}
              </p>
              <p><strong>Submitted:</strong> {verification.submittedAt ? new Date(verification.submittedAt).toLocaleString() : 'N/A'}</p>
              {verification.reviewedAt && (
                <p><strong>Reviewed:</strong> {new Date(verification.reviewedAt).toLocaleString()}</p>
              )}
              {verification.rejectionReason && (
                <p><strong>Rejection Reason:</strong> {verification.rejectionReason}</p>
              )}
              {verification.adminNotes && (
                <p><strong>Admin Notes:</strong> {verification.adminNotes}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-foreground mb-2">Verification Documents</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
              {verification.personalInfo && (
                <div>
                  <h5 className="font-medium mb-2">Personal Information</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.personalInfo, null, 2)}
                  </pre>
                </div>
              )}
              {verification.idProof && (
                <div>
                  <h5 className="font-medium mb-2">ID Proof</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.idProof, null, 2)}
                  </pre>
                  {verification.idProof.documentUrl && (
                    <a href={verification.idProof.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                      View Document
                    </a>
                  )}
                </div>
              )}
              {verification.educationInfo && (
                <div>
                  <h5 className="font-medium mb-2">Education Information</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.educationInfo, null, 2)}
                  </pre>
                </div>
              )}
              {verification.professionalCredentials && (
                <div>
                  <h5 className="font-medium mb-2">Professional Credentials</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.professionalCredentials, null, 2)}
                  </pre>
                </div>
              )}
              {verification.experienceProof && (
                <div>
                  <h5 className="font-medium mb-2">Experience Proof</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.experienceProof, null, 2)}
                  </pre>
                </div>
              )}
              {verification.bankDetails && (
                <div>
                  <h5 className="font-medium mb-2">Bank Details</h5>
                  <pre className="text-xs bg-card dark:bg-gray-800 p-3 rounded overflow-auto">
                    {JSON.stringify(verification.bankDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {verification.status === 'pending' && (
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Admin Notes (optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-foreground"
                rows={3}
                placeholder="Add notes about this verification..."
              />
            </div>
            <div className="flex space-x-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApprove}
                loading={actionLoading === `approve-${verification._id || verification.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
              <div className="flex-1 space-y-2">
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-card dark:bg-gray-700 text-gray-900 dark:text-foreground text-sm"
                  rows={2}
                  placeholder="Rejection reason (required)"
                />
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleReject}
                  loading={actionLoading === `reject-${verification._id || verification.id}`}
                  disabled={!rejectionReason.trim()}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full mt-4" onClick={handleClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

