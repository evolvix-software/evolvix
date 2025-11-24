"use client";

import { Campaign } from '@/data/mock/providerData';
import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Button } from '@/components/common/forms/Button';
import { Edit, Archive, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsTabProps {
  campaign: Campaign;
  onUpdate: (campaign: Campaign) => void;
}

export function SettingsTab({ campaign, onUpdate }: SettingsTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Campaign Settings</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Campaign Management</p>
            <p className="text-xs text-muted-foreground mb-4">
              Campaign creation and editing are managed by Evolvix administrators. 
              Contact support to request changes to campaign settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Danger Zone</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Archive this campaign. Archived campaigns cannot be edited but remain visible.
            </p>
            <Button variant="outline">
              <Archive className="w-4 h-4 mr-2" />
              Archive Campaign
            </Button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Permanently delete this campaign. This action cannot be undone.
            </p>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

