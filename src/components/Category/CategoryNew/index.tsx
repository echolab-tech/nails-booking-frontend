"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CATEGORY } from "@/types/Category";
import { categories } from "@/services/categories.service";

const CreatedCategory = Yup.object().shape({
  name: Yup.string().min(2).max(50).required(),
});

const CategoryNew = () => {
  return (
    <div className="grid grid-cols-1 gap-12">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Category New
            </h3>
          </div>
          <Formik
            initialValues={{
              name: "",
            }}
            validationSchema={CreatedCategory}
            onSubmit={(values: CATEGORY, { resetForm }) => {
              categories(values)
                .then((data) => {
                  toast.success("you created it successfully.");
                  resetForm();
                })
                .catch((error) => {
                  toast.error("you failed to create a new one.");
                });
            }}
          >
            {({ errors, touched }) => (
              <Form action="#">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Name
                      </label>
                      <Field
                        type="text"
                        placeholder="Category Name"
                        name="name"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      {errors.name && touched.name ? (
                        <div className="w-full text-rose-500">
                          {errors.name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col justify-center gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <input
                        type="submit"
                        value="Created"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                      />
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
export default CategoryNew;
