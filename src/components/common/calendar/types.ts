export type EventFilter = 'site' | 'category' | 'course' | 'group' | 'user' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  type: EventFilter;
  courseId?: string;
  courseTitle?: string;
  color?: string;
  location?: string;
  url?: string;
  allDay?: boolean;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
  metadata?: {
    assignmentId?: string;
    testId?: string;
    classId?: string;
    studentId?: string;
    [key: string]: any;
  };
}

export interface CalendarProps {
  events: CalendarEvent[];
  role: 'student' | 'mentor';
  courses?: Array<{ id: string; title: string }>;
  onEventClick?: (event: CalendarEvent) => void;
  onCreateEvent?: () => void;
  className?: string;
}

