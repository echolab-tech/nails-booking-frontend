"use client";
import React from "react";
import {
  IoIosRadioButtonOn,
  IoIosRadioButtonOff,
  IoIosCheckmarkCircle,
} from "react-icons/io";

const Stepper = ({ step }: any) => {
  const steps = [
    { label: "Select customer", stepNumber: 1 },
    { label: "Select service summary", stepNumber: 2 },
    { label: "Select category", stepNumber: 3 },
    { label: "Select service", stepNumber: 4 },
    { label: "Select sub service", stepNumber: 5 },
    { label: "Select employee ", stepNumber: 6 },
    { label: "Confirm booking ", stepNumber: 7 },
  ];

  return (
    <div className="flex w-full justify-center py-8">
      <ol className="flex w-full items-center justify-between px-4">
        {steps.map(({ label, stepNumber }) => (
          <li key={stepNumber} className="flex flex-1 flex-col items-center">
            <div
              className={`flex w-full items-center justify-center ${
                stepNumber < steps.length
                  ? `${
                      stepNumber === 1
                        ? "ml-[76px] after:ml-4 after:h-[2px] after:w-[55px] after:bg-gray-200 after:content-['']"
                        : stepNumber === steps.length
                          ? "before:mr-4 before:h-[2px] before:w-full before:bg-gray-200 before:content-['']"
                          : "before:mr-4 before:h-[2px] before:w-full before:bg-gray-200 before:content-[''] after:ml-4 after:h-[2px] after:w-full after:bg-gray-200 after:content-['']"
                    }`
                  : ""
              }`}
            >
              <div className="flex-shrink-0">
                {step > stepNumber ? (
                  <IoIosCheckmarkCircle className="h-8 w-8" />
                ) : step === stepNumber ? (
                  <IoIosRadioButtonOn className="h-8 w-8" />
                ) : (
                  <IoIosRadioButtonOff className="h-8 w-8 text-gray-300" />
                )}
              </div>
            </div>
            <span className="mt-2 hidden whitespace-nowrap text-center text-xs sm:text-sm md:block">
              {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
