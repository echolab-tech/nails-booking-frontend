import React, { useState } from "react";
import {
  addDays,
  subDays,
  startOfWeek,
  format,
  isToday,
  isWeekend,
  getDay,
} from "date-fns";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";

const CalendarStripCard = ({ onDateSelect }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  const [animationDirection, setAnimationDirection] = useState("");

  const getDateRange = (startDate: any) => {
    let dateArray = [];
    for (let i = 0; i < 14; i++) {
      dateArray.push(addDays(startDate, i));
    }
    return dateArray;
  };

  const handlePrev = () => {
    setCurrentDate(subDays(currentDate, 14));
  };

  const handleNext = () => {
    setCurrentDate(addDays(currentDate, 14));
  };

  const handleDateClick = (date: any) => {
    setSelectedDate(format(date, "dd-MM-yyyy"));
    onDateSelect(date); // Call the callback with the selected date
  };

  const dateRange = getDateRange(currentDate);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startDayIndex = getDay(currentDate);

  const orderedDaysOfWeek = [
    ...daysOfWeek.slice(startDayIndex),
    ...daysOfWeek.slice(0, startDayIndex),
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2">
        <button
          onClick={handlePrev}
          className="bg-green-50 flex justify-center items-center border border-primary w-[50px] h-[50px] self-center text-primary p-2 rounded-md"
        >
          <FaLongArrowAltLeft />
        </button>
        <div className="flex flex-col border border-stroke rounded-lg bg-white w-full">
          <div className="flex justify-between bg-stroke p-4 mb-4 items-center">
            {orderedDaysOfWeek
              .concat(orderedDaysOfWeek)
              .slice(0, 14)
              .map((day, index) => (
                <div
                  key={index}
                  className={`text-center ${
                    day === "Sat" || day === "Sun" ? "text-red-500" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
          </div>
          <div className="flex justify-between p-4 gap-2">
            {dateRange.map((date, index) => (
              <div
                key={index}
                className={`p-2 cursor-pointer ${
                  selectedDate == format(date, "dd-MM-yyyy")
                    ? "bg-green-50 border border-primary rounded-lg shadow-lg"
                    : "border border-transparent"
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div
                  className={`text-lg font-bold ${
                    isWeekend(date) ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {format(date, "d")}
                </div>
                <div className="text-sm text-gray-500">
                  {format(date, "MMM")}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          className="bg-green-50 flex justify-center items-center border w-[50px] h-[50px] self-center text-primary border-primary p-2 rounded-md"
        >
          <FaLongArrowAltRight />
        </button>
      </div>
    </div>
  );
};

export default CalendarStripCard;
