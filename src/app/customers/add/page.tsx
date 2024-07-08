"use client";

import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Field, Form } from "formik";
import { CustomerForm } from "@/types/customerForm";
import flatpickr from "flatpickr";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { customers, getCountry, getStatus } from "@/services/customer.service";
import { FileInput } from "flowbite-react";
import { parseISO } from "date-fns";
import { toast } from "react-toastify";
import Select from "react-tailwindcss-select";
import SelectStatus from "@/components/Customer/SelectStatus";

const CustomerNewSchema = Yup.object().shape({
  name: Yup.string().required("Please enter name"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Please enter phone"),
  email: Yup.string().email("Invalid email").required("Please enter email"),
  status: Yup.string().required("Please select status"),
});

const CustomeNewForm = () => {
  const [selectedBirthday, setSelectedBirthday] = useState<string | null>(null);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [country, setCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [avatarImage, setAvatar] = useState<string>("");
  const [status, setStatus] = useState<
    { id: number; name_status: string; color_code: string }[]
  >([]);

  useEffect(() => {
    fetchDataCountry();
    fetchDataStatus();
  }, []);

  const fetchDataCountry = async () => {
    const country = await getCountry();
    setCities(country.data.dataCountry);
  };

  const fetchDataStatus = async () => {
    const response = await getStatus();
    const dataStatus = response.data.dataStatus;
    setStatus(dataStatus);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarData = reader.result as string;
      setAvatar(avatarData);
      // setFieldValue("avatar", file);
    };
    reader.readAsDataURL(file);
  };

  const handleBirthdayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const value = e.target.value;
    setSelectedBirthday(value);
    setFieldValue("birthday", value);
  };

  const handleChangeCountry = (value: any, setFieldValue: any) => {
    setCountry(value);
    setFieldValue("country", value ? value.value : "");
  };

  const options = cities.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add a new customer" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: "",
              email: "",
              phone: "",
              birthday: "",
              gender: "",
              language: "",
              source: "",
              occupation: "",
              country: "",
              avatar: "",
              address: "",
              status: "",
            }}
            validationSchema={CustomerNewSchema}
            onSubmit={(values: CustomerForm, { resetForm }) => {
              values.avatar = avatarImage;
              customers(values)
                .then((data) => {
                  toast.success("Customer created successfully.");
                  resetForm();
                })
                .catch((error) => {
                  toast.error("Failed to create customer.");
                });
            }}
          >
            {({ errors, touched, setFieldValue, handleChange, handleBlur }) => (
              <Form>
                {/* <!-- Profile Form --> */}
                <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="px-6.5 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                      Profile
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Name <span className="text-meta-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="eg.Swich"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.name && touched.name && (
                          <div className="text-rose-500">{errors.name}</div>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Address <span className="text-meta-1">*</span>
                        </label>
                        <Field
                          type="text"
                          name="address"
                          placeholder="eg.Swich"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Avatar <span className="text-meta-1">*</span>
                        </label>
                        <div>
                          <FileInput
                            name="avatar"
                            id="file-upload-helper-text"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
                          />
                          {/* <input
                            id="file"
                            name="avatar"
                            type="file"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setFieldValue(
                                "avatar",
                                event.currentTarget.files[0],
                              );
                            }}
                            className="form-control"
                          /> */}
                        </div>
                      </div>
                      <div className="xl:w-1/2">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-black"
                        >
                          Status
                        </label>
                        <SelectStatus
                          name="status"
                          options={status}
                          className="custom-class w-full"
                          placeholder="Select a status"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "status",
                              selectedOption ? selectedOption.value : "",
                            )
                          }
                        />
                        {errors.status && touched.status && (
                          <div className="text-rose-500">{errors.status}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Email <span className="text-meta-1">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          placeholder="example@gmail.com"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        {errors.email && touched.email && (
                          <div className="text-rose-500">{errors.email}</div>
                        )}
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          placeholder="+8412121219"
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
                          Birthday
                        </label>
                        <div className="relative">
                          <input
                            name="birthday"
                            type="date"
                            className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            placeholder="mm/dd/yyyy"
                            data-class="flatpickr-right"
                            onChange={handleBirthdayChange}
                          />
                        </div>
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Gender
                        </label>
                        <Field
                          as="select"
                          name="gender"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value={0}>Female</option>
                          <option value={1}>Male</option>
                          <option value={2}>Non-binary</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Additional info */}
                <div className="mt-6 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="px-6.5 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                      Additional info
                    </h3>
                  </div>
                  <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Preferred language
                        </label>
                        <Field
                          as="select"
                          name="language"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value={0}>English</option>
                          <option value={1}>Vietnames</option>
                          <option value={2}>China</option>
                        </Field>
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Client source
                        </label>
                        <Field
                          as="select"
                          name="source"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value={0}>Walk-in</option>
                          <option value={1}>test</option>
                        </Field>
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Occupation
                        </label>
                        <Field
                          type="text"
                          name="occupation"
                          placeholder="Enter customer job"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Country
                        </label>
                        <Field
                          as="select"
                          name="country"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          {cities.map((city, index) => (
                            <option key={index} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="flex w-full justify-end xl:w-1/2">
                        <button className="justify-center rounded bg-green-600 p-3 font-medium text-gray hover:bg-opacity-90">
                          Add
                        </button>
                      </div>
                      <div className="w-full xl:w-1/2">
                        <button className="justify-center rounded bg-slate-900 p-3 font-medium text-gray hover:bg-opacity-90">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CustomeNewForm;
