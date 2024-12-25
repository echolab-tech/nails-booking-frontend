"use client";
import React, { useEffect, useState } from "react";

import { FaCircleCheck } from "react-icons/fa6";

import DateTimeCard from "./DateTimeCard";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CompleteBooking = ({ formik }) => {
  const router = useRouter();
  useEffect(() => {}, []);

  return (
    <div className="p-10 bg-white w-full rounded-lg shadow-lg flex flex-col items-center">
      <h3 className="text-2xl text-primary mb-3">
        Thank you for your reservations
      </h3>
      <FaCircleCheck size={100} className="text-primary mt-10 mb-10" />
      <DateTimeCard date={formik?.values?.booking_time} />
      <p className="text-center mb-5 mt-5">
        Thank you for successfully booking with us! ,<br />
        We look forward to seeing you at your reserved time slot!
      </p>
      <button
        type="button"
        onClick={() => router.push("/appointments")}
        className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
      >
        View order history
        <FaArrowRight />
      </button>
    </div>
  );
};

export default CompleteBooking;
