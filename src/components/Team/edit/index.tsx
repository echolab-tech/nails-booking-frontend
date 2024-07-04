"use client";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { Field, Form, Formik } from "formik";
import {
  assistantUpdate,
  getAssistantShow,
  getListService,
} from "@/services/assistants.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { AssistantEditForm } from "@/types/AssistantEditFrom";
import { useParams, useRouter } from "next/navigation";
import "./style.scss";

const AssistantEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  phone: Yup.string()
    .min(10, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});
const TeamEdit = () => {
  const [animal, setAnimal] = useState(null);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [assistant, setAssistant] = useState<any | null>(null);
  const customerId = parseInt(params.id);
  useEffect(() => {
    fetchAssistant(customerId);
    fetchDataServices();
  }, [customerId]);

  const fetchAssistant = (customerId: number) => {
    try {
      getAssistantShow(customerId).then((data) => {
        setAssistant(data?.data?.data);
        setSelectedBirthday(data?.data?.data?.birthday);
        const servicesData = data?.data?.data?.services;
        const formattedServices = servicesData.map((service: any) => ({
          value: String(service.id),
          label: service.name,
        }));
        setAnimal(formattedServices);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDataServices = async () => {
    const services = await getListService();
    setServices(services.data.data);
  };

  const handleChangeServices = (value: any) => {
    setAnimal(value);
  };
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBirthday(e.target.value);
  };
  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Team New</h3>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: assistant?.id,
              name: assistant?.name,
              email: assistant?.email,
              phone: assistant?.phone,
              address: assistant?.address,
              avatar: null,
              birthday: assistant?.birthday,
              services: assistant?.services,
            }}
            validationSchema={AssistantEditSchema}
            onSubmit={(values: AssistantEditForm, { resetForm }) => {
              values.services = animal;
              values.birthday = selectedBirthday;
              assistantUpdate(values, customerId)
                .then((data) => {
                  toast.success("you update it successfully.");
                  resetForm();
                })
                .catch((error) => {
                  toast.error("you failed to update it.");
                });
            }}
          >
            {({
              errors,
              touched,
              validateField,
              validateForm,
              setFieldValue,
              values,
              handleChange,
              handleBlur,
            }) => (
              <Form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name <span className="text-meta-1">*</span>
                      </label>
                      <Field
                        type="text"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.name}
                        placeholder="Enter your first name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.name && touched.name && (
                        <div className="text-rose-500">{errors.name}</div>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email <span className="text-meta-1">*</span>
                      </label>
                      <Field
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.email}
                        placeholder="Enter your email address"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.email && touched.email && (
                        <div className="text-rose-500">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Phone <span className="text-meta-1">*</span>
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        placeholder="Enter your phone"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.phone}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.phone && touched.phone && (
                        <div className="text-rose-500">{errors.phone}</div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        BirthDay
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        placeholder="Enter your email address"
                        onBlur={handleBlur}
                        value={selectedBirthday ?? ""}
                        onChange={handleBirthdayChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Address
                      </label>
                      <Field
                        type="text"
                        name="address"
                        placeholder="Enter your address"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.address}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Service <span className="text-meta-1">*</span>
                      </label>
                      {services.length > 0 && (
                        <Select
                          value={animal}
                          onChange={handleChangeServices}
                          options={services.map((service) => ({
                            value: String(service.id),
                            label: service.name,
                          }))}
                          primaryColor={""}
                          isMultiple={true}
                          isSearchable={true}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mb-4.5 flex justify-center">
                    <div className="flex w-full justify-center gap-10">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex w-[200px] justify-center rounded border bg-transparent p-3 font-medium text-black hover:bg-opacity-90"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="inline-flex w-[200px] justify-center rounded bg-black p-3 font-medium text-gray hover:bg-opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};
export default TeamEdit;
