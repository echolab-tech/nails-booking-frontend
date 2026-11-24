"use client";
import React from "react";
import { FcBusinessman } from "react-icons/fc";
import { useAppointment } from "@/contexts/AppointmentContext";

const ApointmentOverview = () => {
  const { state, dispatch } = useAppointment();

  // Miro Frame 1 #46: nút X hủy 1 service đã chọn; các service sau của cùng khách tự dời lên
  const handleRemove = (index: number) => {
    if (state.appointments.length <= 1) return;
    if (!window.confirm("Are you sure to delete this service?")) return;
    dispatch({ type: "REMOVE_APPOINTMENT", payload: index });
  };

  // Miro Frame 1 #46: nút Edit quay lại chọn lại service cho đúng dòng này
  const handleEdit = (index: number) => {
    dispatch({ type: "SET_APPOINTMENT_INDEX", payload: index });
    dispatch({ type: "SET_STEP", payload: 2 });
  };

  function formatFullDateTime(isoString: string) {
    const date = new Date(isoString);
  
    if (isNaN(date.getTime())) {
      return "";
    }
  
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // tháng từ 0
    const year = date.getFullYear();
  
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  

  return (
    <>
      {state.appointments.map((appointment, index) => (
        <div
          key={index}
          className="relative flex flex-col space-x-2 rounded-lg border border-primary px-4 py-2 mb-2"
        >
          {state.appointments.length > 1 && (
            <button
              type="button"
              aria-label="Remove this service"
              title="Remove this service"
              onClick={() => handleRemove(index)}
              className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600"
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={() => handleEdit(index)}
            className="absolute right-2 top-2 rounded border border-primary px-2 py-0.5 text-xs text-primary hover:bg-primary hover:text-white"
          >
            Edit
          </button>
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
                <span className="font-medium">Time:</span> {state.appointments[index]?.startTime}
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
             <>
               <p className="text-sm">
                <span className="font-medium">Main Service:</span>{" "}
                {appointment?.service?.title}
              </p>
              <p>Start time: {formatFullDateTime(appointment.service.startTime)}</p>
              <p>End time: {formatFullDateTime(appointment.service.endTime)}</p>
             </>
            )}

            {/* Sub Services */}
            {appointment.subServices && appointment.subServices.length > 0 && (
              <div>
                <p className="text-sm font-medium">Sub Services:</p>
                <ul className="ml-4 list-disc">
                  {appointment.subServices.map((subService, subIndex) => (
                    <li key={subIndex} className="text-sm">
                      {subService?.name}
                      <p>Start time: {formatFullDateTime(subService?.startTime)}</p>
                      <p>End time: {formatFullDateTime(subService?.endTime)}</p>
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
