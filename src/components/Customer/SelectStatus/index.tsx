import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { FaCircle } from "react-icons/fa";

interface Status {
  id: number;
  name_status: string;
  color_code: string;
}

interface SelectStatusProps {
  name: string;
  options: Status[];
  className?: string;
  placeholder?: string;
  onChange?: (selectedOption: any) => void;
  defaultValue?: any;
}

const SelectStatus: React.FC<SelectStatusProps> = ({
  name,
  options,
  className,
  placeholder,
  onChange,
  defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const optionsFormatted = useMemo(
    () =>
      options.map((option) => ({
        value: option.id,
        label: (
          <div className="flex items-center">
            <FaCircle
              className="rounded-full border border-gray-900 text-xl"
              style={{ color: option.color_code }}
            />
            <span className="ml-2">{option.name_status}</span>
          </div>
        ),
      })),
    [options],
  );

  useEffect(() => {
    if (defaultValue) {
      const foundDefault = optionsFormatted.find(
        (option) => option.value === defaultValue,
      );
      if (foundDefault && foundDefault.value !== selectedValue?.value) {
        setSelectedValue(foundDefault);
      }
    }
  }, [defaultValue, optionsFormatted]);

  useEffect(() => {
    if (defaultValue) {
      const foundDefault = optionsFormatted.find(
        (option) => option.value === defaultValue,
      );
      setSelectedValue(foundDefault);
    }
  }, [defaultValue, optionsFormatted]);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? "#2563EB" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.5)" : "none",
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "0.375rem",
      backgroundColor: "transparent",
      color: "black",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      padding: "0.5rem",
      backgroundColor: state.isFocused ? "#BFDBFE" : "white",
      color: state.isFocused ? "#2563EB" : "black",
      cursor: "pointer",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "0.375rem",
      overflow: "hidden",
      marginTop: "0.5rem",
      boxShadow: "0px 8px 24px rgba(149, 157, 165, 0.2)",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#6B7280",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? "#2563EB" : "#9CA3AF",
      "&:hover": {
        color: "#2563EB",
      },
    }),
  };
  return (
    <Select
      name={name}
      options={optionsFormatted}
      className={`w-full ${className}`}
      placeholder={placeholder}
      onChange={(selectedOption) => {
        setSelectedValue(selectedOption);
        if (onChange) {
          onChange(selectedOption);
        }
      }}
      styles={customStyles}
      value={selectedValue}
    />
  );
};

export default SelectStatus;
