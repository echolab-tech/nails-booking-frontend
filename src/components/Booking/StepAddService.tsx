"use client";
import React, { useEffect, useState } from "react";
import { FcBusinessman, FcIdea } from "react-icons/fc";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { CategoryType } from "../../types/Category";
import { MdArrowForwardIos } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { Tooltip } from "flowbite-react";
import { getCategoryById } from "@/services/categories.service";
import { serviceTypeNew } from "@/types/ServiceNew";
import ApointmentOverview from "./ApointmentOverview";
import { serviceType } from "@/types/service";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepAddServiceProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepAddService = ({ handleBack, handleNext }: StepAddServiceProps) => {
  const [serviceOptions, setServiceOptions] = useState<serviceType[]>([]);
  const { state, dispatch } = useAppointment();

  useEffect(() => {
    fetchService();
  }, [state.currentAppointmentIndex]);

  const fetchService = async () => {
    try {
      const currentAppointment =
        state.appointments[state.currentAppointmentIndex];
      if (currentAppointment?.serviceCategory?.id) {
        const result = await getCategoryById(
          currentAppointment.serviceCategory.id,
        );
        setServiceOptions(result?.data?.data?.service_options);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleSelectService = (service: serviceType) => {
    // Dispatch action để cập nhật service cho appointment hiện tại
    dispatch({
      type: "SET_SERVICE",
      payload: service,
    });

    handleNext();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full space-y-2 rounded-lg bg-lime-50 p-10">
        <ApointmentOverview />
      </div>
      <div className="w-full rounded-lg bg-white p-10 shadow-lg">
        <h3 className="mb-3 text-2xl text-primary">Please choose a service</h3>
        <div className="mb-4 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <div className="col-span-12">
            {serviceOptions?.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelectService(item)}
                className="text-dark mb-5 flex w-full justify-between rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:border-primary hover:bg-gray-2"
              >
                <div className="flex">
                  <p className="font-bold">{item?.title}</p>
                  <Tooltip
                    content={item?.description}
                    style="dark"
                    trigger="hover"
                    className="w-[300px]"
                  >
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <IoIosHelpCircleOutline size={20}/>
                    </span>    
              </Tooltip>
                  <div className="ml-5 flex">
                    <p>{item?.option_name}</p>
                    <div className="flex">
                      {formatPrice(Number(item?.price))}
                    </div>
                  </div>
                </div>
                <MdArrowForwardIos size={20} />
              </button>
            ))}
            {serviceOptions?.length === 0 && (
              <p className="text-gray-500 text-center">
                No service options available for this category
              </p>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default StepAddService;
