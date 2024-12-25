"use client";
import React, { useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FcCalendar } from "react-icons/fc";
import { RiErrorWarningFill } from "react-icons/ri";
import { Spinner } from "flowbite-react";
import DateTimeCard from './DateTimeCard';
import { appointmentsPost } from "../../services/appointment.service";

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
    <div className="p-10 bg-white w-full rounded-lg shadow-lg">
      <h3 className="text-2xl text-primary mb-3">
        Confirm your booking request
      </h3>
      <div className="mt-4 mb-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-6 border border-stroke p-10 rounded-xl">
          {formik?.values?.services?.map((item: any, index: number) => (
            <div
              className="flex justify-between items-center border-b border-stroke py-2"
              key={index}
            >
              <div>
                <p className="font-bold">{item?.title}</p>
                <p>{item?.option_name}</p>
              </div>
              <b className="text-primary font-bold">
                {formatPrice(Number(item.price))}
              </b>
            </div>
          ))}
        </div>
        <div className="col-span-12 xl:col-span-6 border border-stroke p-5 rounded-xl">
          <div className="flex items-center mb-2">
            <FcCalendar size={30} />
            Date time
          </div>
          <div className="flex gap-4 items-center mb-2">
            <RiErrorWarningFill size={30} fill="#FEC84B" />
            Please remember your reserved time and arrive on time. Thank you
            very much
          </div>
          <DateTimeCard date={formik?.values?.booking_time} />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
        <button
          type="button"
          onClick={handleBooking}
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
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
