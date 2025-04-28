"use client";
import React, { useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import { RiErrorWarningFill } from "react-icons/ri";
import { Spinner } from "flowbite-react";
import DateTimeCard from "./DateTimeCard";
import { appointmentsPost } from "../../services/appointment.service";
import ApointmentOverview from "./ApointmentOverview";
import { useAppointment } from "@/contexts/AppointmentContext";

const ConfirmBooking = ({ handleBack, handleNext, formik }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state } = useAppointment();
  useEffect(() => {}, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  interface Customer {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  }
  
  interface Service {
    id: string;
    title: string;
    price: number;
    duration: number;
    startTime: string;
    endTime: string;
  }
  
  interface ServiceCategory {
    id: string;
    name: string;
  }
  
  interface ServiceSummary {
    id: string;
    name: string;
  }
  
  interface SubService {
    id: string;
    name: string;
    price: number;
    duration: number;
    startTime: string;
    endTime: string;
  }
  
  interface Assistant {
    id: string;
    name: string;
    avatar?: string;
  }
  
  interface Appointment {
    customer?: Customer;
    service?: Service | null;
    subServices?: SubService[];
    assistant?: Assistant | null;
    serviceCategory?: ServiceCategory | null;
    serviceSummary?: ServiceSummary | null;
    startTime?: string;
    endTime?: string;
    price?: number;
    duration?: number;
  }
  
  interface AppointmentState {
    currentStep: number;
    selectedTime: string;
    appointments: Appointment[];
    currentAppointmentIndex: number;
    appointmentType: "single" | "group" | null;
  }

  function transformFormData(state: AppointmentState) {
    const formData = {
      currentStep: state.currentStep,
      selectedTime: state.selectedTime,
      appointmentType: state.appointmentType,
      currentAppointmentIndex: state.currentAppointmentIndex,
      appointments: state.appointments.map((apt) => ({
        customer: apt.customer ? {
          id: apt.customer.id,
          name: apt.customer.name,
          email: apt.customer.email,
          phone: apt.customer.phone,
        } : null,
        service: apt.service ? {
          id: apt.service.id,
          title: apt.service.title,
          price: apt.service.price,
          duration: apt.service.duration,
          startTime: apt.service.startTime,
          endTime: apt.service.endTime,
        } : null,
        subServices: apt.subServices?.map((sub: any) => ({
          id: sub.id,
          name: sub.name,
          price: sub.price,
          duration: sub.duration,
          startTime: sub.startTime,
          endTime: sub.endTime,
        })) || [],
        assistant: apt.assistant ? {
          id: apt.assistant.id,
          name: apt.assistant.name,
          avatar: apt.assistant.avatar,
        } : null,
        serviceCategory: apt.serviceCategory ? {
          id: apt.serviceCategory.id,
          name: apt.serviceCategory.name,
        } : null,
        serviceSummary: apt.serviceSummary ? {
          id: apt.serviceSummary.id,
          name: apt.serviceSummary.name,
        } : null,
        startTime: apt.startTime,
        endTime: apt.endTime,
        price: apt.price,
        duration: apt.duration,
      })),
    };
  
    return formData;
  }  

  const handleBooking = () => {
    setIsLoading(true);
    const formData = transformFormData(state);
    console.log(formData);
    
    appointmentsPost(formData)
    .then((result: any) => {
      setIsLoading(false);
      handleNext(result?.data?.data?.id);
    })
    .catch((error) => {
      setIsLoading(false);
      console.error(error);
    });
  };

  return (
    <div className="w-full rounded-lg bg-white p-10 shadow-lg">
      <h3 className="mb-3 text-2xl text-primary">
        Confirm your booking request
      </h3>
      <div className="mb-4 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 rounded-xl border border-stroke p-10 xl:col-span-6">
          <ApointmentOverview/>
        </div>
        <div className="col-span-12 rounded-xl border border-stroke p-5 xl:col-span-6">
          <div className="mb-2 flex items-center">
            <FcCalendar size={30} />
            Date time
          </div>
          <div className="mb-2 flex items-center gap-4">
            <RiErrorWarningFill size={30} fill="#FEC84B" />
            Please remember your reserved time and arrive on time. Thank you
            very much
          </div>
          <DateTimeCard date={formik?.values?.startTime} />
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
        <button
          type="button"
          onClick={handleBooking}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          {isLoading && <Spinner />}
          Reservations
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
