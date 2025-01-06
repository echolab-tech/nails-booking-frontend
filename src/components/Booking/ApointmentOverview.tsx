"use client";
import React, { useEffect, useState } from "react";

import { FaCircleCheck } from "react-icons/fa6";

import DateTimeCard from "./DateTimeCard";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FcBusinessman } from "react-icons/fc";

const ApointmentOverview = ({ formik }) => {
  useEffect(() => {
    console.log(formik?.values);
  }, []);

  return (
    <>
      {formik?.values?.appointments.map((item: any, index: number) => (
        <div
          key={index}
          className="flex flex-col space-x-2 rounded-lg border border-primary px-4 py-2"
        >
          <div className="flex items-center ">
            <div className="flex items-center justify-center">
              <FcBusinessman className="h-[40px] w-[40px]" />
            </div>
            <span className="text font-medium">{item?.customer?.name}</span>
            <span className="text font-medium">{item?.customer?.phone}</span>
          </div>
          <p>Service summary: {item?.serviceSummary?.name}</p>
          <p>Service category: {item?.serviceCategory?.name}</p>
          <p>Main Service: {item?.service?.title}</p>
          <p>Sub Services</p>
          {item?.other_services?.map((item: any, index: number) => (
            <p key={index}>{item?.name}</p>
          ))}
        </div>
      ))}
    </>
  );
};

export default ApointmentOverview;
