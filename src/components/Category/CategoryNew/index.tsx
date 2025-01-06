"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, FormikValues } from "formik";
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
import { getServiceSummaries } from "@/services/service-summary.service";

const CreatedCategory = Yup.object().shape({
  name: Yup.string().min(2).max(50).required(),
});

const CategoryNew = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType>();
  const [listServiceSummary, setListServiceSummary] = useState<
    ServiceSummaryType[]
  >([]);

  useEffect(() => {
    fetchCategory();
    fetchServiceSummary();
  }, []);

  const fetchCategory = async () => {
    const result = await getCategoryById(id);
    setCategory(result?.data?.data);
  };
  const fetchServiceSummary = async () => {
    const result = await getServiceSummaries(null, true);
    setListServiceSummary(result?.data?.data);
  };

  // const handleCheckboxChange = (id: string) => {
  //   setCategory((prevCategory) => ({
  //     ...prevCategory,
  //     listServiceSummary: [
  //       ...(prevCategory?.listServiceSummary || []), // Đảm bảo là mảng
  //       item,
  //     ],
  //   }));
  // };

  // console.log(listServiceSummary, "listServiceSummary");
  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {id ? "Update category" : "New category"}
            </h3>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              id: "",
              name: category?.name || "",
              color: category?.color || "#22d3ee",
              serviceSummary:
                category?.service_summaries?.map((item) => item.id) || [],
            }}
            validationSchema={CreatedCategory}
            onSubmit={(values: any, { resetForm }) => {
              if (id) {
                updateCategory(values, id)
                  .then((data) => {
                    toast.success("you update it successfully.");
                    router.push("/category/list");
                  })

                  .catch((error) => {
                    toast.error("you failed update.");
                  });
              } else {
                categories(values)
                  .then((data) => {
                    toast.success("you created it successfully.");
                    router.push("/category/list");
                  })

                  .catch((error) => {
                    toast.error("you failed to create a new one.");
                  });
              }
            }}
          >
            {({ errors, touched }) => (
              <Form action="#">
                <div className="border-stroke  p-6.5 px-6.5 py-4 dark:border-strokedark">
                  <div className="mb-4.5 flex flex-col justify-center gap-6">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Category Name
                      </label>
                      <Field
                        type="text"
                        placeholder="Category Name"
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
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Color
                      </label>
                      <Field
                        type="color"
                        name="color"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      {id ? "Update service summary" : "New service summary"}
                    </h3>
                  </div>
                  <div className="mb-4.5 flex flex-col justify-center gap-6 px-6.5 py-4">
                    <div className="w-full">
                      <FieldArray name="serviceSummary">
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
                              {listServiceSummary?.map(
                                (summary: any, index: number) => {
                                  const isChecked =
                                    values.serviceSummary.includes(summary?.id);
                                  return (
                                    <div
                                      key={index}
                                      className="border-gray-1 w-1/3 rounded border p-3 xl:w-1/3"
                                    >
                                      <label className="checkbox-container">
                                        {summary?.name}
                                        <Field
                                          name="serviceSummary"
                                          type="checkbox"
                                          value={summary.id}
                                          checked={isChecked}
                                          onChange={(e: any) => {
                                            if (e.target.checked) {
                                              push(summary.id);
                                            } else {
                                              const idx =
                                                values.serviceSummary.indexOf(
                                                  summary.id,
                                                );
                                              if (idx >= 0) remove(idx);
                                            }
                                          }}
                                        />
                                        <span className="checkmark"></span>
                                      </label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col gap-6 px-6.5 py-4 xl:flex-row">
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
export default CategoryNew;
