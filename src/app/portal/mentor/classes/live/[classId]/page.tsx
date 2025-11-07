"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addChatMessage } from '@/store/features/classes/classesSlice';
import { JitsiMeetComponent } from '@/components/mentor/components/classes/JitsiMeetComponent';

export default function LiveClassPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { classes, chatMessages, attendance } = useAppSelector((state) => state.classes);
  const [chatInput, setChatInput] = useState('');
  
  const classId = params.classId as string;
  const classItem = classes.find(c => c.id === classId);

  useEffect(() => {
    // Make page fullscreen
    if (typeof window !== 'undefined') {
      // Remove any padding/margins
      document.documentElement.style.height = '100vh';
      document.documentElement.style.width = '100vw';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.width = '100vw';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      
      // Hide scrollbars
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleEndClass = () => {
    // Close the window or redirect
    if (window.opener) {
      window.close();
    } else {
      router.push('/portal/mentor/classes');
    }
  };

  const handleSendChatMessage = (message: string) => {
    if (!classId) return;
    const storedData = localStorage.getItem('evolvix_registration');
    const userData = storedData ? JSON.parse(storedData) : { fullName: 'Mentor', email: 'mentor@example.com' };
    
    dispatch(addChatMessage({
      id: `msg_${Date.now()}`,
      classId: classId,
      senderId: 'mentor',
      senderName: userData.fullName || 'Mentor',
      message: message,
      timestamp: new Date().toISOString(),
    }));
  };

  if (!classItem) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Class not found</h2>
          <button
            onClick={() => router.push('/portal/mentor/classes')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0, overflow: 'hidden' }}>
      <JitsiMeetComponent
        classItem={classItem}
        chatMessages={chatMessages.filter(m => m.classId === classId)}
        attendance={attendance.filter(a => a.classId === classId)}
        onClose={handleEndClass}
        onEndClass={handleEndClass}
        onSendChatMessage={handleSendChatMessage}
        chatInput={chatInput}
        onChatInputChange={setChatInput}
      />
    </div>
  );
}

