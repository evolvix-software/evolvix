"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/common/forms/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent, EventFilter } from './types';
import { useRouter } from 'next/navigation';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  role: 'student' | 'mentor';
  courses?: Array<{ id: string; title: string }>;
  onEventClick?: (event: CalendarEvent) => void;
  compact?: boolean; // For dashboard widget view
}

export function CalendarWidget({ 
  events, 
  role, 
  courses = [], 
  onEventClick,
  compact = true
}: CalendarWidgetProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (selectedCourse !== 'all' && event.courseId !== selectedCourse) {
        return false;
      }
      const eventDate = new Date(event.startTime);
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  }, [events, selectedCourse, currentDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<number, CalendarEvent[]> = {};
    filteredEvents.forEach(event => {
      const date = new Date(event.startTime);
      const day = date.getDate();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && 
                         today.getFullYear() === currentDate.getFullYear();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < adjustedStartingDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleViewFullCalendar = () => {
    const basePath = role === 'mentor' ? '/portal/mentor/calendar' : '/portal/student/calendar';
    router.push(basePath);
  };

  return (
    <Card className={`border border-border bg-card ${compact ? '' : 'w-full'}`}>
      <CardContent className={compact ? "p-4" : "p-6"}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-foreground">Calendar</h3>
            {courses.length > 0 && (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-1.5 border border-border rounded-lg bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            )}
          </div>
          <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
            <span className="text-xs text-foreground">0</span>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <h4 className="text-base font-semibold text-foreground min-w-[180px] text-center">
            {monthName}
          </h4>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Days of week header */}
          {daysOfWeek.map(day => (
            <div key={day} className="p-1.5 text-center text-xs font-semibold text-muted-foreground">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className={compact ? "min-h-[60px]" : "min-h-[80px]"}></div>;
            }

            const dayEvents = eventsByDate[day] || [];
            const isToday = isCurrentMonth && day === today.getDate();
            
            return (
              <div
                key={day}
                className={`${compact ? "min-h-[60px]" : "min-h-[80px]"} p-1 border border-border rounded ${
                  isToday ? 'bg-primary/10 border-primary' : 'bg-card'
                }`}
              >
                <div className={`text-xs font-medium mb-1 ${
                  isToday 
                    ? 'w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-[10px]'
                    : 'text-foreground text-center'
                }`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, compact ? 2 : 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-[9px] p-1 rounded cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors truncate"
                      title={event.title}
                    >
                      <div className="font-semibold text-[8px] mb-0.5">
                        {formatTime(event.startTime)}
                      </div>
                      <div className="truncate text-[8px]">
                        {event.title}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > (compact ? 2 : 3) && (
                    <div className="text-[9px] text-muted-foreground text-center">
                      +{dayEvents.length - (compact ? 2 : 3)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View Full Calendar Button */}
        <div className="flex justify-center pt-2 border-t border-border">
          <button
            onClick={handleViewFullCalendar}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Full calendar
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

