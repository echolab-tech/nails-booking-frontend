"use client";
import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

interface Props {
  hours: string[];
  employees: string[];
}
const events = [
  {
    resourceId: "b",
    title: "event 3",
    start: "2024-05-12T12:00:00+00:00",
    end: "2024-05-13T06:00:00+00:00",
  },
  {
    resourceId: "c",
    title: "event 4",
    start: "2024-05-12T07:30:00+00:00",
    end: "2024-05-12T09:30:00+00:00",
  },
  {
    resourceId: "d",
    title: "event 5",
    start: "2024-05-12T10:00:00+00:00",
    end: "2024-05-12T15:00:00+00:00",
  },
  {
    resourceId: "a",
    title: "event 2",
    start: "2024-05-12T09:00:00+00:00",
    end: "2024-05-12T14:00:00+00:00",
  },
];

const renderEventContent = (eventInfo: any) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

const FullCalenDarCustom: React.FC<any> = () => {
  useEffect(() => {}, []);
  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  const handleEventClick = (arg: any) => {
    console.log(arg.event.title);
  };

  const handleSelectDate = (info: any) => {
    alert("selected " + info.startStr + " to " + info.endStr);
  };

  const handleResize = (info: any) => {
    alert(info.event.title + " end is now " + info.event.end.toISOString());

    if (!confirm("is this okay?")) {
      info.revert();
    }
  };

  const handleDrop = (info: any) => {
    console.log(info.event);
  };

  return (
    <FullCalendar
      eventBackgroundColor="#06b6d4"
      eventBorderColor="#06b6d4"
      slotDuration="00:15:00"
      slotLabelInterval="00:30"
      allDaySlot={false}
      nowIndicator={true}
      schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      selectable={true}
      editable={true}
      events={events}
      plugins={[resourceTimeGridPlugin, interactionPlugin, bootstrap5Plugin]}
      eventContent={renderEventContent}
      eventClick={handleEventClick}
      initialView="resourceTimeGridDay"
      resources={[
        { id: "a", title: "Room A" },
        { id: "b", title: "Room B" },
        { id: "c", title: "Room C" },
        { id: "d", title: "Room D" },
      ]}
      //dateClick={handleDateClick}
      select={handleSelectDate}
      eventResize={handleResize}
      eventDrop={handleDrop}
    />
  );
};

export default FullCalenDarCustom;
