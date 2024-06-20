import React, { FC } from "react";
import { Field, FieldArray, FormikValues } from "formik";

interface AssistantCheckboxesProps {
  assistantData: any[];
}

const AssistantCheckboxes: FC<AssistantCheckboxesProps> = ({
  assistantData,
}) => {
  return (
    <FieldArray name="assistantServices">
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
            {assistantData.map((assistant: any, index: number) => {
              const isChecked = values.assistantServices.includes(assistant.id);
              return (
                <div key={index} className="rounded-box w-1/3 xl:w-1/3">
                  <label className="checkbox-container">
                    {assistant.name}
                    <Field
                      name="assistantServices"
                      type="checkbox"
                      value={assistant.id}
                      checked={isChecked}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          push(assistant.id);
                        } else {
                          const idx = values.assistantServices.indexOf(
                            assistant.id,
                          );
                          if (idx >= 0) remove(idx);
                        }
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </FieldArray>
  );
};

export default AssistantCheckboxes;
