"use client";
import React, { useEffect, useState } from "react";
import { CustomerType } from "../../types/customer";
import { FaArrowLeft } from "react-icons/fa";
import { getAllCustomer } from "@/services/customer.service";

const StepAddCustomer = ({ handleNext, handleBackToCalendar, formik }: any) => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await getAllCustomer("");
      setCustomerData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleButtonClick = (customer: CustomerType) => {
    const newAppointment = {
      customer: { ...customer },
      service: {},
      otherServices: [],
      serviceSummary: {},
      serviceCategory: {},
    };

    const newValues = {
      ...formik.values,
      appointments: [...formik.values.appointments, newAppointment], // Thêm booking mới
    };

    // Cập nhật Formik và lưu vào sessionStorage
    formik.setValues(newValues);
    sessionStorage.setItem("bookingFormData", JSON.stringify(newValues));

    // Chuyển qua step tiếp theo
    handleNext();
  };

  return (
    <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-2xl font-bold text-primary">
            Select customer
          </h3>
          <p className="text-sm">Please select the customer we need to serve</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {customerData?.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            className={`text-dark flex w-full items-center rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:bg-gray-2`}
          >
            <span className="text-lg font-medium">{item?.name}</span>
            <span className="text-lg font-medium">{item?.phone}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackToCalendar}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>
    </div>
  );
};

export default StepAddCustomer;
