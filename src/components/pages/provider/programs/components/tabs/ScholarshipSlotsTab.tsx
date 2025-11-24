"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Award, Link as LinkIcon, Users, FileText, X, Plus } from 'lucide-react';
import { Course, campaignService, Campaign } from '@/data/mock/providerData';
import { useRouter } from 'next/navigation';

interface ScholarshipSlotsTabProps {
  course: Course;
  courseId: string;
  providerId: string;
}

export function ScholarshipSlotsTab({ course, courseId, providerId }: ScholarshipSlotsTabProps) {
  const router = useRouter();
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  const allCampaigns = campaignService.getAll(providerId);
  const linkedCampaigns = allCampaigns.filter(c => c.linkedCourseIds?.includes(courseId));
  const availableCampaigns = allCampaigns.filter(c => !c.linkedCourseIds?.includes(courseId) && c.status === 'open');

  // Calculate totals from linked campaigns
  const totalSlots = linkedCampaigns.reduce((sum, c) => sum + (c.slotsAvailable || 0), 0);
  const awardedSlots = linkedCampaigns.reduce((sum, c) => sum + (c.slotsAwarded || 0), 0);
  const reservedSlots = linkedCampaigns.reduce((sum, c) => sum + (c.slotsReserved || 0), 0);
  const applicationsReceived = linkedCampaigns.reduce((sum, c) => {
    // Mock application count - in real app, fetch from applicationService
    return sum + (c.slotsAwarded || 0) * 3; // Estimate
  }, 0);

  const handleLinkCampaign = (campaignId: string) => {
    const campaign = campaignService.getById(campaignId);
    if (campaign) {
      const updatedCourseIds = [...(campaign.linkedCourseIds || []), courseId];
      campaignService.update(campaignId, { linkedCourseIds: updatedCourseIds });
      setShowLinkModal(false);
      // Refresh page data
      window.location.reload();
    }
  };

  const handleUnlinkCampaign = (campaignId: string) => {
    const campaign = campaignService.getById(campaignId);
    if (campaign) {
      const updatedCourseIds = (campaign.linkedCourseIds || []).filter(id => id !== courseId);
      campaignService.update(campaignId, { linkedCourseIds: updatedCourseIds });
      // Refresh page data
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Slots</p>
                <p className="text-2xl font-bold text-foreground">{totalSlots}</p>
              </div>
              <Award className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{course.scholarshipSlotsAvailable}</p>
              </div>
              <Users className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Awarded</p>
                <p className="text-2xl font-bold text-purple-600">{awardedSlots}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold text-foreground">{applicationsReceived}</p>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linked Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Linked Campaigns</h2>
          <Button onClick={() => setShowLinkModal(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Link Campaign
          </Button>
        </CardHeader>
        <CardContent>
          {linkedCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No campaigns linked to this course</p>
              <Button onClick={() => setShowLinkModal(true)}>
                <LinkIcon className="w-4 h-4 mr-2" />
                Link Your First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                        <StatusBadge status={campaign.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Slots Available</p>
                          <p className="font-semibold text-foreground">{campaign.slotsAvailable}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Slots Awarded</p>
                          <p className="font-semibold text-foreground">{campaign.slotsAwarded}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applications</p>
                          <p className="font-semibold text-foreground">{campaign.slotsAwarded * 3}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Awards</p>
                          <p className="font-semibold text-foreground">{campaign.slotsAwarded}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/portal/provider/campaigns/${campaign.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/portal/provider/applications?campaign=${campaign.id}`)}
                      >
                        View Applications
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnlinkCampaign(campaign.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Unlink
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Campaign Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Link Campaign</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowLinkModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {availableCampaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No available campaigns to link</p>
                  <p className="text-sm text-muted-foreground">
                    Campaigns are created by Evolvix administrators. Contact support to request a new campaign.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => handleLinkCampaign(campaign.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{campaign.slotsAvailable} slots available</span>
                            <StatusBadge status={campaign.status} />
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

