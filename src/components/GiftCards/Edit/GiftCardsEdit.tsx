"use client";

import ToggleSwitch from "@/components/Service/NewFormService/ToggleSwitch";
import { giftCardsType } from "@/types/giftCards";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getGiftCard, editGiftCard } from "@/services/giftcards.service";
import { BsTrash } from "react-icons/bs";

const GiftCardsEdit = () => {
  const [giftCard, setGiftCard] = useState<giftCardsType>();
  const [presetValues, setPresetValues] = useState<string[]>([]);
  const [expirationPeriod, setExpirationPeriod] = useState<number | undefined>(
    undefined,
  );
  const router = useRouter();

  useEffect(() => {
    const fetchGiftCardData = async () => {
      try {
        const response = await getGiftCard();
        const statusCovert = response?.data?.data?.status ? true : false;
        setGiftCard({
          ...response?.data?.data,
          status: statusCovert,
        });
        setPresetValues(response?.data?.data?.allValues);
        setExpirationPeriod(response?.data?.data?.expiration);
      } catch (error) {
        toast.error("Failed to fetch gift card data.");
      }
    };

    fetchGiftCardData();
  }, []);

  const EditGiftCardsSchema = Yup.object().shape({});

  if (!giftCard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold">Gift card settings</h2>

      <Formik
        initialValues={{
          status: giftCard?.status,
          expiration: expirationPeriod,
          values: giftCard?.values?.map((item) => {
            return item;
          }) || ["20000"],
        }}
        validationSchema={EditGiftCardsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await editGiftCard(values);
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
                  value={values?.status}
                  handleChange={() => setFieldValue("status", !values.status)}
                />
              </div>
            </div>
            {values.status && (
              <>
                <div
                  className={`mb-3.5 grid grid-cols-2 gap-4 rounded-xl border p-4`}
                >
                  <div className="mb-4">
                    <p className="font-bold">Values</p>
                    <p>
                      Choose preset values that allow clients to quickly select
                      an amount, and enable custom values within minimum and
                      maximum.
                    </p>
                    {values?.values?.map((value, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center space-x-2"
                      >
                        <Field
                          type="text"
                          name={`values.${index}`}
                          value={value}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={!values.status}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            !values.status ? "cursor-not-allowed" : ""
                          }`}
                        />
                        <ErrorMessage
                          name={`values.${index}`}
                          component="div"
                          className="text-red"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "values",
                              values.values.filter((_, i) => i !== index),
                            )
                          }
                        >
                          <BsTrash color="red" size={30} />
                        </button>
                      </div>
                    ))}
                    {values.values.length < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue("values", [...values.values, "20000"])
                        }
                        className={`mt-2 rounded-md border px-4 py-2 text-black ${
                          !values.status ? "cursor-not-allowed" : ""
                        }`}
                        disabled={!values.status}
                      >
                        Add a value
                      </button>
                    )}
                    {errors.values == "Please add at least one value" && (
                      <ErrorMessage
                        name="values"
                        component="div"
                        className="text-red"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`mb-3.5 grid grid-cols-2 gap-4 rounded-xl border p-4`}
                >
                  <div className="mb-4">
                    <p className="font-bold">Expiration</p>
                    <p>
                      Choose your default expiration period for all sold gift
                      cards. Changing this only affects newly sold gift cards.
                    </p>
                    <p className="font-bold">Minimum value</p>
                    <Field
                      as="select"
                      id="expiration"
                      name="expiration"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
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
              </>
            )}
            <div className="flex justify-center">
              <button
                className="mx-1 mt-4 w-[150px] rounded-md border px-6 py-2 text-black"
                onClick={router.back}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mx-1 mt-4 w-[150px] rounded-md bg-primary px-6 py-2 text-white`}
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
