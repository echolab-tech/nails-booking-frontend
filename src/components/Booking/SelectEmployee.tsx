"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Assistant } from "../../types/assistant";
import { getAssistantAvalible } from "../../services/assistants.service";
import ApointmentOverview from "./ApointmentOverview";
import { useAppointment } from "@/contexts/AppointmentContext";

interface SelectEmployeeProps {
  handleBack: () => void;
  handleNext: () => void;
}

const SelectEmployee = ({ handleBack, handleNext }: SelectEmployeeProps) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { state, dispatch } = useAppointment();

  useEffect(() => {
    fetchAssistants();
  }, [state.currentAppointmentIndex]);

  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const currentAppointment =
        state.appointments[state.currentAppointmentIndex];
      const serviceIds = Number(currentAppointment.service?.service_id);
      const subServiceIds = currentAppointment?.subServices?.map(
        (service: any) => Number(service.id),
      ) || [];

      const startTime = currentAppointment?.service?.startTime;
      
      let endTime = currentAppointment?.service?.endTime;
      if (currentAppointment?.subServices && currentAppointment.subServices.length > 0) {
        endTime = currentAppointment.subServices[currentAppointment.subServices.length - 1].endTime;
      }

      const result = await getAssistantAvalible(
        serviceIds, 
        subServiceIds,
        startTime,
        endTime
      );
      setAssistants(result?.data?.data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssistantClick = (assistant: Assistant) => {
    setSelectedAssistant(assistant.id);
    dispatch({
      type: "SET_ASSISTANT",
      payload: assistant,
    });
  };

  return (
    <div className="w-full rounded-lg bg-white p-10 shadow-lg">
      <h3 className="mb-3 text-2xl text-primary">
        I want employee ... to do my nails
      </h3>
      <p className="mb-4">
        Please select the employee you prefer, or our will arrange the suitable
        employee.
      </p>
      <ApointmentOverview />
      <div className="my-10">
        <div className="grid grid-cols-12 gap-2">
          {!loading && assistants.length === 0 && (
            <div className="col-span-12 text-center text-red-500">
              No available technician found.
            </div>
          )}
          {assistants?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleAssistantClick(item)}
              className={`col-span-6 flex cursor-pointer cursor-pointer flex-col items-center gap-4 rounded-xl p-2 xl:col-span-3 ${
                selectedAssistant === item?.id
                  ? "border border-primary bg-green-50 shadow-lg"
                  : "border border-transparent"
              }`}
            >
              <img
                src={item?.avatar || ""}
                alt={`${item?.name}'s avatar`}
                className="h-[150px] w-[150px] rounded-full object-cover"
              />
              <h3>{item?.name}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedAssistant}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          Next
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default SelectEmployee;
