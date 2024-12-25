"use client";
import React, { useEffect, useState } from "react";
import { ServiceSummaryType } from "../../types/ServiceSummary";
import { getListServiceSummary } from "../../services/categories.service";
import { FaArrowLeft } from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";

const StepAddSummaryService = ({ handleNext, handleBack, formik }: any) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummaryType[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingFormData');
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
    getListServiceSummary().then((result) => {
      setServiceSummary(result?.data?.data);
    });
  };

  const handleButtonClick = (serviceSummary: ServiceSummaryType) => {
    setSelectedButton(serviceSummary.name);
    
    const newValues = {
      ...formik.values,
      appointment_type: {
        ...serviceSummary,
        id: serviceSummary.id
      },
    };
    
    formik.setValues(newValues);
    sessionStorage.setItem('bookingFormData', JSON.stringify(newValues));
    handleNext();
  };

  return (
    <div className="p-10 bg-white w-full rounded-lg shadow-lg space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl text-primary mb-1 font-bold">
            Select service summary
          </h3>
          <p className="text-primary text-sm">
            Please select the category we need to serve first person
          </p>
        </div>

        <div className="flex items-center space-x-2 border border-primary rounded-lg px-4 py-2">
          <div className="flex items-center justify-center">
            <FcBusinessman className="w-[40px] h-[40px]" />
          </div>
          <span className="font-medium text">{formik.values.customer_name}</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {serviceSummary?.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            className={`w-full flex items-center bg-transparent hover:bg-gray-2 text-dark font-semibold py-4 px-4 border border-stroke rounded ${
              selectedButton === item.name
                ? "border-primary bg-primary-light text-primary"
                : "border-gray-200 text-gray-700 hover:border-primary"
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
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>
    </div>
  );
};

export default StepAddSummaryService;
