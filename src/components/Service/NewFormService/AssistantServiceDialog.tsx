import { Assistant } from "@/types/assistant";
import { Modal } from "flowbite-react";
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
  open: boolean;
}

const AdvancedPricingDialog: React.FC<AdvancedPricingDialogProps> = ({
  optionPriceType,
  optionId,
  optionTime,
  handleSave,
  assistants,
  handleClose,
  open,
}) => {
  useEffect(() => {}, []);

  return (
    <Modal
      show={open}
      size="6xl"
      onClose={() => handleClose()}
      popup
      className=""
    >
      <Modal.Header>Advanced pricing options</Modal.Header>
      <Modal.Body>
        <FieldArray name={`serviceOptions`}>
          {({ push, remove }) => (
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
                    name={`serviceOptions.${optionId}.overwrite[${index}].assistant_id`}
                    className="hidden"
                  />
                  <div className="w-full xl:w-1/4">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Duration <span className="text-meta-1">*</span>
                    </label>
                    <Field
                      as="select"
                      className="rounded border-[1.5px] border-stroke border-stroke"
                      name={`serviceOptions.${optionId}.overwrite[${index}].time`}
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
                      className="rounded border-[1.5px] border-stroke border-stroke"
                      name={`serviceOptions[${optionId}].overwrite[${index}].price_type`}
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
          )}
        </FieldArray>
      </Modal.Body>
      <Modal.Footer className="justify-between">
        <button
          className="mt-4 rounded bg-black px-4 py-2 text-white hover:bg-blue-600"
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
      </Modal.Footer>
    </Modal>
  );
};

export default AdvancedPricingDialog;
