"use client";
import React, { useEffect, useState } from "react";
import { ServiceSummaryType } from "../../types/ServiceSummary";
import { getListServiceSummary } from "../../services/categories.service";
import { FaArrowLeft } from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";
import ApointmentOverview from "./ApointmentOverview";
import { getServiceSummaries } from "@/services/service-summary.service";

const StepAddSummaryService = ({ handleNext, handleBack, formik }: any) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummaryType[]>(
    [],
  );

  useEffect(() => {
    const storedData = sessionStorage.getItem("bookingFormData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.appointment_type) {
        setSelectedButton(parsedData.appointment_type.name);
      }
      formik.setValues(parsedData);
    }
    fetchServiceSummary();
  }, []);

  const fetchServiceSummary = async () => {
    getServiceSummaries(null, true).then((result) => {
      setServiceSummary(result?.data?.data);
    });
  };

  const handleButtonClick = (serviceSummary: ServiceSummaryType) => {
    const updatedBookings = formik.values.appointments.map((booking, index) =>
      index === formik.values.bookingIndex
        ? { ...booking, serviceSummary }
        : booking,
    );

    const newValues = {
      ...formik.values,
      appointments: updatedBookings,
    };
    formik.setValues(newValues);
    sessionStorage.setItem("bookingFormData", JSON.stringify(newValues));
    handleNext();
  };

  return (
    <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
      <ApointmentOverview formik={formik} />
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
        {serviceSummary?.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            className={`text-dark flex w-full items-center rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:bg-gray-2 ${
              selectedButton === item.name
                ? "bg-primary-light border-primary text-primary"
                : "text-gray-700 border-gray-200 hover:border-primary"
            }`}
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
