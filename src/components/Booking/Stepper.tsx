"use client";
import React from "react";
import {
  IoIosRadioButtonOn,
  IoIosRadioButtonOff,
  IoIosCheckmarkCircle,
} from "react-icons/io";

const Stepper = ({ step }: any) => {
  const steps = [
    { label: "Select customer", stepNumber: 1},
    { label: "Select service summary", stepNumber: 2 },
    { label: "Select category", stepNumber: 3 },
    { label: "Select service", stepNumber: 4 },
    { label: "Select sub service", stepNumber: 5 },
    { label: "Select employee ", stepNumber: 6 },
    { label: "Confirm booking ", stepNumber: 7 },
  ];

  return (
    <div className="w-full flex justify-center py-8">
      <ol className="flex items-center justify-between w-full px-4">
        {steps.map(({ label, stepNumber }) => (
          <li key={stepNumber} className="flex flex-col items-center flex-1">
            <div className={`flex items-center w-full justify-center ${
              stepNumber < steps.length
                ? `${stepNumber === 1 ? 'after:content-[\'\'] after:w-[55px] after:h-[2px] after:bg-gray-200 after:ml-4 ml-[76px]' : 
                   stepNumber === steps.length ? 'before:content-[\'\'] before:w-full before:h-[2px] before:bg-gray-200 before:mr-4' : 
                   'before:content-[\'\'] before:w-full before:h-[2px] before:bg-gray-200 before:mr-4 after:content-[\'\'] after:w-full after:h-[2px] after:bg-gray-200 after:ml-4'}`
                : ""
            }`}>
              <div className="flex-shrink-0">
                {step > stepNumber ? (
                  <IoIosCheckmarkCircle className="text-green-500 w-8 h-8" />
                ) : step === stepNumber ? (
                  <IoIosRadioButtonOn className="text-green-500 w-8 h-8" />
                ) : (
                  <IoIosRadioButtonOff className="text-gray-300 w-8 h-8" />
                )}
              </div>
            </div>
            <span className="hidden md:block text-xs sm:text-sm mt-2 text-center whitespace-nowrap">
              {label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
