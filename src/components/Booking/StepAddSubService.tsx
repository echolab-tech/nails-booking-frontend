"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";
import ApointmentOverview from "./ApointmentOverview";
import { getService } from "@/services/service.service";
import { formatPrice } from "../common/format_currency";
import { FaArrowRight } from "react-icons/fa6";

const StepAddSubService = ({ handleBack, handleNext, formik }: any) => {
  const [availableSubServices, setAvailableSubServices] = useState<any[]>([]);

  useEffect(() => {
    const serviceId =
      formik.values?.appointments[formik.values.bookingIndex]?.service
        ?.service_id;
    fetchSubService(serviceId);
    console.log(formik.values);
  }, [formik.values]);

  const fetchSubService = async (id: any) => {
    getService(id).then((result) => {
      setAvailableSubServices(result?.data?.data?.subServices);
    });
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: any,
  ) => {
    const isChecked = event.target.checked;
    const bookingIndex = formik.values.bookingIndex;

    // Lấy danh sách otherServices của booking hiện tại
    let selectedServices = [
      ...(formik.values.appointments[bookingIndex]?.otherServices || []),
    ];

    if (isChecked) {
      // Thêm dịch vụ vào danh sách nếu chưa có
      if (!selectedServices.some((service) => service.id === option.id)) {
        selectedServices.push(option);
      }
    } else {
      // Xóa dịch vụ khỏi danh sách nếu đã có
      selectedServices = selectedServices.filter(
        (service) => service.id !== option.id,
      );
    }

    // Cập nhật lại otherServices cho booking hiện tại
    formik.setFieldValue(
      `appointments[${bookingIndex}].otherServices`,
      selectedServices,
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <ApointmentOverview formik={formik} />
      </div>

      <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="space-y-1">
          <h3 className="mb-1 text-2xl font-bold text-primary">
            I want to order a service...
          </h3>
        </div>

        <div className="col-span-12">
          {availableSubServices?.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex w-full items-center justify-between border-b border-stroke py-4"
            >
              <div className="flex">
                <input
                  id={`checkbox-${index}`}
                  type="checkbox"
                  checked={formik.values.appointments[
                    formik.values.bookingIndex
                  ]?.otherServices.some(
                    (other_service: any) => other_service.id === item.id,
                  )}
                  onChange={(e) => handleCheckboxChange(e, item)}
                  className="dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-6 w-6 rounded border-2 border-stroke bg-transparent text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor={`checkbox-${index}`}
                  className="me-4 ms-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <p className="font-bold">{item?.name}</p>
                  <p>{item?.discription}</p>
                </label>
              </div>
              <div className="flex">{formatPrice(Number(item?.price))}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white"
          >
            <FaArrowLeft />
            Back
          </button>
          <button
            onClick={handleNext}
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
          >
            Next
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepAddSubService;
