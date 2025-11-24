"use client";

import { Card, CardContent } from '@/components/common/forms/Card';
import { Award, Users, CheckCircle } from 'lucide-react';

interface ScholarshipSlotsWidgetProps {
  total: number;
  available: number;
  awarded: number;
}

export function ScholarshipSlotsWidget({ total, available, awarded }: ScholarshipSlotsWidgetProps) {
  const reserved = total - available - awarded;
  const utilizationRate = total > 0 ? ((awarded / total) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Scholarship Slots Overview
          </h2>
          <span className="text-sm text-muted-foreground">Utilization: {utilizationRate}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Slots</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{total}</p>
          </div>

          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Available</span>
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{available}</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Awarded</span>
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-foreground">{awarded}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden flex">
            {awarded > 0 && (
              <div
                className="bg-purple-600 h-full transition-all"
                style={{ width: `${(awarded / total) * 100}%` }}
                title={`Awarded: ${awarded}`}
              />
            )}
            {reserved > 0 && (
              <div
                className="bg-yellow-600 h-full transition-all"
                style={{ width: `${(reserved / total) * 100}%` }}
                title={`Reserved: ${reserved}`}
              />
            )}
            {available > 0 && (
              <div
                className="bg-green-600 h-full transition-all"
                style={{ width: `${(available / total) * 100}%` }}
                title={`Available: ${available}`}
              />
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Awarded: {awarded}</span>
            <span>Reserved: {reserved}</span>
            <span>Available: {available}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

