import { Field, FieldArray } from "formik";
import { useEffect, useState } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import Select from "react-select";
import AssistantServiceDialog from './AssistantServiceDialog';

const ServiceOptions = ({
  formik,
  selectedOptionTime,
  selectedOptionPriceType,
  handleChangeOptionPriceType,
  optionTime,
  optionPriceType,
  removeFromList,
  ChangeSelectedTime,
  listAssistants,
}: any) => {
  const [showDialog, setShowDialog] = useState(false);

  const toggleDialog = () => {
    setShowDialog(!showDialog);
  };

  useEffect(() => {}, []);
  return (
    <FieldArray name="serviceOptions">
      {() =>
        formik.values.serviceOptions.map((item: any, i: any) => (
          <div key={i} className="border-option border-basic-info p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  <b>Pricing option {i + 1}</b>
                </label>
              </div>
              {formik?.values?.serviceOptions?.length > 1 && (
                <div className="flex w-full items-center justify-end xl:w-1/2">
                  <div className="ml-auto">
                    <button
                      onClick={() =>
                        removeFromList(i, formik.values, formik.setValues)
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
                <Select
                  value={selectedOptionTime}
                  onChange={ChangeSelectedTime}
                  options={optionTime}
                  isSearchable={true}
                  name={`serviceOptions.${i}.time`}
                  placeholder="Search..."
                  primaryColor={""}
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Price type <span className="text-meta-1">*</span>
                </label>
                <Select
                  key={i}
                  value={selectedOptionPriceType[i]}
                  onChange={(selectedOption) =>
                    handleChangeOptionPriceType(selectedOption, i)
                  }
                  options={optionPriceType}
                  isSearchable={true}
                  name={`serviceOptions.${i}.price_type`}
                  placeholder="Search..."
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Price <span className="text-meta-1">*</span>
                </label>
                <Field
                  name={`serviceOptions.${i}.price`}
                  type="text"
                  placeholder="$0.00"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Pricing name (Optional)
                </label>
                <Field
                  name={`serviceOptions.${i}.name`}
                  type="text"
                  placeholder="Eg: Long hair"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <button
                  className="block text-sm font-medium text-blue-500 dark:text-blue-500"
                  onClick={toggleDialog}
                  type="button"
                >
                  Advanced pricing options
                </button>
              </div>
            </div>
            {/* {showDialog && (
             
            )} */}
            <AssistantServiceDialog
              formik={formik}
              selectedOptionPriceType={selectedOptionPriceType}
              handleChangeOptionPriceType={handleChangeOptionPriceType}
              optionPriceType={optionPriceType}
              showDialog={showDialog}
              toggleDialog={toggleDialog}
            />
          </div>
        ))
      }
    </FieldArray>
  );
};

export default ServiceOptions;
