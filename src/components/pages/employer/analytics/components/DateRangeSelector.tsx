"use client";

import { useState } from 'react';
import { Button } from '@/components/common/forms/Button';
import { Calendar, ChevronDown } from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export type DateRangeOption = '7d' | '30d' | '90d' | '6m' | '1y' | 'custom';

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onChange: (range: DateRangeOption, startDate?: Date, endDate?: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export function DateRangeSelector({
  value,
  onChange,
  startDate,
  endDate,
}: DateRangeSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const getDateRange = (option: DateRangeOption) => {
    const today = new Date();
    switch (option) {
      case '7d':
        return { start: subDays(today, 7), end: today };
      case '30d':
        return { start: subDays(today, 30), end: today };
      case '90d':
        return { start: subDays(today, 90), end: today };
      case '6m':
        return { start: subMonths(today, 6), end: today };
      case '1y':
        return { start: subMonths(today, 12), end: today };
      default:
        return { start: startDate || subDays(today, 30), end: endDate || today };
    }
  };

  const handleRangeSelect = (option: DateRangeOption) => {
    if (option === 'custom') {
      setShowCustomPicker(true);
    } else {
      const { start, end } = getDateRange(option);
      onChange(option, start, end);
    }
  };

  const handleCustomDateChange = (start: Date, end: Date) => {
    onChange('custom', start, end);
    setShowCustomPicker(false);
  };

  const { start, end } = getDateRange(value);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border border-border rounded-lg">
        <Button
          variant={value === '7d' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRangeSelect('7d')}
          className="rounded-r-none"
        >
          7D
        </Button>
        <Button
          variant={value === '30d' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRangeSelect('30d')}
          className="rounded-none"
        >
          30D
        </Button>
        <Button
          variant={value === '90d' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRangeSelect('90d')}
          className="rounded-none"
        >
          90D
        </Button>
        <Button
          variant={value === '6m' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRangeSelect('6m')}
          className="rounded-none"
        >
          6M
        </Button>
        <Button
          variant={value === '1y' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleRangeSelect('1y')}
          className="rounded-l-none"
        >
          1Y
        </Button>
      </div>
      <Button
        variant={value === 'custom' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleRangeSelect('custom')}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {value === 'custom' && startDate && endDate
          ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
          : 'Custom'}
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>
      {showCustomPicker && (
        <div className="absolute mt-2 p-4 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleCustomDateChange(new Date(e.target.value), endDate || new Date());
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleCustomDateChange(startDate || new Date(), new Date(e.target.value));
                  }
                }}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomPicker(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

