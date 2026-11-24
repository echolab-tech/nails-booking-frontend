"use client";
import React from "react";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepUpdateStarttimeProps {
  handleNext: () => void;
}

/**
 * Miro Frame 1 #85 / #10:
 * - Mặc định hiện đúng ngày & giờ khách đã book.
 * - Ngày và giờ là 2 ô riêng (lớn, dễ chọn): chỉ đổi giờ thì giữ nguyên ngày, và ngược lại.
 */
const StepUpdateStarttime = ({ handleNext }: StepUpdateStarttimeProps) => {
  const { state, dispatch } = useAppointment();

  // selectedTime dạng "YYYY-MM-DDTHH:mm:ss[offset]"
  const selected = state.selectedTime || "";
  const datePart = selected.substring(0, 10);
  const timePart = selected.substring(11, 16);
  const offset = selected.length > 19 ? selected.substring(19) : "";

  const update = (date: string, time: string) => {
    if (!date || !time) return;
    dispatch({
      type: "SET_SELECTED_TIME",
      payload: `${date}T${time}:00${offset}`,
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <h3 className="text-2xl font-bold text-primary">Change Date &amp; Time</h3>
        <p className="text-primary">
          The current date and time of this appointment are shown below. Change
          the date, the time, or both.
          <br />
          If no changes, please press the Next button.
        </p>
      </div>
      <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="start-date"
              className="block text-lg font-semibold text-primary"
            >
              Date
            </label>
            <input
              type="date"
              id="start-date"
              value={datePart}
              className="w-full rounded border border-stroke px-4 py-4 text-xl text-dark"
              onChange={(e) => update(e.target.value, timePart)}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="start-time"
              className="block text-lg font-semibold text-primary"
            >
              Time
            </label>
            <input
              type="time"
              id="start-time"
              step={300}
              value={timePart}
              className="w-full rounded border border-stroke px-4 py-4 text-xl text-dark"
              onChange={(e) => update(datePart, e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => handleNext()}
            className="rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepUpdateStarttime;
