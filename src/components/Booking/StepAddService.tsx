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
import { CustomerServiceException, getCustomerExceptions } from "@/services/customer.service";

interface StepAddServiceProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepAddService = ({ handleBack, handleNext }: StepAddServiceProps) => {
  const [serviceOptions, setServiceOptions] = useState<serviceType[]>([]);
  const { state, dispatch } = useAppointment();
  // Miro Frame 1 #19: Exception của khách (thời gian / giá cộng thêm cho từng service)
  const [exceptions, setExceptions] = useState<CustomerServiceException[]>([]);
  const customerId = state.appointments[state.currentAppointmentIndex]?.customer?.id;

  useEffect(() => {
    fetchService();
  }, [state.currentAppointmentIndex]);

  useEffect(() => {
    if (!customerId) {
      setExceptions([]);
      return;
    }
    getCustomerExceptions(customerId)
      .then((res) => setExceptions(res?.data?.data ?? []))
      .catch(() => setExceptions([]));
  }, [customerId]);

  const exceptionFor = (item: any) =>
    exceptions.find((e) => String(e.service_id) === String(item?.service_id));

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
    // Miro Frame 1 #19: khách có Exception cho service này → tự cộng thêm thời gian và tiền
    const ex = exceptionFor(service);
    const payload: any = ex
      ? {
          ...(service as any),
          duration: Number((service as any)?.duration ?? 0) + Number(ex.extra_minutes || 0),
          price: Number((service as any)?.price ?? 0) + Number(ex.extra_price || 0),
          exception: ex,
        }
      : service;
    // Dispatch action để cập nhật service cho appointment hiện tại
    dispatch({
      type: "SET_SERVICE",
      payload,
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
                  {/* Miro Frame 1 #32: icon "?" xem description của service */}
                  {(item as any)?.description && (
                    <Tooltip
                      content={(item as any).description}
                      style="dark"
                      trigger="hover"
                      className="w-[300px]"
                    >
                      <span
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Service description"
                        className="ml-1 inline-flex cursor-pointer transition-transform hover:scale-110"
                      >
                        <IoIosHelpCircleOutline size={20} />
                      </span>
                    </Tooltip>
                  )}
                  <div className="ml-5 flex">
                    <p>{item?.option_name}</p>
                    <div className="flex">
                      {formatPrice(Number(item?.price))}
                    </div>
                  </div>
                  {exceptionFor(item) && (
                    <span
                      className="ml-4 rounded bg-orange-100 px-2 py-0.5 text-sm font-medium text-orange-700"
                      title={exceptionFor(item)?.note ?? ""}
                    >
                      This customer: +{exceptionFor(item)?.extra_minutes} min, +
                      {formatPrice(Number(exceptionFor(item)?.extra_price ?? 0))}
                    </span>
                  )}
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
