"use client";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { Field, Form, Formik } from "formik";
import { AssistantAddForm } from "@/types/AssistantAddForm";
import { assistants, getListService } from "@/services/assistants.service";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import { useRouter } from "next/navigation";

const AssistantNewSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  phone: Yup.string()
    .min(10, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
});
const TeamNew = () => {
  const [animal, setAnimal] = useState(null);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [selectedBirthday, setSelectedBirthday] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetchDataServices();
  }, []);

  const fetchDataServices = async () => {
    const services = await getListService();
    setServices(services.data.data);
  };

  const handleChange = (value: any) => {
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
              name: "",
              email: "",
              password: "",
              phone: null,
              address: "",
              avatar: null,
              birthday: null,
              services: null,
            }}
            validationSchema={AssistantNewSchema}
            onSubmit={(values: AssistantAddForm, { resetForm }) => {
              values.services = animal;
              values.birthday = selectedBirthday;
              assistants(values)
                .then((data) => {
                  toast.success("you created it successfully.");
                  resetForm();
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
                        BirthDay
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
                      {services.length > 0 && (
                        <Select
                          value={animal}
                          onChange={handleChange}
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
                      <button className="inline-flex w-[200px] justify-center rounded bg-black p-3 font-medium text-gray hover:bg-opacity-90">
                        Created
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
export default TeamNew;
