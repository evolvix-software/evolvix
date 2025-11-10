import { CalendarEvent } from '@/components/common/calendar/types';

// Mock calendar events for both student and mentor portals
export const mockCalendarEvents: CalendarEvent[] = [
  // Site Events
  {
    id: 'event_1',
    title: 'Abeyance/Semester Freeze Request for enrolled students - IAP First Session',
    startTime: '2025-11-01T00:00:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_2',
    title: 'Study break starts',
    startTime: '2025-11-03T00:05:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_3',
    title: 'Final Study break starts',
    startTime: '2025-11-07T00:00:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_4',
    title: 'Final Study break ends',
    startTime: '2025-11-08T00:00:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_5',
    title: 'Final Exams Starts (For IAP Session 1 Only)',
    startTime: '2025-11-09T00:05:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_6',
    title: 'Late Course Dropping Period Starts with $10 Fine per Course (For IAP Session 2 Only)',
    startTime: '2025-11-24T00:00:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_7',
    title: 'IAP Session 2 Enrolment commences',
    startTime: '2025-11-24T18:00:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_8',
    title: 'Free Course Dropping Period Starts (For IAP Session 2 Only)',
    startTime: '2025-11-24T23:55:00Z',
    type: 'site',
    allDay: false,
  },
  {
    id: 'event_9',
    title: 'Late assignment submission deduction exemption (Certificates|Higher Certificates|Diplomas|Associate Degrees|Bachelor\'s & Bridge Diplomas|AR B 100)',
    startTime: '2025-11-26T18:00:00Z',
    type: 'category',
    allDay: false,
  },
  {
    id: 'event_10',
    title: 'Late research papers submission period with 15 marks deduction expires (All courses except THS501|THS 502|BRMT 701)',
    startTime: '2025-11-27T18:00:00Z',
    type: 'category',
    allDay: false,
  },
  {
    id: 'event_11',
    title: 'Late midterm research paper submission period for (for BMRT 701|ERMT 701|THS501 and THS502 only) with 15% marks deduction expires. (For Masters Programs Only)',
    startTime: '2025-11-27T18:00:00Z',
    type: 'category',
    allDay: false,
  },
  {
    id: 'event_12',
    title: 'THS501|THS 502|BRMT 701 only) without 15% marks deduction expires.(For Masters Programs Only)',
    startTime: '2025-11-27T00:00:00Z',
    type: 'category',
    allDay: false,
  },
  // Course Events
  {
    id: 'event_13',
    title: 'Exam Center Registration',
    startTime: '2025-11-05T18:00:00Z',
    type: 'course',
    courseId: '7',
    courseTitle: 'Complete Python Data Science & Machine Learning',
    allDay: false,
  },
  // Group Events (for mentor - class schedules)
  {
    id: 'event_14',
    title: 'Live Class: React Development',
    startTime: '2025-11-10T15:00:00Z',
    endTime: '2025-11-10T16:00:00Z',
    type: 'group',
    courseId: '5',
    courseTitle: 'React Development',
    location: 'Online',
    metadata: {
      classId: 'class_1',
    },
  },
  // User Events (personal appointments for mentor)
  {
    id: 'event_15',
    title: 'Student Consultation - Alex Johnson',
    startTime: '2025-11-12T14:00:00Z',
    endTime: '2025-11-12T14:30:00Z',
    type: 'user',
    metadata: {
      studentId: 'student_1',
    },
  },
];

// Generate events for current month (for demo purposes)
export function generateMockEventsForMonth(year: number, month: number, role: 'student' | 'mentor'): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  // Add some recurring events
  if (role === 'mentor') {
    // Weekly office hours (every Monday at 2 PM)
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === 1) { // Monday
        events.push({
          id: `office_hours_${day}`,
          title: 'Office Hours',
          startTime: new Date(year, month, day, 14, 0).toISOString(),
          endTime: new Date(year, month, day, 16, 0).toISOString(),
          type: 'user',
          recurring: {
            frequency: 'weekly',
            interval: 1,
          },
        });
      }
    }
  }
  
  return [...mockCalendarEvents, ...events].filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate.getMonth() === month && eventDate.getFullYear() === year;
  });
}

