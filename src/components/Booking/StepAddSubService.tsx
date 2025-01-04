"use client";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";
import { getSubServiceByServiceId } from "@/services/sub-service.service";

const StepAddSubService = ({ handleBack, handleNext, formik }: any) => {
  const [availableSubServices, setAvailableSubServices] = useState<any[]>([]);
  console.log("Formik values:", formik.values.services);

  useEffect(() => {
    fetchSubService(formik.values.services);
  }, []);

  const fetchSubService = async (id: any) => {
    const serviceId = formik.values.service;
    getSubServiceByServiceId(serviceId).then((data: any) => {
    });
  };

  const handleSubServiceSelect = (subService: any) => {
    formik.setFieldValue('services', [...formik.values.services, subService]);
    handleNext();
  };

  return (
    <div className="w-full space-y-6">
      <div className="p-10 bg-lime-50 w-full rounded-lg space-y-2">
        <div className="flex items-center border border-primary rounded-lg px-[13px] py-[20px] w-fit h-[50px] bg-white">
          <div className="flex items-center justify-center">
            <FcBusinessman className="w-[40px] h-[40px]" />
          </div>
          <span className="font-medium text">{formik.values.customer_name}</span>
        </div>
        <div>
          <p className="text mb-1">
            Service summary: <span className="text-primary">{formik.values.appointment_type}</span>
          </p>
          <p className="text mb-1">
            Category: <span className="text-primary">{formik.values.appointment_category}</span>
          </p>
          <p className="text mb-1">
            Service: <span className="text-primary">{formik.values.appointment_service}</span>
          </p>
        </div>
      </div>

      <div className="p-10 bg-white w-full rounded-lg shadow-lg space-y-8">
        <div className="space-y-1">
          <h3 className="text-2xl text-primary mb-1 font-bold">I want to order a service...</h3>
        </div>

        <ul>
          {availableSubServices?.map((service: any, index: number) => (
            <li
              key={index}
              className="border-b py-4 flex justify-between items-start last:border-b-0"
              onClick={() => handleSubServiceSelect(service)}
            >
              <div>
                <h3 className="font-semibold text-lg">{service.title}</h3>
                {service.description && (
                  <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                )}
              </div>
              <span className="text-gray-800 font-semibold">{service.price}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepAddSubService;
