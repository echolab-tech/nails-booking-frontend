"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { CategoryType } from "@/types/Category";
import { getServcieSummaryById } from "@/services/service-summary.service";
import ApointmentOverview from "./ApointmentOverview";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepAddCategoryProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepAddCategory = ({ handleBack, handleNext }: StepAddCategoryProps) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const { state, dispatch } = useAppointment();

  useEffect(() => {
    const currentAppointment =
      state.appointments[state.currentAppointmentIndex];
    if (currentAppointment?.serviceSummary?.id) {
      fetchCategories(currentAppointment.serviceSummary.id);
    }
  }, [state.currentAppointmentIndex]);

  const fetchCategories = async (id: string) => {
    try {
      const result = await getServcieSummaryById(id);
      setCategories(result?.data?.data?.service_categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleButtonClick = (serviceCategory: CategoryType) => {
    // Dispatch action để cập nhật category cho appointment hiện tại
    dispatch({
      type: "SET_SERVICE_CATEGORY",
      payload: serviceCategory,
    });

    handleNext();
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <ApointmentOverview />
      </div>
      <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="space-y-1">
          <h3 className="mb-1 text-2xl font-bold text-primary">
            Select category
          </h3>
          <p className="text-primary">
            Please select the category we need to serve first person
          </p>
        </div>
        <div className="mb-4 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {categories?.map((category: CategoryType, index: number) => (
            <div className="col-span-12 xl:col-span-6" key={index}>
              <button
                onClick={() => handleButtonClick(category)}
                className="text-dark flex w-full justify-between rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:border-primary hover:bg-gray-2"
              >
                {category?.name}
                <MdArrowForwardIos size={20} />
              </button>
            </div>
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
    </div>
  );
};

export default StepAddCategory;
