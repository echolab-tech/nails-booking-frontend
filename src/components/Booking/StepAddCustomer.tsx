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
      setCustomerData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleButtonClick = (customer: string) => {
    setSelectedButton(customer);
    const newValues = {
      ...formik.values,
      customer_name: customer,
    };
    formik.setValues(newValues);
    sessionStorage.setItem("bookingFormData", JSON.stringify(newValues));
    handleNext();
  };

  return (
    <div className="p-10 bg-white w-full rounded-lg shadow-lg space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl text-primary mb-1 font-bold">
            Select customer
          </h3>
          <p className="text-primary text-sm">
            Please select the customer we need to serve
          </p>
        </div>

      </div>

      <div className="mt-4 space-y-4">
        { customerData?.map((item, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(item.name)}
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
          onClick={handleBackToCalendar}
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>
    </div>
  );
};

export default StepAddCustomer; 