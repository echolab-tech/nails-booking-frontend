"use client";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikValues,
} from "formik";
import { AssistantAddForm } from "@/types/AssistantAddForm";
import { assistants, getListService } from "@/services/assistants.service";
import { toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import { useRouter } from "next/navigation";
import { getLocations } from "@/services/location.service";
import UploadFile from "@/components/common/UploadFile";

const AssistantNewSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  phone: Yup.string()
    .min(10, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  avatar: Yup.mixed().test(
    "fileSize",
    "File size is too large. Maximum size is 5MB.",
    (value) => {
      return !value || (value && (value as File).size <= 5 * 1024 * 1024);
    },
  ).nullable(),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  locations: Yup.array()
    .min(1, "You must select at least one item")
    .required("This field is required"),
  services: Yup.array()
    .min(1, "You must select at least one item")
    .required("This field is required"),
});
const TeamNew = () => {
  const [animal, setAnimal] = useState(null);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchDataServices();
    fetchLocations();
  }, []);

  const fetchDataServices = async () => {
    const services = await getListService(true);
    setServices(services.data.data);
  };

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response?.data?.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
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
              name: "",
              email: "",
              password: "",
              phone: null,
              address: "",
              avatar: null,
              birthday: null,
              services: [],
              locations: [],
            }}
            validationSchema={AssistantNewSchema}
            onSubmit={(values: AssistantAddForm, { resetForm }) => {
              values.birthday = selectedBirthday;
              console.log(values);
              assistants(values)
                .then((data) => {
                  toast.success("you created it successfully.");
                  router.push("/assistants/list");
                })
                .catch((error) => {
                  toast.error("you failed to create a new one.");
                });
            }}
          >
            {({
              errors,
              touched,
              validateField,
              validateForm,
              setFieldValue,
            }) => (
              <Form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/3">
                      <UploadFile
                        srcDefault="/images/no-avatar.jpg"
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name <span className="text-meta-1">*</span>
                      </label>
                      <Field
                        type="text"
                        name="name"
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
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.phone && touched.phone && (
                        <div className="text-rose-500">{errors.phone}</div>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Password <span className="text-meta-1">*</span>
                      </label>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your email address"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.password && touched.password && (
                        <div className="text-rose-500">{errors.password}</div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Birthday
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        placeholder="Enter your email address"
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
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Service <span className="text-meta-1">*</span>
                      </label>
                      <FieldArray name="services">
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
                              {services.map((service: any, index: number) => {
                                const isChecked = values.services.includes(
                                  service.id,
                                );
                                return (
                                  <div
                                    key={index}
                                    className="border-gray-1 w-full rounded border p-3"
                                  >
                                    <label className="checkbox-container">
                                      {service?.name}
                                      <Field
                                        name="services"
                                        type="checkbox"
                                        value={service.id}
                                        checked={isChecked}
                                        onChange={(e: any) => {
                                          if (e.target.checked) {
                                            push(service.id);
                                          } else {
                                            const idx = values.services.indexOf(
                                              service.id,
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
                        name="locations"
                        component="div"
                        className="text-red"
                      />
                    </div>
                  </div>
                  <div className="mb-4.5">
                    <div className="w-full">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        <b>Locations</b>
                      </label>
                      <FieldArray name="locations">
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
                                const isChecked = values.locations.includes(
                                  location.id,
                                );
                                return (
                                  <div
                                    key={index}
                                    className="border-gray-1 w-1/2 rounded border p-3 xl:w-1/2"
                                  >
                                    <label className="checkbox-container">
                                      {location?.location_name}
                                      <Field
                                        name="locations"
                                        type="checkbox"
                                        value={location.id}
                                        checked={isChecked}
                                        onChange={(e: any) => {
                                          if (e.target.checked) {
                                            push(location.id);
                                          } else {
                                            const idx =
                                              values.locations.indexOf(
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
                        name="locations"
                        component="div"
                        className="text-red"
                      />
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
                      <button className="inline-flex w-[200px] justify-center rounded bg-black p-3 font-medium text-gray hover:bg-opacity-90">
                        Created
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default TeamNew;
