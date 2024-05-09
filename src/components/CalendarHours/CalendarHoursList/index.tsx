"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

interface Props {
  hours: string[]; // Danh sách các giờ
  employees: string[]; // Danh sách các nhân viên
}

const CalendarHours: React.FC<Props> = ({ hours, employees }) => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (calendarRef.current) {
      const calendar = new Calendar(calendarRef.current, {
        plugins: [resourceTimeGridPlugin],
        timeZone: 'UTC',
        initialView: 'resourceTimeGridDay',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'resourceTimeGridDay,resourceTimeGridFourDay',
        },
        views: {
          resourceTimeGridFourDay: {
            type: 'resourceTimeGrid',
            duration: { days: 4 },
            buttonText: '4 days',
          },
        },
        resources: employees.map((employee, index) => ({
          id: index.toString(), // Sử dụng index như id tạm thời
          title: employee,
        })),
        events: getEvents(), // Sử dụng hàm getEvents để tạo sự kiện từ state schedule
        eventClick: handleEventClick, // Xử lý sự kiện khi click vào một sự kiện trên lịch
      });

      calendar.render();

      return () => {
        calendar.destroy();
      };
    }
  }, [employees, schedule]); // Effect này chạy mỗi khi danh sách nhân viên hoặc lịch trình thay đổi

  // Hàm để tạo sự kiện từ state schedule
  const getEvents = () => {
    const events: any[] = [];
    for (const [employeeId, slots] of Object.entries(schedule)) {
      slots.forEach((slot) => {
        events.push({
          resourceId: employeeId,
          start: slot,
          end: slot,
        });
      });
    }
    return events;
  };

  // Xử lý sự kiện khi click vào một sự kiện trên lịch
  const handleEventClick = (info: any) => {
    const employeeId = info.event.resourceId;
    const slot = info.event.start;
    const updatedSchedule = { ...schedule };
    if (!updatedSchedule[employeeId]) {
      updatedSchedule[employeeId] = [];
    }
    updatedSchedule[employeeId].push(slot);
    setSchedule(updatedSchedule);
  };

  return <div ref={calendarRef} />;
};

export default CalendarHours;
