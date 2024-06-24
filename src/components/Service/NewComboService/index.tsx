"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BsTrash } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";
import * as Yup from "yup";

import {
  Field,
  Form,
  FieldArray,
  useFormik,
  FormikProvider,
  ErrorMessage,
} from "formik";
import { getListService } from "@/services/assistants.service";
import { ServicePackageType } from "@/types/service";
import { toast } from "react-toastify";
import { addServicePackage } from "@/services/service.service";
import { useRouter } from "next/navigation";

const ServiceComboNew = () => {
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [isPriceDisabled, setIsPriceDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDataServices();
  }, []);

  const fetchDataServices = async () => {
    const services = await getListService();
    setServices(services.data.data);
  };

  const handleRemoveItem = (idx: number) => {
    const updatedItems = formik.values.services.filter(
      (_, index) => index !== idx,
    );
    formik.setValues({ ...formik.values, services: updatedItems });
  };

  const handlePriceTypeChange = (event: any) => {
    const { value } = event.target;
    setIsPriceDisabled(value !== "custom");
  };

  const options = [
    { value: "everyone", label: "Everyone" },
    { value: "females", label: "Females only" },
    { value: "males", label: "Male only" },
  ];

  const priceTypes = [
    { value: "service_pricing", label: "Service pricing" },
    { value: "custom", label: "Custom" },
    { value: "free", label: "Free" },
  ];

  const CreatedServicePackageSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required("Package name is required"),
    services: Yup.array()
      .of(Yup.string().required("Please select service"))
      .min(1, "At least one service is required"),
  });

  const handleAddService = () => {
    formik.setValues({
      ...formik.values,
      services: [...formik.values.services, ""],
    });
  };

  const formik = useFormik<ServicePackageType>({
    initialValues: {
      name: null,
      description: null,
      available_for: options[0].value,
      services: [],
      price_type: priceTypes[0].value,
      enable_booking: true,
      price: 0,
    },
    validationSchema: CreatedServicePackageSchema,
    onSubmit: async (values) => {
      try {
        const response = await addServicePackage(values);
        if (!response.statusText) {
          throw new Error("Network response was not ok");
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
    <FormikProvider value={formik}>
      <Form>
        <div className="mb-4 grid grid-cols-1 gap-12 rounded">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Basic Info
                </h3>
                <p className="text-black dark:text-white">
                  Add a package name, description and choose who its available
                  for.
                </p>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Package name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Package description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Package available for
                    </label>
                    <div className="flex items-center">
                      <Field
                        as="select"
                        name="available_for"
                        className="w-full rounded border-[1.5px] border-stroke border-stroke"
                      >
                        {options?.map((item, key) => (
                          <option key={key} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-12 rounded">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Services
                </h3>
                <p className="text-black dark:text-white">
                  Assign services to your package
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
                            ? formik.values.services.map((service, index) => (
                                <>
                                  <div key={index} className="mb-4 flex gap-2">
                                    <Field
                                      as="select"
                                      name={`services.${index}`}
                                      className="w-full rounded border-[1.5px] border-stroke border-stroke"
                                    >
                                      <option value="">Select service</option>
                                      {services?.map((item, key) => (
                                        <option key={key} value={item.id}>
                                          {item.name}
                                        </option>
                                      ))}
                                    </Field>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(index)}
                                      className="inline-flex items-center text-center text-primary"
                                    >
                                      <BsTrash size={25} className="text-red" />
                                    </button>
                                  </div>
                                  <ErrorMessage
                                    name={`services.${index}`}
                                    component="div"
                                    className="text-red"
                                  />
                                </>
                              ))
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
                      <IoAddCircleOutline size={25} color="text-primary" />
                      Select service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 gap-12 rounded">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Price
                </h3>
                <p className="text-black dark:text-white">
                  Add the price of the package
                </p>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Pricing type
                    </label>
                    <Field
                      as="select"
                      name="price_type"
                      onChange={(e: any) => {
                        handlePriceTypeChange(e);
                        formik.setFieldValue("price_type", e.target.value);
                      }}
                      className="w-full rounded border-[1.5px] border-stroke border-stroke"
                    >
                      {priceTypes?.map((item, key) => (
                        <option key={key} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Retail price
                    </label>
                    <Field
                      disabled={isPriceDisabled}
                      name="price"
                      type="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                  >
                    Created
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default ServiceComboNew;
