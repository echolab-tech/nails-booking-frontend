import { sendDelay } from "@/services/delay.service";
import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import React, { ReactNode, useState } from "react";
import * as Yup from "yup";

interface DelayNotifyModalProps {
  bookingDetailId: string;
  openModal: boolean;
  handleClose: () => void;
  handleSend: () => void;
}

const delayOptions = [
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: "custom", label: "Custom" },
];

const DelayNotifyModal = ({
  bookingDetailId,
  openModal,
  handleClose,
  handleSend,
}: DelayNotifyModalProps) => {
  const formikDelay = useFormik<any>({
    initialValues: {
      delayMinutes: "",
      customDelay: "",
      bookingDetailId: bookingDetailId,
    },
    validationSchema: Yup.object({
      delayMinutes: Yup.string().required("Please select a delay time"),
      customDelay: Yup.number().when("delayMinutes", {
        is: "custom",
        then: (schema) =>
          schema
            .typeError("Please enter a valid number")
            .required("Please enter custom delay time")
            .positive("Delay must be greater than 0"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      await sendDelay(values);
      handleSend();
    },
    enableReinitialize: true,
  });
  return (
    <>
      <Modal show={openModal} size="xl" onClose={handleClose} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <form onSubmit={formikDelay.handleSubmit}>
              {/* Select */}
              <div className="mb-3">
                <select
                  name="delayMinutes"
                  value={formikDelay.values.delayMinutes}
                  onChange={(e) => {
                    const val = e.target.value;
                    formikDelay.setFieldValue("delayMinutes", val);
                    if (val !== "custom") {
                      formikDelay.setFieldValue("customDelay", "");
                    }
                  }}
                  onBlur={formikDelay.handleBlur}
                  className="w-full rounded-md border px-2 py-1"
                >
                  <option value="">-- Select delay time --</option>
                  {delayOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {formikDelay.errors.delayMinutes &&
                  formikDelay.touched.delayMinutes && (
                    <p className="mt-1 text-sm text-red">
                      {formikDelay.errors.delayMinutes as ReactNode}
                    </p>
                  )}
              </div>

              {/* Custom input */}
              {formikDelay.values.delayMinutes === "custom" && (
                <div className="mb-3">
                  <input
                    type="number"
                    min="1"
                    name="customDelay"
                    placeholder="Enter custom minutes"
                    value={formikDelay.values.customDelay}
                    onChange={formikDelay.handleChange}
                    onBlur={formikDelay.handleBlur}
                    className="w-full rounded-md border px-2 py-1"
                  />
                </div>
              )}

              {formikDelay.errors.customDelay &&
                formikDelay.touched.customDelay && (
                  <p className="mt-1 text-sm text-red">
                    {formikDelay.errors.customDelay as ReactNode}
                  </p>
                )}
              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
              >
                Send Delay Notification
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DelayNotifyModal;
