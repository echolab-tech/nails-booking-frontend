"use client";
import React, { useEffect, useState } from "react";
import "../NewFormService/style.scss";
import AssistantList from "../NewFormService/AssistantCheckboxes";
import {
  FormikProvider,
  Field,
  Form,
  ErrorMessage,
  useFormik,
  FieldArray,
  FormikValues,
} from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getCategories } from "@/services/categories.service";
import { CATEGORYESHOW } from "@/types/CategoryEdit";
import { getAssistants, getListService } from "@/services/assistants.service";
import { AiFillPlusCircle } from "react-icons/ai";
import useColorMode from "@/hooks/useColorMode";
import { Assistant } from "@/types/assistant";
import { useParams, useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import {
  ServiceLocationType,
  serviceType,
  SubServiceType,
} from "@/types/service";
import { getLocations } from "@/services/location.service";
import { IoAddCircleOutline } from "react-icons/io5";
import { BsTrash } from "react-icons/bs";
import AdvancedPricingSubServiceDialog from "./AssistantSubServiceDialog";
import {
  addSubService,
  getSubService,
  updateSubService,
} from "@/services/sub-service.service";

const SubServiceNew = () => {
  const [assistantData, setAssistantData] = useState([]);
  const [locations, setLocations] = useState([]);
  const router = useRouter();
  const [subservice, setSubService] = useState<SubServiceType>();
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { id } = useParams<{ id: string }>();

  const optionTime = [
    { value: "5", label: "5 min" },
    { value: "10", label: "10 min" },
    { value: "15", label: "15 min" },
    { value: "20", label: "20 min" },
    { value: "25", label: "25 min" },
    { value: "30", label: "30 min" },
    { value: "35", label: "35 min" },
    { value: "40", label: "40 min" },
    { value: "45", label: "45 min" },
    { value: "50", label: "50 min" },
    { value: "55", label: "55 min" },
    { value: "60", label: "1 hour" },
    { value: "65", label: "1h 5 min" },
    { value: "70", label: "1h 10 min" },
    { value: "75", label: "1h 15 min" },
    { value: "80", label: "1h 20 min" },
    { value: "85", label: "1h 25 min" },
    { value: "90", label: "1h 30 min" },
    { value: "95", label: "1h 35 min" },
    { value: "100", label: "1h 40 min" },
    { value: "105", label: "1h 45 min" },
    { value: "110", label: "1h 50 min" },
    { value: "115", label: "1h 55 min" },
    { value: "120", label: "2 hours" },
    { value: "125", label: "2h 5 min" },
    { value: "130", label: "2h 10 min" },
    { value: "135", label: "2h 15 min" },
    { value: "140", label: "2h 20 min" },
    { value: "145", label: "2h 25 min" },
    { value: "150", label: "2h 30 min" },
    { value: "155", label: "2h 35 min" },
    { value: "160", label: "2h 40 min" },
    { value: "165", label: "2h 45 min" },
    { value: "170", label: "2h 50 min" },
    { value: "175", label: "2h 55 min" },
    { value: "180", label: "3 hours" },
    { value: "185", label: "3h 5 min" },
    { value: "190", label: "3h 10 min" },
    { value: "195", label: "3h 15 min" },
    { value: "200", label: "3h 20 min" },
    { value: "205", label: "3h 25 min" },
    { value: "210", label: "3h 30 min" },
    { value: "215", label: "3h 35 min" },
    { value: "220", label: "3h 40 min" },
    { value: "225", label: "3h 45 min" },
    { value: "230", label: "3h 50 min" },
    { value: "235", label: "3h 55 min" },
    { value: "240", label: "4 hours" },
    { value: "245", label: "4h 5 min" },
    { value: "250", label: "4h 10 min" },
    { value: "255", label: "4h 15 min" },
    { value: "260", label: "4h 20 min" },
    { value: "265", label: "4h 25 min" },
    { value: "270", label: "4h 30 min" },
    { value: "275", label: "4h 35 min" },
    { value: "280", label: "4h 40 min" },
    { value: "285", label: "4h 45 min" },
    { value: "290", label: "4h 50 min" },
    { value: "295", label: "4h 55 min" },
    { value: "300", label: "5 hours" },
  ];

  useEffect(() => {
    fetchAssistant(1);
    fetchLocations();
    fetchDataServices();
    if (id) {
      getSubService(id).then((result) => {
        setSubService(result?.data?.data);
      });
    }
  }, []);

  const fetchDataServices = async () => {
    const services = await getListService();
    setServices(services.data.data);
  };

  const fetchAssistant = async (page: number) => {
    try {
      const response = await getAssistants();
      setAssistantData(response?.data?.assistants);
    } catch (error) {
      console.error("Error fetching assistant:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response?.data?.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleClose = () => {
    setShowAdvanced(false);
  };

  const handleSave = () => {
    setShowAdvanced(false);
  };

  const handleAddService = () => {
    formik.setValues({
      ...formik.values,
      services: [...formik.values.services, ""],
    });
  };

  const handleOpenAdvanceOption = () => {
    setShowAdvanced(true);
  };

  const handleRemoveItem = (idx: number) => {
    const updatedItems = formik.values.services.filter(
      (_, index) => index !== idx,
    );
    formik.setValues({ ...formik.values, services: updatedItems });
  };

  const CreatedServiceSchema = Yup.object().shape({
    name: Yup.string().min(2).max(255).required(),
    price: Yup.string().required(),
    services: Yup.array()
      .of(Yup.string().required("Please select service"))
      .min(1, "At least one service is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: subservice?.name || null,
      description: subservice?.discription || null,
      time: subservice?.time || "60",
      price: subservice?.price || null,
      subServiceLocations:
        subservice?.serviceLocations?.map(
          (location: any) => location.location_id,
        ) || [],
      services: subservice?.services?.map((service: any) => service.id) || [],
      assistantServices:
        subservice?.assistantServices?.map((assistant: any) => assistant?.id) ||
        assistantData?.map((assistant: Assistant) => assistant?.id),
      subServiceAdvancePrices:
        Array.isArray(subservice?.subServiceAdvancePrices) &&
        subservice?.subServiceAdvancePrices?.length > 0
          ? subservice.subServiceAdvancePrices.map((option: any) => ({
              assistant_id: option?.assistant_id,
              time: option?.time,
              price: option?.price,
            }))
          : assistantData?.map((assistant: Assistant) => ({
              assistant_id: assistant?.id,
              time: optionTime[0]?.value || null,
              price: null,
            })),
    },
    validationSchema: CreatedServiceSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          const response = await updateSubService(id, values);
          if (!response.statusText) {
            throw new Error("Network response was not ok");
          }
        } else {
          const response = await addSubService(values);
          if (!response.statusText) {
            throw new Error("Network response was not ok");
          }
        }
        toast.success("Form submitted successfully!");
        router.push("/services/list");
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error submitting form: " + error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {id ? "Update sub service" : "Sub service new"}
            </h3>
          </div>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <div className="border-basic-info p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Basic Info</b>
                </label>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Sub service name
                    </label>
                    <Field
                      type="text"
                      placeholder="Sub service name"
                      name="name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red"
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
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Time <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      as="select"
                      name="time"
                      className="rounded border-[1.5px] border-stroke border-stroke"
                    >
                      {optionTime?.map((option: any, index: number) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Price <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      name="price"
                      type="text"
                      placeholder="$0.00"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>
                <button
                  className="flex items-center text-sm font-medium text-blue-500 dark:text-blue-500"
                  type="button"
                  onClick={() => handleOpenAdvanceOption()}
                >
                  Advanced pricing options
                  <AiFillPlusCircle />
                </button>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-12 rounded">
                <div className="flex flex-col gap-9">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Services
                      </h3>
                      <p className="text-black dark:text-white">
                        Assign services to sub service
                      </p>
                    </div>
                    <div className="p-6.5">
                      <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                        <div className="w-full">
                          <FieldArray
                            name="services"
                            render={() => (
                              <>
                                {formik.values.services &&
                                formik.values.services.length > 0
                                  ? formik.values.services.map(
                                      (service, index) => (
                                        <>
                                          <div
                                            key={index}
                                            className="mb-4 flex gap-2"
                                          >
                                            <Field
                                              as="select"
                                              name={`services.${index}`}
                                              className="w-full rounded border-[1.5px] border-stroke border-stroke"
                                            >
                                              <option value="">
                                                Select service
                                              </option>
                                              {services?.map((item, key) => (
                                                <option
                                                  key={key}
                                                  value={item.id}
                                                >
                                                  {item.name}
                                                </option>
                                              ))}
                                            </Field>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveItem(index)
                                              }
                                              className="inline-flex items-center text-center text-primary"
                                            >
                                              <BsTrash
                                                size={25}
                                                className="text-red"
                                              />
                                            </button>
                                          </div>
                                          <ErrorMessage
                                            name={`services.${index}`}
                                            component="div"
                                            className="text-red"
                                          />
                                        </>
                                      ),
                                    )
                                  : ""}
                              </>
                            )}
                          />
                          {formik.errors.services ==
                            "At least one service is required" && (
                            <ErrorMessage
                              name="services"
                              component="div"
                              className="text-red"
                            />
                          )}
                          <button
                            type="button"
                            onClick={handleAddService}
                            className="inline-flex items-center text-center text-primary"
                          >
                            <IoAddCircleOutline
                              size={25}
                              color="text-primary"
                            />
                            Select service
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-assistant p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Assistant</b>
                </label>
                <AssistantList assistantData={assistantData} />
              </div>
              <div className="border-assistant p-6.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Locations</b>
                </label>
                <FieldArray name="subServiceLocations">
                  {({
                    push,
                    remove,
                    form: { values },
                  }: {
                    push: (value: any) => void;
                    remove: (index: number) => void;
                    form: FormikValues;
                  }) => (
                    <>
                      <div className="mb-4.5 flex flex-wrap	gap-6 xl:flex-row">
                        {locations.map((location: any, index: number) => {
                          const isChecked = values.subServiceLocations.includes(
                            location.id,
                          );
                          return (
                            <div
                              key={index}
                              className="border-gray-1 w-1/3 rounded border p-3 xl:w-1/3"
                            >
                              <label className="checkbox-container">
                                {location?.location_name}
                                <Field
                                  name="subServiceLocations"
                                  type="checkbox"
                                  value={location.id}
                                  checked={isChecked}
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      push(location.id);
                                    } else {
                                      const idx =
                                        values.subServiceLocations.indexOf(
                                          location.id,
                                        );
                                      if (idx >= 0) remove(idx);
                                    }
                                  }}
                                />
                                <span className="checkmark"></span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="serviceLocations"
                  component="div"
                  className="text-red"
                />
              </div>

              {showAdvanced && (
                <AdvancedPricingSubServiceDialog
                  open={showAdvanced}
                  formik={formik}
                  optionTime={optionTime}
                  assistants={assistantData}
                  handleSave={handleSave}
                  handleClose={handleClose}
                />
              )}

              <div className="flex justify-center p-6.5">
                <button
                  type="button"
                  onClick={router.back}
                  className="mr-10 inline-flex items-center justify-center rounded-md bg-black px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  {id ? "Update" : "Created"}
                </button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default SubServiceNew;
