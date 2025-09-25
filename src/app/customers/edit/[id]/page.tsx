"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Field, Form } from "formik";
import flatpickr from "flatpickr";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  getCountry,
  getCustomerShow,
  getCustomerUpdate,
  getStatus,
} from "@/services/customer.service";
import { FileInput, Label } from "flowbite-react";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomerEditForm } from "@/types/customerEditForm";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@fullcalendar/core";
import SelectStatus from "@/components/Customer/SelectStatus";

// export const metadata: Metadata = {
//   title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

const CustomerEditSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\(\d{3}\)\s\d{3}-\d{4}$/, "Phone must be in format (000) 123-1234")
    .required("Please enter phone"),
});

const CustomeEditForm = () => {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any | null>(null);
  const customerId = parseInt(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBirthday, setSelectedBirthday] = useState<string | null>(null);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [status, setStatus] = useState<
    { id: number; name_status: string; color_code: string }[]
  >([]);
  const [avatarImage, setAvatar] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Init flatpickr
    fetchCustomer(customerId);
    // flatpickr(".form-datepicker", {
    //   mode: "single",
    //   static: true,
    //   monthSelectorType: "static",
    //   dateFormat: "Y-m-d",
    //   prevArrow:
    //     '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    //   nextArrow:
    //     '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    // });
    fetchDataCountry();
    fetchDataStatus();
  }, [customerId]);

  const fetchCustomer = (customerId: number) => {
    try {
      getCustomerShow(customerId).then((data) => {
        setCustomer(data?.data?.data);
        setSelectedBirthday(formatDate(data?.data?.data?.birthday));
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDataCountry = async () => {
    const country = await getCountry();
    setCities(country.data.dataCountry);
  };

  const fetchDataStatus = async () => {
    const status = await getStatus();
    setStatus(status.data.dataStatus);
  };

  const handleAvatarChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarData = reader.result ?? "";
      setAvatar(avatarData.toString());
    };
    reader.readAsDataURL(file);
  };

  // const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedBirthday(e.target.value);
  // };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit a customer" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: customer?.customer?.id,
              name: customer?.customer?.name,
              email: customer?.customer?.email,
              phone: customer?.customer?.phone,
              birthday: customer?.customer?.birthday,
              gender: customer?.customer?.gender,
              language: customer?.customer?.language,
              source: customer?.customer?.source,
              occupation: customer?.customer?.occupation,
              country: customer?.customer?.country,
              avatar: null,
              address: customer?.customer?.address,
              status: customer?.customer?.status,
            }}
            validationSchema={CustomerEditSchema}
            onSubmit={(values: CustomerEditForm) => {
              values.avatar = avatarImage;
              getCustomerUpdate(values, customerId)
                .then((data) => {
                  toast.success("Customer update successfully.");
                  router.push("/customers/list");
                })
                .catch((error) => {
                  toast.error("Failed to update customer.");
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
                          Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="eg.Join"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name}
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
                          placeholder="eg.Swich"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Avatar
                        </label>
                        <div>
                          <FileInput
                            name="avatar"
                            id="file-upload-helper-text"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            onBlur={handleBlur}
                            value={values?.avatar}
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
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Status
                        </label>
                        <SelectStatus
                          name="status"
                          options={status}
                          className="w-full"
                          placeholder="Select Status"
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "status",
                              selectedOption ? selectedOption.value : "",
                            )
                          }
                          defaultValue={values?.status}
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.email}
                          placeholder="example@gmail.com"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Phone
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let value = e.target.value.replace(/\D/g, ""); // chỉ lấy số
                        
                            if (value.length <= 3) {
                              setFieldValue("phone", value);
                            } else if (value.length <= 6) {
                              setFieldValue("phone", `(${value.slice(0, 3)}) ${value.slice(3)}`);
                            } else {
                              setFieldValue(
                                "phone",
                                `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
                              );
                            }
                          }}
                          onBlur={handleBlur}
                          value={values?.phone}
                          placeholder="+8412121219"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Birthday
                        </label>
                        <div className="relative">
                          <Field
                            type="date"
                            name="birthday"
                            placeholder="yyyy-mm-dd"
                            onChange={handleChange}
                            value={values?.birthday}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.gender}
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.language}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                          <option value={0}>English</option>
                          <option value={1}>Vietnamese</option>
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.source}
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.occupation}
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
                          value={values?.country}
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
                          Update
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

export default CustomeEditForm;
