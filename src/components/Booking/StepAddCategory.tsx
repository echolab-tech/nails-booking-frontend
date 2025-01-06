"use client";
import React, { useState, useEffect } from "react";
import { FcBusinessman } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { CategoryType } from "@/types/Category";
import { getServcieSummaryById } from "@/services/service-summary.service";
import ApointmentOverview from "./ApointmentOverview";

const StepAddCategory = ({ handleBack, handleNext, formik }: any) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(
      formik.values.appointments[formik.values.bookingIndex]?.serviceSummary
        ?.id,
    );
  }, []);

  const fetchCategories = async (id: string) => {
    getServcieSummaryById(id).then((result) => {
      setCategories(result?.data?.data?.service_categories);
    });
  };

  const handleButtonClick = (serviceCategory: CategoryType) => {
    const updatedBookings = formik.values.appointments.map((booking, index) =>
      index === formik.values.bookingIndex
        ? { ...booking, serviceCategory }
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
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <ApointmentOverview formik={formik} />
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
          {categories?.map((category: any, index: number) => (
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
