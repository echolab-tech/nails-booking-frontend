"use client";

import ToggleSwitch from "@/components/Service/NewFormService/ToggleSwitch";
import { giftCardsType } from "@/types/giftCards";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getGiftCard, editGiftCard } from "@/services/giftcards.service";

const GiftCardsEdit = () => {
  const [giftCards, setGiftCards] = useState<giftCardsType>();
  const [presetValues, setPresetValues] = useState<string[]>([]);
  const [expirationPeriod, setExpirationPeriod] = useState<number | undefined>(
    undefined,
  );
  const router = useRouter();

  useEffect(() => {
    const fetchGiftCardData = async () => {
      try {
        const response = await getGiftCard();
        const data = response.data[0];
        const convertedStatus = data.status === 1;

        setGiftCards({
          ...data,
          status: convertedStatus,
        });
        setPresetValues(data.allValues);
        setExpirationPeriod(data.expiration);
      } catch (error) {
        toast.error("Failed to fetch gift card data.");
      }
    };

    fetchGiftCardData();
  }, []);

  const handleAddValue = () => {
    if (presetValues.length < 5) {
      setPresetValues([...presetValues, ""]);
    }
  };

  const handleRemoveValue = (index: number) => {
    setPresetValues(presetValues.filter((_, i) => i !== index));
  };

  const EditGiftCardsSchema = Yup.object().shape({
    expiration: Yup.number()
      .positive()
      .integer()
      .required("Vui lòng nhập giá trị tối thiểu"),
    allValues: Yup.array().of(Yup.string().required("Required")),
    value1: Yup.string().required("Required"),
    value2: Yup.string().required("Required"),
    value3: Yup.string().required("Required"),
    value4: Yup.string().required("Required"),
    value5: Yup.string().required("Required"),
  });

  if (!giftCards) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold">Gift card settings</h2>

      <Formik
        initialValues={{
          status: giftCards?.status,
          expiration: expirationPeriod,
          value1: presetValues[0],
          value2: presetValues[1],
          value3: presetValues[2],
          value4: presetValues[3],
          value5: presetValues[4],
        }}
        validationSchema={EditGiftCardsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const updatedGiftCard = {
              ...values,
            };

            await editGiftCard(updatedGiftCard);
            toast.success("Gift card updated successfully!");
            setSubmitting(false);
            router.back();
          } catch (error) {
            console.error("Error updating gift card:", error);
            toast.error("Failed to update gift card.");
            setSubmitting(false);
          }
        }}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-3.5 grid grid-cols-2 gap-4 rounded-xl border p-4">
              <div>
                <p className="font-bold">Gift cards</p>
                <p>Sell and redeem gift cards at your business.</p>
              </div>
              <div className="flex items-center justify-around">
                <ToggleSwitch
                  name="status"
                  value={values.status}
                  handleChange={() => setFieldValue("status", !values.status)}
                />
              </div>
            </div>

            <div
              className={`mb-3.5 grid grid-cols-2 gap-4 rounded-xl border p-4 ${
                !values.status ? "opacity-50" : ""
              }`}
            >
              <div className="mb-4">
                <p className="font-bold">Values</p>
                <p>
                  Choose preset values that allow clients to quickly select an
                  amount, and enable custom values within minimum and maximum.
                </p>
                {presetValues?.map((value, index) => (
                  <div key={index} className="mb-2 flex items-center space-x-2">
                    <Field
                      type="text"
                      name={`allValues.${index}`}
                      value={value}
                      onChange={(e: any) => {
                        const newValue = e.target.value;
                        setPresetValues((prevValues) =>
                          prevValues.map((v, i) =>
                            i === index ? newValue : v,
                          ),
                        );
                      }}
                      onBlur={handleBlur}
                      disabled={!values.status}
                      className={`border-gray-300 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        !values.status ? "cursor-not-allowed" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveValue(index)}
                      className={`bg-red-500 rounded-md px-2 py-1 text-white ${
                        !values.status ? "cursor-not-allowed" : ""
                      }`}
                      disabled={!values.status}
                    >
                      <svg
                        color="black"
                        className="fill-current"
                        width="30"
                        height="30"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.375 3.375H12.4688V2.8125C12.4688 1.80938 11.6597 1 10.6562 1H7.34375C6.34062 1 5.53125 1.80938 5.53125 2.8125V3.375H2.625C2.27812 3.375 2 3.65312 2 4C2 4.34688 2.27812 4.625 2.625 4.625H3.06875L3.625 15.2781C3.66562 16.1813 4.42188 16.875 5.325 16.875H12.675C13.5812 16.875 14.3344 16.1844 14.375 15.2781L14.9313 4.625H15.375C15.7219 4.625 16 4.34688 16 4C16 3.65312 15.7219 3.375 15.375 3.375ZM6.15625 2.8125C6.15625 2.525 6.35625 2.3125 6.625 2.3125H11.375C11.6625 2.3125 11.875 2.525 11.875 2.8125V3.375H6.15625V2.8125ZM13.125 15.2125C13.1094 15.5625 12.825 15.8438 12.475 15.8438H5.325C4.975 15.8438 4.69062 15.5625 4.675 15.2125L4.12188 4.625H13.8781L13.125 15.2125Z"
                          fill=""
                        />
                        <path
                          d="M7.25 14.125C7.59688 14.125 7.875 13.8469 7.875 13.5V7.53125C7.875 7.18437 7.59688 6.90625 7.25 6.90625C6.90312 6.90625 6.625 7.18437 6.625 7.53125V13.5C6.625 13.8469 6.90312 14.125 7.25 14.125Z"
                          fill=""
                        />
                        <path
                          d="M10.75 14.125C11.0969 14.125 11.375 13.8469 11.375 13.5V7.53125C11.375 7.18437 11.0969 6.90625 10.75 6.90625C10.4031 6.90625 10.125 7.18437 10.125 7.53125V13.5C10.125 13.8469 10.4031 14.125 10.75 14.125Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                {presetValues.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddValue}
                    className={`mt-2 rounded-md border px-4 py-2 text-black ${
                      !values.status ? "cursor-not-allowed" : ""
                    }`}
                    disabled={!values.status}
                  >
                    Add a value
                  </button>
                )}
              </div>
            </div>

            <div
              className={`mb-3.5 grid grid-cols-2 gap-4 rounded-xl border p-4 ${
                !values.status ? "opacity-50" : ""
              }`}
            >
              <div className="mb-4">
                <p className="font-bold">Expiration</p>
                <p>
                  Choose your default expiration period for all sold gift cards.
                  Changing this only affects newly sold gift cards.
                </p>
                <p className="font-bold">Minimum value</p>
                <Field
                  as="select"
                  id="expiration"
                  name="expiration"
                  className={`border-gray-300 mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    !values.status ? "cursor-not-allowed" : ""
                  }`}
                  disabled={!values.status}
                >
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="180">180 days</option>
                  <option value="365">365 days</option>
                </Field>
                <p>Expiration period starts from the date of purchase.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className="mx-1 mt-4 w-[150px] rounded-md border px-6 py-2 text-black"
                onClick={router.back}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!values.status || isSubmitting}
                className={`mx-1 mt-4 w-[150px] rounded-md px-6 py-2 text-white ${
                  !values.status ? "bg-gray-400" : "bg-green-500"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GiftCardsEdit;
