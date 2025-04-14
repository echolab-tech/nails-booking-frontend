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

const ConfirmBooking = ({ handleBack, handleNext, formik }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {}, []);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleBooking = () => {
    setIsLoading(true);
    appointmentsPost(formik.values).then((result: any) => {
      setIsLoading(false);
      handleNext(result?.data?.data?.id);
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
