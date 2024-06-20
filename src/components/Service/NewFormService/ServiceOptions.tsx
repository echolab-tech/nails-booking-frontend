import { ErrorMessage, Field, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import Select from "react-select";
import AssistantServiceDialog from "./AssistantServiceDialog";
import { number } from "yup";

const ServiceOptions = ({
  formik,
  optionTime,
  optionPriceType,
  removeFromList,
  assistants,
}: any) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [optionId, setOptionId] = useState<null | number>(null);

  const handleOpenAdvanceOption = (index: number) => {
    setOptionId(index);
    setShowAdvanced(true);
  };

  const handleClose = () => {
    formik.setFieldValue(`serviceOptions[${optionId}].overwrite`, []);
    setShowAdvanced(false);
  };

  const handleSave = () => {
    setShowAdvanced(false);
  };

  useEffect(() => {}, []);
  return (
    <>
      <FieldArray name="serviceOptions">
        {() =>
          formik.values.serviceOptions.map((item: any, opindex: any) => (
            <div
              key={opindex}
              className="border-option border-basic-info p-6.5"
            >
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    <b>Pricing option {opindex + 1}</b>
                  </label>
                </div>
                {formik?.values?.serviceOptions?.length > 1 && (
                  <div className="flex w-full items-center justify-end xl:w-1/2">
                    <div className="ml-auto">
                      <button
                        onClick={() =>
                          removeFromList(
                            opindex,
                            formik.values,
                            formik.setValues,
                          )
                        }
                      >
                        <span>
                          <BsFillTrashFill />
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Time <span className="text-meta-1">*</span>
                  </label>
                  <Field
                    as="select"
                    name={`serviceOptions.${opindex}.time`}
                    className="rounded border-[1.5px] border-stroke border-stroke"
                  >
                    {optionTime?.map((option: any, index: number) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price type <span className="text-meta-1">*</span>
                  </label>
                  <Field
                    as="select"
                    className="rounded border-[1.5px] border-stroke border-stroke"
                    name={`serviceOptions.${opindex}.price_type`}
                  >
                    {optionPriceType?.map((option: any, index: number) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price <span className="text-meta-1">*</span>
                  </label>
                  <Field
                    name={`serviceOptions.${opindex}.price`}
                    type="text"
                    placeholder="$0.00"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`serviceOptions.${opindex}.price`}
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Pricing name (Optional)
                  </label>
                  <Field
                    name={`serviceOptions.${opindex}.name`}
                    type="text"
                    placeholder="Eg: Long hair"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name={`serviceOptions.${opindex}.name`}
                    component="div"
                    className="text-red"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <button
                    className="block text-sm font-medium text-blue-500 dark:text-blue-500"
                    onClick={() => handleOpenAdvanceOption(opindex)}
                    type="button"
                  >
                    Advanced pricing options
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </FieldArray>
      {showAdvanced && (
        <AssistantServiceDialog
          open={showAdvanced}
          formik={formik}
          optionId={optionId}
          optionTime={optionTime}
          assistants={assistants}
          optionPriceType={optionPriceType}
          handleSave={handleSave}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default ServiceOptions;
