"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/forms/Button';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarEvent, EventFilter } from './types';
import { useRouter, usePathname } from 'next/navigation';

interface CalendarProps {
  events: CalendarEvent[];
  role: 'student' | 'mentor';
  courses?: Array<{ id: string; title: string }>;
  onEventClick?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  className?: string;
}

export function Calendar({ 
  events, 
  role, 
  courses = [], 
  onEventClick,
  onCreateEvent,
  className = '' 
}: CalendarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [activeFilters, setActiveFilters] = useState<Set<EventFilter>>(new Set(['site', 'category', 'course', 'group', 'user', 'other']));
  const isCalendarPage = pathname?.includes('/calendar') || false;

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Adjust to start week on Monday (0 = Monday, 6 = Sunday)
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  // Filter events based on selected course and active filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by course
      if (selectedCourse !== 'all' && event.courseId !== selectedCourse) {
        return false;
      }
      
      // Filter by event type
      if (!activeFilters.has(event.type)) {
        return false;
      }
      
      // Filter by date (current month)
      const eventDate = new Date(event.startTime);
      return eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  }, [events, selectedCourse, activeFilters, currentDate]);

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

  // Get today's date for highlighting
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

  const toggleFilter = (filter: EventFilter) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
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
  
  // Add empty cells for days before month starts
  for (let i = 0; i < adjustedStartingDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const filterButtons: Array<{ type: EventFilter; label: string; color: string }> = [
    { type: 'site', label: 'Site events', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { type: 'category', label: 'Category events', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { type: 'course', label: 'Course events', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { type: 'group', label: 'Group events', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
    { type: 'user', label: 'User events', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' },
    { type: 'other', label: 'Other', color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' },
  ];

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-foreground">Calendar</h2>
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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
            <span className="text-xs text-foreground">0</span>
          </div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center space-x-4 px-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h3 className="text-lg font-semibold text-foreground min-w-[200px] text-center">
          {monthName}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Calendar Grid - Full Width */}
      <div className="w-full border-t border-b border-border bg-card">
        <div className="p-4 w-full">
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week header */}
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="min-h-[100px]"></div>;
              }

              const dayEvents = eventsByDate[day] || [];
              const isToday = isCurrentMonth && day === today.getDate();
              
              return (
                <div
                  key={day}
                  className={`min-h-[100px] p-1 border border-border ${
                    isToday ? 'bg-[var(--calendar-current-day-bg)]' : 'bg-card'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'text-[var(--calendar-current-day-foreground)]'
                      : 'text-foreground'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="bg-primary text-primary-foreground text-xs p-1.5 rounded cursor-pointer hover:opacity-90 transition-opacity"
                        title={event.title}
                      >
                        <div className="font-semibold text-[10px] mb-0.5">
                          {formatTime(event.startTime)}
                        </div>
                        <div className="truncate text-[10px]">
                          {event.title}
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={`text-xs text-center ${
                        isToday ? 'text-[var(--calendar-current-day-foreground)]' : 'text-muted-foreground'
                      }`}>
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Filters */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-6">
        {filterButtons.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFilters.has(type)
                ? color + ' border-2 border-current'
                : 'bg-secondary text-muted-foreground hover:bg-accent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Full Calendar Button - Only show if not already on calendar page */}
      {!isCalendarPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              const basePath = role === 'mentor' ? '/portal/mentor/calendar' : '/portal/student/calendar';
              router.push(basePath);
            }}
            variant="outline"
            className="bg-secondary hover:bg-accent text-foreground"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Full calendar
          </Button>
        </div>
      )}

      {/* Search Button (Floating) */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-50"
        title="Search events"
      >
        <Search className="w-6 h-6 text-primary-foreground" />
      </button>
    </div>
  );
}

