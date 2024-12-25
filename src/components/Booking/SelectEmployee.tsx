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
import { getAssistants } from "../../services/assistants.service";
import Image from "next/image";

const SelectEmployee = ({ handleBack, handleNext, formik }: any) => {
  useEffect(() => {
    fetchAssistants();
  }, []);
  const [selectedButton, setSelectedButton] = useState(null);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<number | null>(
    null
  );
  const fetchAssistants = async () => {
    try {
      const result = await getAssistants();
      setAssistants(result?.data?.data?.filter((assistant: Assistant) => {
        return formik.values.services.some((service: any) => 
          assistant.services?.includes(service.service_id)
        );
      }));
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };
  const handleAssistantClick = (assistantId: number) => {
    setSelectedAssistant(assistantId);
    formik.setFieldValue("assistant", assistantId);
  };

  return (
    <div className="p-10 bg-white w-full rounded-lg shadow-lg">
      <h3 className="text-2xl text-primary mb-3">
        I want employee ... to do my nails
      </h3>
      <p className="mb-4">
        Please select the employee you prefer, or our will arrange the suitable
        employee.
      </p>
      <div className="my-10">
        <div className="grid grid-cols-12 gap-2">
          {assistants?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleAssistantClick(item?.id)}
              className={`cursor-pointer col-span-6 xl:col-span-3 flex gap-4 items-center flex-col p-2 cursor-pointer rounded-xl ${
                selectedAssistant === item?.id
                  ? "border border-primary shadow-lg bg-green-50"
                  : "border border-transparent"
              }`}
            >
              <Image
                src={item?.avatar || ''}
                alt={`${item?.name}'s avatar`}
                width={150}
                height={150}
                className="rounded-full object-cover"
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
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAssistant ? false : true}
          type="button"
          className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
        >
          Next
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default SelectEmployee;
