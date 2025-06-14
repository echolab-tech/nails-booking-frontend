"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import ApointmentOverview from "./ApointmentOverview";
import { getService } from "@/services/service.service";
import { formatPrice } from "../common/format_currency";
import { useAppointment } from "@/contexts/AppointmentContext";

interface SubService {
  id: string;
  name: string;
  price: number;
  description: string;
  time: string;
}

interface StepAddSubServiceProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepAddSubService = ({
  handleBack,
  handleNext,
}: StepAddSubServiceProps) => {
  const [availableSubServices, setAvailableSubServices] = useState<
    SubService[]
  >([]);
  const { state, dispatch } = useAppointment();

  useEffect(() => {
    const currentAppointment =
      state.appointments[state.currentAppointmentIndex];
    if (currentAppointment?.service?.service_id) {
      fetchSubService(currentAppointment.service.service_id);
    }
  }, [state.currentAppointmentIndex]);

  const fetchSubService = async (id: string) => {
    try {
      const result = await getService(id);
      setAvailableSubServices(result?.data?.data?.subServices);
    } catch (error) {
      console.error("Error fetching sub services:", error);
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    subService: SubService,
  ) => {
    const isChecked = event.target.checked;
    console.log(subService);

    const subServicePayload = {
      id: subService.id,
      name: subService.name,
      price: subService.price,
      duration: subService.time,
    };

    dispatch({
      type: "UPDATE_SUB_SERVICES",
      payload: {
        subService: subServicePayload,
        isChecked,
      },
    });
  };

  const isSubServiceSelected = (subServiceId: string) => {
    const currentAppointment =
      state.appointments[state.currentAppointmentIndex];
    return currentAppointment?.subServices?.some(
      (service: SubService) => service.id === subServiceId,
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <ApointmentOverview />
      </div>

      <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div className="space-y-1">
          <h3 className="mb-1 text-2xl font-bold text-primary">
            Please choose the add-on service(s).
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
                  checked={isSubServiceSelected(item.id)}
                  onChange={(e) => handleCheckboxChange(e, item)}
                  className="dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-6 w-6 rounded border-2 border-stroke bg-transparent text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor={`checkbox-${index}`}
                  className="me-4 ms-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  <p className="font-bold">{item?.name}</p>
                  <p>{item?.description}</p>
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
