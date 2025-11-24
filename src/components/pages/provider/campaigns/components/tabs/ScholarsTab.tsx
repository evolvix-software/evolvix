"use client";

import { Card, CardContent, CardHeader } from '@/components/common/forms/Card';
import { Award, Users } from 'lucide-react';
import { scholarService } from '@/data/mock/providerData';
import { useState, useEffect } from 'react';

interface ScholarsTabProps {
  campaignId: string;
  providerId: string;
}

export function ScholarsTab({ campaignId, providerId }: ScholarsTabProps) {
  const [scholars, setScholars] = useState<any[]>([]);

  useEffect(() => {
    // Get scholars for this campaign
    try {
      const allScholars = scholarService.getAll(providerId);
      const campaignScholars = allScholars.filter((s: any) => s.campaignId === campaignId);
      setScholars(campaignScholars);
    } catch (error) {
      console.error('Error fetching scholars:', error);
      setScholars([]);
    }
  }, [campaignId, providerId]);

  return (
    <div className="space-y-6">
      {scholars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Scholars Yet</h3>
            <p className="text-muted-foreground">
              No scholarships have been awarded for this campaign yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scholars.map((scholar) => (
            <Card key={scholar.id}>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {scholar.profile?.name || 'Unknown Scholar'}
                </h3>
                <p className="text-sm text-muted-foreground">{scholar.profile?.email}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Award Amount:</span>
                    <span className="font-semibold text-foreground">
                      ₹{scholar.awardAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-foreground capitalize">
                      {scholar.awardStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

