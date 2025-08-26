"use client";
import React, { useEffect, useState } from "react";
import { ServiceSummaryType } from "../../types/ServiceSummary";
import { FaArrowLeft } from "react-icons/fa";
import ApointmentOverview from "./ApointmentOverview";
import { getServiceSummaries } from "@/services/service-summary.service";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepAddSummaryServiceProps {
  handleNext: () => void;
  handleBack: () => void;
  isEdit: boolean;
}

const StepAddSummaryService = ({
  handleNext,
  handleBack,
  isEdit,
}: StepAddSummaryServiceProps) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummaryType[]>(
    [],
  );
  const { state, dispatch } = useAppointment();

  useEffect(() => {
    // Kiểm tra serviceSummary hiện tại trong appointment
    const currentAppointment =
      state.appointments[state.currentAppointmentIndex];
    if (currentAppointment?.serviceSummary?.name) {
      setSelectedButton(currentAppointment.serviceSummary.name);
    }
    fetchServiceSummary();
  }, [state.currentAppointmentIndex]);

  const fetchServiceSummary = async () => {
    try {
      const result = await getServiceSummaries(null, true);
      setServiceSummary(result?.data?.data);
    } catch (error) {
      console.error("Error fetching service summaries:", error);
    }
  };

  const handleButtonClick = (serviceSummary: ServiceSummaryType) => {
    // Cập nhật service summary vào context
        dispatch({
      type: "SET_SERVICE_SUMMARY",
      payload: serviceSummary,
    });

    setSelectedButton(serviceSummary.name);
    handleNext();
  };

  const serviceSummaryId = state.appointments[state.currentAppointmentIndex]?.serviceSummary?.id;

  return (
    <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
      <ApointmentOverview />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-2xl font-bold text-primary">
            Select service summary
          </h3>
          <p className="text-sm text-primary">
            Please select the category we need to serve first person
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {serviceSummary
          ?.filter((item) => item.is_active)
          .map((item, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(item)}
              className={`text-dark flex w-full items-center rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:bg-gray-2 ${
                selectedButton === item.name
                  ? "bg-primary-light border-primary text-primary"
                  : "text-gray-700 border-gray-200 hover:border-primary"
                }${
                  serviceSummaryId === item.id ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={serviceSummaryId === item.id}
            >
              <span className="text-lg font-medium">{item.name}</span>
            </button>
          ))}
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
      </div>
    </div>
  );
};

export default StepAddSummaryService;
