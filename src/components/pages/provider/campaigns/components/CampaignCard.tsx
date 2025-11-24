"use client";

import { Campaign } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { StatusBadge } from '@/components/provider/common/StatusBadge';
import { Button } from '@/components/common/forms/Button';
import {
  Users,
  Wallet,
  Calendar,
  FileText,
  Award,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CampaignCardProps {
  campaign: Campaign;
  viewMode: 'grid' | 'list';
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
}

export function CampaignCard({
  campaign,
  viewMode,
  selected = false,
  onSelect,
  onClick,
}: CampaignCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const isOpen = new Date(campaign.applicationOpenDate) <= new Date() &&
    new Date(campaign.applicationCloseDate) >= new Date() &&
    campaign.status === 'open';

  const daysRemaining = isOpen
    ? Math.ceil(
        (new Date(campaign.applicationCloseDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const handleAction = (action: string) => {
    setShowMenu(false);
    switch (action) {
      case 'view':
        onClick?.();
        break;
      case 'edit':
        // Check if we're in admin or provider context
        const isAdmin = window.location.pathname.includes('/admin');
        router.push(isAdmin 
          ? `/admin/campaigns/${campaign.id}/edit`
          : `/portal/provider/campaigns/${campaign.id}/edit`
        );
        break;
      case 'duplicate':
        // Handle duplicate
        break;
      case 'applications':
        const isAdminApp = window.location.pathname.includes('/admin');
        router.push(isAdminApp
          ? `/admin/campaigns/${campaign.id}?tab=applications`
          : `/portal/provider/campaigns/${campaign.id}/applications`
        );
        break;
      case 'scholars':
        const isAdminScholars = window.location.pathname.includes('/admin');
        router.push(isAdminScholars
          ? `/admin/campaigns/${campaign.id}?tab=scholars`
          : `/portal/provider/scholars?campaign=${campaign.id}`
        );
        break;
      case 'analytics':
        const isAdminAnalytics = window.location.pathname.includes('/admin');
        router.push(isAdminAnalytics
          ? `/admin/campaigns/${campaign.id}?tab=analytics`
          : `/portal/provider/campaigns/${campaign.id}?tab=analytics`
        );
        break;
      case 'delete':
        // Handle delete
        break;
      case 'close':
        // Handle close
        break;
    }
  };

  if (viewMode === 'list') {
    return (
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-4">
              {onSelect && (
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelect(e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-input"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{campaign.title}</h3>
                  <StatusBadge status={campaign.status} />
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                    {campaign.campaignType.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{campaign.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Slots</p>
                  <p className="font-semibold text-foreground">
                    {campaign.slotsAwarded} / {campaign.totalSlots}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Funding</p>
                  <p className="font-semibold text-foreground">
                    ₹{(campaign.fundedAmount / 100000).toFixed(1)}L / ₹
                    {(campaign.requiredAmount / 100000).toFixed(1)}L
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Applications</p>
                  <p className="font-semibold text-foreground">0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Window</p>
                  <p className="font-semibold text-foreground">
                    {isOpen ? `${daysRemaining} days left` : 'Closed'}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('view');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('edit');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Campaign
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('duplicate');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate Campaign
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('applications');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Applications
                    </button>
                    <div className="border-t border-border"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('delete');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Campaign
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {campaign.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={campaign.status} />
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                {campaign.campaignType.replace('-', ' ')}
              </span>
            </div>
          </div>
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-input"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Slots</p>
              <p className="text-sm font-semibold text-foreground">
                {campaign.slotsAwarded} / {campaign.totalSlots}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Funding</p>
              <p className="text-sm font-semibold text-foreground">
                ₹{(campaign.fundedAmount / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Applications</p>
              <p className="text-sm font-semibold text-foreground">0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Awarded</p>
              <p className="text-sm font-semibold text-foreground">
                {campaign.slotsAwarded}
              </p>
            </div>
          </div>
        </div>

        {/* Application Window */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Application Window</p>
            <p className="text-sm font-semibold text-foreground">
              {isOpen ? (
                <span className="text-green-600">{daysRemaining} days remaining</span>
              ) : (
                <span className="text-muted-foreground">Closed</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleAction('view');
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAction('edit');
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('duplicate');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('applications');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Applications
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('scholars');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Scholars
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('analytics');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Analytics
                </button>
                <div className="border-t border-border"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('close');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close Campaign
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('delete');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

