import { ErrorMessage, Field, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { number } from "yup";

const SubServices = ({ formik, optionTime, handleRemove }: any) => {
  useEffect(() => {}, []);
  return (
    <>
      <FieldArray name="subServices">
        {() =>
          formik.values.subServices.map((item: any, opindex: any) => (
            <div
              key={opindex}
              className="border-option border-basic-info p-6.5"
            >
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="flex w-full items-center justify-end">
                  <div className="ml-auto">
                    <button
                      onClick={() =>
                        handleRemove(opindex, formik.values, formik.setValues)
                      }
                    >
                      <span>
                        <BsTrash size={25} className="text-red" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Name <span className="text-meta-1">*</span>
                  </label>
                  <Field
                    name={`subServices.${opindex}.name`}
                    type="text"
                    placeholder="Eg: Long hair"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`subServices.${opindex}.name`}
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
                    name={`subServices.${opindex}.description`}
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
                    name={`subServices.${opindex}.time`}
                    className="rounded border-[1.5px] border-stroke border-stroke"
                  >
                    {optionTime?.map((option: any, index: number) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name={`subServices.${opindex}.time`}
                    component="div"
                    className="text-red"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price <span className="text-meta-1">*</span>
                  </label>
                  <Field
                    name={`subServices.${opindex}.price`}
                    type="text"
                    placeholder="$0.00"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`subServices.${opindex}.price`}
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>
            </div>
          ))
        }
      </FieldArray>
    </>
  );
};

export default SubServices;
