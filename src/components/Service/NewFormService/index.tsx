"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import Select from "react-tailwindcss-select";
import ToggleState from "./ToggleState";
import AssistantList from "./AssistantCheckboxes";
import ServiceOptions from "./ServiceOptions";
import { FormikProvider, Field, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCategories } from "@/services/categories.service";
import { CATEGORYESHOW } from "@/types/CategoryEdit";
import { getAssistants } from "@/services/assistants.service";
import { AiFillPlusCircle } from "react-icons/ai";
import useColorMode from "@/hooks/useColorMode";
import { Assistant } from "@/types/assistant";

const ServiceSingleNew = () => {
  const [categoryData, setCategoryData] = useState<CATEGORYESHOW[]>([]);
  const [assistantData, setAssistantData] = useState([]);
  const [selectedOptionTime, setSelectedOptionTime] = useState(null);
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const [colorMode, setColorMode] = useColorMode();

  const [selectedOptionPriceType, setSelectedOptionPriceType] = useState([]);

  const handleChangeOptionPriceType = (selectedOption: any, index: any) => {
    // Update selected option state
    const newSelectedOptions = [...selectedOptionPriceType];
    newSelectedOptions[index] = selectedOption;
    setSelectedOptionPriceType(newSelectedOptions);

    // Update the corresponding value in the formik values
    const newOptions = [...values.serviceOptions];
    newOptions[index].price_type = selectedOption ? selectedOption.value : null; // Ensure it's not null
    setFieldValue("serviceOptions", newOptions);
  };

  // const handleChange = (selectedOption: any) => {
  //     setSelectedOption(selectedOption);
  // };

  const changeSelectedCategory = (selectedOptionCategory: any) => {
    setSelectedOptionCategory(selectedOptionCategory);
  };

  const changeSelectedTime = (selectedOptionTime: any) => {
    setSelectedOptionTime(selectedOptionTime);
  };

  const optionPriceType = [
    { value: "1", label: "Fixed" },
    { value: "2", label: "Type 1" },
    { value: "3", label: "Type 2" },
  ];
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

  useEffect(() => {
    fetchCategories(1);
    fetchAssistant(1);
  }, []);

  const fetchAssistant = async (page: number) => {
    try {
      const response = await getAssistants();
      setAssistantData(response?.data?.assistants);
    } catch (error) {
      console.error("Error fetching assistant:", error);
    }
  };
  const fetchCategories = async (page: number) => {
    try {
      const response = await getCategories(page);
      setCategoryData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const removeFromList = (index: number, values: any, setValues: any) => {
    const updatedServiceOptions = values.serviceOptions.filter(
      (_, i) => i !== index,
    );
    setValues({ ...values, serviceOptions: updatedServiceOptions });
  };

  const updateForm = (values: any, setValues: any) => {
    const newServiceOptions = {
      name: null,
      time: null,
      price: null,
      assistant_id: null,
    };
    setValues({
      ...values,
      serviceOptions: [...values.serviceOptions, newServiceOptions],
    });
  };

  const CreatedService = Yup.object().shape({
    name: Yup.string().min(2).max(50).required(),
    description: Yup.string().min(2).max(50).required(),
  });

  // const handleSubmit = (values, { resetForm }) => {
  //   formik.values.service_category_id = selectedOptionCategory?.id || "";

  //   if (
  //     Array.isArray(formik.values.serviceOptions) &&
  //     formik.values.serviceOptions.length > 0
  //   ) {
  //     formik.values.serviceOptions.forEach((option, index) => {
  //       formik.values.serviceOptions[index]["time"] =
  //         selectedOptionTime?.value || "";
  //       formik.values.serviceOptions[index]["price_type"] =
  //         selectedOptionPriceType?.value || "";
  //     });
  //   }

  //   service(values)
  //     .then((data) => {
  //       toast.success("You created it successfully.");
  //       resetForm();
  //     })
  //     .catch((error) => {
  //       toast.error("You failed to create a new one.");
  //     });
  // };

  const formik = useFormik({
    initialValues: {
      name: null,
      description: null,
      service_category_id: null,
      is_booking_online: colorMode === "on",
      assistantServices:
        assistantData?.map((assistant: Assistant) => assistant?.id) || [],
      serviceOptions: [
        {
          name: null,
          time: null,
          price: null,
          price_type: null,
          type: null,
          overwrite: assistantData?.map((assistant: Assistant) => ({
            assistantId: assistant?.id || "",
            duration: "",
            priceType: "",
            price: "",
          })),
        },
      ],
    },
    onSubmit: (values) => {
      console.log(values);

      // alert(JSON.stringify(values, null, 2));
    },
    enableReinitialize: true,
  });

  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Service single New
            </h3>
          </div>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <div className="border-basic-info p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Basic Info</b>
                </label>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Service Name
                    </label>
                    <Field
                      type="text"
                      placeholder="Name"
                      name="name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Category <span className="text-meta-1">*</span>
                    </label>
                    <Select
                      value={selectedOptionCategory}
                      onChange={changeSelectedCategory}
                      options={categoryData.map((item) => ({
                        id: item.id,
                        value: item.name,
                        label: item.name,
                      }))}
                      isSearchable={true}
                      placeholder="Search..."
                      primaryColor=""
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <Field
                      as="textarea"
                      placeholder="Description"
                      name="description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="border-toggle p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Online Booking</b>
                </label>
                <ToggleState
                  value={formik.values.is_booking_online}
                  onChange={() => {
                    setValues(
                      "is_booking_online",
                      !formik.values.is_booking_online,
                    );
                    setColorMode(
                      !formik.values.is_booking_online ? "on" : "off",
                    );
                  }}
                />
              </div>
              <div
                className="border-assistant p-6.5"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Assistant</b>
                </label>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <AssistantList
                    assistantData={assistantData}
                    values={formik.values}
                  />
                </div>
              </div>
              <div className="border-assistant p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <div className="flex flex-col">
                    <b>Pricing and Time</b>
                    <span>
                      Add the pricing options and Time of the service.
                    </span>
                  </div>
                </label>
                <ServiceOptions
                  assistants={assistantData}
                  formik={formik}
                  selectedOptionTime={selectedOptionTime}
                  selectedOptionPriceType={selectedOptionPriceType}
                  handleChangeOptionPriceType={handleChangeOptionPriceType}
                  optionTime={optionTime}
                  optionPriceType={optionPriceType}
                  removeFromList={removeFromList}
                  changeSelectedTime={changeSelectedTime}
                  listAssistants={formik.values.assistantServices}
                />
                <button
                  className="flex items-center text-sm font-medium text-blue-500 dark:text-blue-500"
                  type="button"
                  onClick={() => updateForm(formik.values, formik.setValues)}
                >
                  Add pricing option
                  <AiFillPlusCircle />
                </button>
              </div>
              <div className="mb-4.5 flex justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Created
                </button>
              </div>
            </Form>
          </FormikProvider>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ServiceSingleNew;
