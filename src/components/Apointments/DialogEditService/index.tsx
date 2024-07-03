import Spinner from "@/components/common/Spinner";
import { getAssistants } from "@/services/assistants.service";
import { serviceOption } from "@/services/serviceoption.service";
import { Assistant } from "@/types/assistant";
import { ServiceOptionType } from "@/types/ServiceOption";
import { Modal } from "flowbite-react";
import { Field } from "formik";
import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import Select from "react-tailwindcss-select";
import "react-toastify/dist/ReactToastify.css";

interface DialogEditServiceProps {
  onClose: () => void;
  show: boolean;
  onApply: () => void;
}

interface SearchServiceOptionValues {
  name_service_option: string;
}

const DialogEditService: React.FC<DialogEditServiceProps> = ({
  onClose,
  show,
  onApply,
}) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchServiceOptionValues, setSearchServiceOptionValues] =
    useState<SearchServiceOptionValues>({
      name_service_option: "",
    });

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await getAssistants();
      setAssistants(response.data.assistants);
      console.log(response.data.assistants);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const optionTime = [
    { value: "15", label: "15 min" },
    { value: "30", label: "30 min" },
    { value: "45", label: "45 min" },
    { value: "60", label: "60 min" },
    { value: "75", label: "1h15 min" },
    { value: "90", label: "1h30 min" },
    { value: "105", label: "1h45 min" },
    { value: "120", label: "2h" },
    { value: "135", label: "2h15 min" },
    { value: "150", label: "2h30 min" },
    { value: "165", label: "2h45 min" },
    { value: "180", label: "3h" },
    { value: "195", label: "3h15 min" },
    { value: "210", label: "3h30 min" },
    { value: "225", label: "3h45 min" },
    { value: "240", label: "4h" },
    { value: "255", label: "4h15 min" },
    { value: "270", label: "4h30 min" },
    { value: "285", label: "4h45 min" },
    { value: "300", label: "5h" },
  ];

  return (
    <Modal show={show} size="xl" popup onClose={onClose} className="z-1">
      <Modal.Header>
        <div className="text-gray-900 text-xl font-medium dark:text-white ">
          Edit Service
        </div>
      </Modal.Header>
      <Modal.Body className="max-h-[550px]">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Price <span className="text-meta-1">*</span>
            </label>
            <Field
              type="text"
              name="phone"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Discount
            </label>
            <Field
              as="select"
              className="w-full rounded border-[1.5px] border-stroke border-stroke px-5 py-3"
              name="service_category_id"
            >
              <option>No discount</option>
            </Field>
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Start time
            </label>
            <Field
              as="select"
              className="w-full rounded border-[1.5px] border-stroke border-stroke px-5 py-3"
              name="service_category_id"
            >
              <option>1:30</option>
            </Field>
          </div>
          <div className="w-full xl:w-1/2">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Duration
            </label>
            <Field
              as="select"
              className="w-full rounded border-[1.5px] border-stroke border-stroke px-5 py-3"
              name="service_category_id"
            >
              {optionTime?.map((option: any, index: number) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Team member
            </label>
            <Field
              as="select"
              className="w-full rounded border-[1.5px] border-stroke px-5 py-3"
              name="service_category_id"
            >
              {assistants?.map((assistant: any, index: number) => (
                <option key={index} value={assistant?.id}>
                  {assistant?.name}
                </option>
              ))}
            </Field>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="submit"
          className="w-auto cursor-pointer rounded-lg border border-red bg-transparent p-3 text-white transition hover:bg-opacity-90"
        >
          <BsTrash size={25} className="text-red" />
        </button>
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg border border-stroke bg-black p-3 text-white transition hover:bg-opacity-90"
        >
          Apply
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogEditService;
