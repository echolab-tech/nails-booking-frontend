"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CategoryType } from "@/types/Category";
import {
  categories,
  getCategoryById,
  updateCategory,
} from "@/services/categories.service";
import { useParams, useRouter } from "next/navigation";
import { ServiceSummaryType } from "@/types/ServiceSummary";
import "./style.css";
import {
  updateServiceSummary,
  serviceSummaryNew,
  getServcieSummaryById,
} from "@/services/service-summary.service";
import { FieldProps, FormikProps } from "formik";

const CreatedCategory = Yup.object().shape({
  name: Yup.string().min(2).max(50).required(),
});

const ServiceSummaryNew = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [serviceSummary, setServiceSummary] = useState<ServiceSummaryType>();

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const result = await getServcieSummaryById(id);
    console.log(result?.data?.data, "result");
    setServiceSummary({
      ...result?.data?.data,
      is_active: Boolean(result?.data?.data?.is_active),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {id ? "Update service summary" : "New service summary"}
            </h3>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: serviceSummary?.id || "",
              name: serviceSummary?.name || "",
              is_active: Boolean(serviceSummary?.is_active || false),
            }}
            validationSchema={CreatedCategory}
            onSubmit={(values: ServiceSummaryType, { resetForm }) => {
              if (id) {
                updateServiceSummary(values, id)
                  .then((data) => {
                    toast.success("you update it successfully.");
                    router.push("/service-summary/list");
                  })

                  .catch((error) => {
                    toast.error("you failed update.");
                  });
              } else {
                serviceSummaryNew(values)
                  .then((data) => {
                    toast.success("you created it successfully.");
                    router.push("/service-summary/list");
                  })

                  .catch((error) => {
                    toast.error("you failed to create a new one.");
                  });
              }
            }}
          >
            {({ errors, touched }) => (
              <Form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col justify-center gap-6">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name
                      </label>
                      <Field
                        type="text"
                        placeholder="Service Summary Name"
                        name="name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.name && touched.name ? (
                        <div className="w-full text-rose-500">
                          {errors.name}
                        </div>
                      ) : null}
                    </div>
                    <div className="w-1/3">
                      <div className="w-1/3">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Is Active
                        </label>
                        <div className="flex items-center">
                          <Field name="is_active">
                            {({ field, form }: FieldProps<boolean>) => (
                              <div>
                                <input
                                  type="checkbox"
                                  id="is_active"
                                  checked={!!field.value} // Ép giá trị thành boolean
                                  onChange={() => form.setFieldValue("is_active", !field.value)}
                                  className="toggle-checkbox hidden"
                                />
                                <label
                                  htmlFor="is_active"
                                  className={`toggle-label flex h-6 w-11 cursor-pointer items-center rounded-full transition ${
                                    field.value
                                      ? "bg-primary"
                                      : "dark:bg-gray-700 bg-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`toggle-handle h-4 w-4 transform rounded-full bg-white shadow transition ${
                                      field.value
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                    }`}
                                  ></span>
                                </label>
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <button
                        type="submit"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                      >
                        {id ? "Update" : "Create"}
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
export default ServiceSummaryNew;
