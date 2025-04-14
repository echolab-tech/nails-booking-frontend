"use client";
import React from "react";
import { FcBusinessman } from "react-icons/fc";
import { useAppointment } from "@/contexts/AppointmentContext";

const ApointmentOverview = () => {
  const { state } = useAppointment();

  return (
    <>
      {state.appointments.map((appointment, index) => (
        <div
          key={index}
          className="flex flex-col space-x-2 rounded-lg border border-primary px-4 py-2 mb-2"
        >
          {/* Customer Information */}
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <FcBusinessman className="h-[40px] w-[40px]" />
            </div>
            <div className="ml-2 flex flex-col">
              {appointment.customer && (
                <>
                  <span className="text font-medium">
                    {appointment.customer.name}
                  </span>
                  <span className="text font-medium">
                    {appointment.customer.phone}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div className="mt-2 space-y-1">
            {/* Selected Time */}
            {state.selectedTime && (
              <p className="text-sm">
                <span className="font-medium">Time:</span> {state.selectedTime}
              </p>
            )}

            {/* Service Summary */}
            {appointment.serviceSummary && (
              <p className="text-sm">
                <span className="font-medium">Service Summary:</span>{" "}
                {appointment.serviceSummary.name}
              </p>
            )}

            {/* Service Category */}
            {appointment.serviceCategory && (
              <p className="text-sm">
                <span className="font-medium">Service Category:</span>{" "}
                {appointment.serviceCategory.name}
              </p>
            )}

            {/* Main Service */}
            {appointment.service && (
              <p className="text-sm">
                <span className="font-medium">Main Service:</span>{" "}
                {appointment.service.title}
              </p>
            )}

            {/* Sub Services */}
            {appointment.subServices && appointment.subServices.length > 0 && (
              <div>
                <p className="text-sm font-medium">Sub Services:</p>
                <ul className="ml-4 list-disc">
                  {appointment.subServices.map((subService, subIndex) => (
                    <li key={subIndex} className="text-sm">
                      {subService.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selected Employee */}
            {appointment.assistant && (
              <p className="text-sm">
                <span className="font-medium">Employee:</span>{" "}
                {appointment.assistant.name}
              </p>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ApointmentOverview;
