"use client";

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/common/calendar';
import { generateMockEventsForMonth } from '@/data/mock/calendarEvents';
import { CalendarEvent } from '@/components/common/calendar/types';
import { useAppSelector } from '@/hooks';

export function CalendarPageContent() {
  const { courses } = useAppSelector((state) => state.courses);
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('evolvix_registration');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const monthEvents = generateMockEventsForMonth(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      'student'
    );
    setEvents(monthEvents);
  }, []);

  // Get student's enrolled courses
  const enrolledCourses = courses.filter(c => {
    const enrollments = localStorage.getItem('evolvix_enrollments');
    if (enrollments) {
      const parsed = JSON.parse(enrollments);
      return parsed.some((e: any) => e.courseId === c.id);
    }
    return false;
  });

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click - could open modal or navigate
    console.log('Event clicked:', event);
  };

  return (
    <div className="w-full h-full">
      <Calendar
        events={events}
        role="student"
        courses={enrolledCourses.map(c => ({ id: c.id, title: c.title }))}
        onEventClick={handleEventClick}
      />
    </div>
  );
}

