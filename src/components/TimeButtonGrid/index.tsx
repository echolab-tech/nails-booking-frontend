import React, { useEffect, useState } from "react";
import {
  format,
  addMinutes,
  setHours,
  setMinutes,
  isWithinInterval,
} from "date-fns";

const generateTimeSlots = (startHour: any, endHour: any, interval: any) => {
  let timeSlots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      if (hour === endHour && minute > 0) break;
      timeSlots.push(setMinutes(setHours(new Date(), hour), minute));
    }
  }
  return timeSlots;
};

const TimeButtonGrid = ({
  selectedDate,
  onTimeSelect,
  selectedTime,
  bookedTimes,
}: any) => {
  const [disabledTimes, setDisabledTimes] = useState<any>([]);
  const morningSlots = generateTimeSlots(7, 12, 15); // 7:00 AM to 12:45 PM
  const afternoonSlots = generateTimeSlots(13, 18, 15); // 1:00 PM to 6:45 PM

  const handleTimeClick = (time: any) => {
    const selectedTime = format(time, "HH:mm");
    onTimeSelect(selectedDate, selectedTime); // Call the callback with the selected date and time
  };

  useEffect(() => {
    // Chuyển đổi dữ liệu bookedTimes thành mảng thời gian để so sánh
    const bookedIntervals = bookedTimes.map(({ start_time, end_time }: any) => ({
      start: new Date(start_time),
      end: new Date(end_time),
    }));
    setDisabledTimes(bookedIntervals);
  }, [bookedTimes]);

  const isTimeDisabled = (time: any) => {
    return disabledTimes.some(({ start, end }: any) =>
      isWithinInterval(time, { start, end })
    );
  };

  return (
    <div className="mt-4">
      <div>
        <h2 className="mb-2">Morning</h2>
        <div className="grid grid-cols-7 gap-2">
          {morningSlots.map((time, index) => (
            <button
              key={index}
              className={`p-2 border ${
                selectedTime === format(time, "HH:mm")
                  ? "border-primary bg-green-50"
                  : "border-stroke"
              } rounded-lg ${
                isTimeDisabled(time) ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              onClick={() => handleTimeClick(time)}
            >
              {format(time, "h:mm a")}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="mb-2">Afternoon</h2>
        <div className="grid grid-cols-7 gap-2">
          {afternoonSlots.map((time, index) => (
            <button
              type="button"
              key={index}
              className={`p-2 border ${
                selectedTime === format(time, "HH:mm")
                  ? "border-primary bg-green-50"
                  : "border-stroke"
              } rounded-lg ${
                isTimeDisabled(time) ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              disabled={isTimeDisabled(time)}
              onClick={() => !isTimeDisabled(time) && handleTimeClick(time)}
            >
              {format(time, "h:mm a")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeButtonGrid;
