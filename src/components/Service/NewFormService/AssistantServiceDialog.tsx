import { Assistant } from "@/types/assistant";
import { Field, FieldArray } from "formik";
import { useEffect } from "react";
import Select from "react-select";

interface AdvancedPricingDialogProps {
  formik: any;
  optionPriceType: any;
  optionId: number | null;
  optionTime: Array<any>;
  assistants: Array<Assistant>;
  handleClose: () => void;
  handleSave: () => void;
}

const AdvancedPricingDialog: React.FC<AdvancedPricingDialogProps> = ({
  optionPriceType,
  optionId,
  optionTime,
  handleSave,
  assistants,
  handleClose,
}) => {
  useEffect(() => {
    console.log(optionTime);
  }, []);

  return (
    <FieldArray name={`serviceOptions`}>
      {({ push, remove }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-5">
          <div className="mx-auto w-10/12 rounded-lg bg-white px-6 py-6 shadow-lg md:w-9/12 lg:w-8/12 xl:w-7/12">
            <div
              className="flex w-full flex-col gap-6 px-5"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {assistants?.map((assistant: Assistant, index: number) => (
                <div key={index} className="flex flex-col gap-6 xl:flex-row">
                  <div className="mt-5 flex w-full items-center xl:w-1/4">
                    <label className="block text-sm font-medium text-black dark:text-white">
                      {assistant.name}
                    </label>
                  </div>
                  <Field
                    type="text"
                    value={assistant?.id}
                    name={`serviceOptions.${optionId}.overwrite[${index}].assistantId`}
                    className="hidden"
                  />
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Duration <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      as="select"
                      name={`serviceOptions.${optionId}.overwrite[${index}].duration`}
                    >
                      {optionTime?.map((option: any, index: number) => (
                        <option key={index} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Price type <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      as="select"
                      name={`serviceOptions[${optionId}].overwrite[${index}].priceType`}
                    >
                      {optionPriceType?.map((option: any, index: number) => (
                        <option key={index} value={option.value}>
                          {option?.label}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Price <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      name={`serviceOptions[${optionId}].overwrite[${index}].price`}
                      type="text"
                      placeholder="$0.00"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4.5 flex flex-col justify-end gap-6 px-5 xl:flex-row">
              <button
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </FieldArray>
  );
};

export default AdvancedPricingDialog;
