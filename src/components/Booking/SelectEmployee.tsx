"use client";
import React, { useEffect, useState } from "react";
import { FcIdea } from "react-icons/fc";
import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import IconUser from "./IconUser";
import IconGroup from "./IconGroup";
import { Assistant } from "../../types/assistant";
import {
  getAssistantAvalible,
  getAssistants,
} from "../../services/assistants.service";
import Image from "next/image";
import ApointmentOverview from "./ApointmentOverview";

const SelectEmployee = ({ handleBack, handleNext, formik }: any) => {
  useEffect(() => {
    fetchAssistants();
  }, []);
  const [selectedButton, setSelectedButton] = useState(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<number | null>(
    null,
  );

  const fetchAssistants = async () => {
    const bookingIndex = formik.values.bookingIndex;
    const serviceIds =
      formik.values.appointments[bookingIndex].service?.service_id;

    const subServiceIds = formik.values.appointments[
      bookingIndex
    ]?.otherServices.map((other_service: any) => other_service.id);
    getAssistantAvalible(serviceIds, subServiceIds).then((result) => {
      setAssistants(result?.data?.data);
    });
  };

  const handleAssistantClick = (assistantId: number) => {
    setSelectedAssistant(assistantId);
    formik.setFieldValue("assistant", assistantId);
  };

  return (
    <div className="w-full rounded-lg bg-white p-10 shadow-lg">
      <h3 className="mb-3 text-2xl text-primary">
        I want employee ... to do my nails
      </h3>
      <p className="mb-4">
        Please select the employee you prefer, or our will arrange the suitable
        employee.
      </p>
      <ApointmentOverview formik={formik} />
      <div className="my-10">
        <div className="grid grid-cols-12 gap-2">
          {assistants?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleAssistantClick(item?.id)}
              className={`col-span-6 flex cursor-pointer cursor-pointer flex-col items-center gap-4 rounded-xl p-2 xl:col-span-3 ${
                selectedAssistant === item?.id
                  ? "border border-primary bg-green-50 shadow-lg"
                  : "border border-transparent"
              }`}
            >
              <img
                src={item?.avatar || ""}
                alt={`${item?.name}'s avatar`}
                className="h-[150px] w-[150px] rounded-full object-cover"
              />
              <h3>{item?.name}</h3>
            </div>
          ))}
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
          onClick={handleNext}
          disabled={selectedAssistant ? false : true}
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          Next
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default SelectEmployee;
