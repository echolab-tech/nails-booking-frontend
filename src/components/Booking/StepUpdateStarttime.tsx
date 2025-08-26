"use client";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepUpdateStarttimeProps {
  handleNext: () => void;
}

const StepUpdateStarttime = ({ handleNext }: StepUpdateStarttimeProps) => {
  const { state, dispatch } = useAppointment();

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    dispatch({ type: "SET_SELECTED_TIME", payload: selectedDate });
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <h3 className="text-2xl font-bold text-primary">Change Start Time</h3>
        <p className="text-primary">
          Do you want to change the start time? Please select a new date and time below.
          <br/>
          If no changes, please skip and press the Next button.
        </p>
      </div>
      <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="space-y-4">
          <label htmlFor="start-time" className="block text-lg font-semibold text-primary">
            Select Start Time
          </label>
          <input
            type="datetime-local"
            id="start-time"
            className="w-full rounded border border-stroke px-4 py-2 text-dark"
            onChange={handleDateChange}
          />
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