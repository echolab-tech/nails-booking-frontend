import { Field, FieldArray } from "formik";
import Select from "react-select";

interface AdvancedPricingDialogProps {
  formik: any;
  selectedOptionPriceType: any;
  handleChangeOptionPriceType: any;
  optionPriceType: any;
  showDialog: boolean;
  toggleDialog: () => void;
}

const AdvancedPricingDialog: React.FC<AdvancedPricingDialogProps> = ({
  formik,
  selectedOptionPriceType,
  handleChangeOptionPriceType,
  optionPriceType,
  showDialog,
  toggleDialog,
}) => {
  if (!showDialog) return null;

  return (
    <FieldArray name={`serviceOptions`}>
      {({ push, remove }) => (
        <div>
          {formik?.values?.assistantServices.map(
            (assistant: any, index: any) => (
              <div
                key={index}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className="mx-auto w-10/12 rounded-lg bg-white px-6 py-6 shadow-lg md:w-9/12 lg:w-8/12 xl:w-7/12">
                  <div
                    className="flex w-full flex-col gap-6 px-5"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <div className="mt-5 flex w-full items-center xl:w-1/4">
                        <img
                          src="https://didongviet.vn/dchannel/wp-content/uploads/2023/08/hinh-nen-3d-hinh-nen-iphone-dep-3d-didongviet@2x-576x1024.jpg"
                          alt=""
                          className="mr-3 h-16 w-16 rounded-full"
                        />
                        <label className="block text-sm font-medium text-black dark:text-white">
                          {assistant.name}
                        </label>
                      </div>
                      <div className="w-full xl:w-1/4">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Price type <span className="text-meta-1">*</span>
                        </label>
                        <Select
                          value={selectedOptionPriceType}
                          onChange={handleChangeOptionPriceType}
                          options={optionPriceType}
                          isSearchable={true}
                          placeholder="Search..."
                          primaryColor={""}
                        />
                      </div>
                      <div className="w-full xl:w-1/4">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Price <span className="text-meta-1">*</span>
                        </label>
                        <Field
                          type="text"
                          placeholder="$0.00"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-1.5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4.5 flex flex-col justify-end gap-6 px-5 xl:flex-row">
                    <button
                      className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={toggleDialog}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </FieldArray>
  );
};

export default AdvancedPricingDialog;
