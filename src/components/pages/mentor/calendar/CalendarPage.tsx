"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from '@/components/common/calendar';
import { generateMockEventsForMonth } from '@/data/mock/calendarEvents';
import { CalendarEvent } from '@/components/common/calendar/types';
import { useAppSelector } from '@/hooks';

export function CalendarPageContent() {
  const searchParams = useSearchParams();
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
      'mentor'
    );
    setEvents(monthEvents);
  }, []);

  // Get mentor's courses
  const mentorCourses = courses.filter(c => 
    c.instructor.id === userData?.email || 
    c.instructor.id === 'suhxil14@gmail.com'
  );

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click - could open modal or navigate
    console.log('Event clicked:', event);
  };

  return (
    <div className="w-full h-full">
      <Calendar
        events={events}
        role="mentor"
        courses={mentorCourses.map(c => ({ id: c.id, title: c.title }))}
        onEventClick={handleEventClick}
      />
    </div>
  );
}

