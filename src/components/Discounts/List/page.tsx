"use client";
import React from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { sendDiscounts } from "@/services/discounts.service";

const DiscountsForm = () => {
  const formik = useFormik({
    initialValues: {
      discountsContent: "",
      customerCategory: "",
    },
    validationSchema: Yup.object({
      discountsContent: Yup.string().required("Discount content is required."),
      customerCategory: Yup.string().required(
        "Please select a customer category.",
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await sendDiscounts({
          discounts_content: values.discountsContent,
          send_to: values.customerCategory,
        });
        formik.resetForm();
        alert("Discounts sent successfully!");
      } catch (error) {
        alert("Failed to send discounts. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-6 text-2xl font-bold">Send Discounts</h1>

      <form onSubmit={formik.handleSubmit}>
        <div>
          <label className="text-gray-700 mb-2 block font-bold">
            Discounts Content:
          </label>
          {/* Thông báo lỗi cho Discount Content */}
          {formik.errors.discountsContent &&
            formik.touched.discountsContent && (
              <p className="text-fuchsia-500">
                {formik.errors.discountsContent}
              </p>
            )}
          <textarea
            className={`w-full rounded-lg border p-2`}
            placeholder="Promotional content..."
            {...formik.getFieldProps("discountsContent")}
          />
        </div>

        <div>
          <label className="text-gray-700 mb-2 block font-bold">
            Select Customer Category:
          </label>
          {/* Thông báo lỗi cho Customer Category */}
          {formik.errors.customerCategory &&
            formik.touched.customerCategory && (
              <p className="text-fuchsia-500">
                {formik.errors.customerCategory}
              </p>
            )}
          <div className="flex flex-col space-y-2">
            {[
              "not_visited_in_a_month",
              "regular_customers",
              "all_customers",
            ].map((category) => (
              <label className="flex items-center" key={category}>
                <input
                  type="radio"
                  name="customerCategory"
                  value={category}
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                {category === "not_visited_in_a_month" &&
                  "Only customers who haven't visited in over a month"}
                {category === "regular_customers" &&
                  "Only regular customers (visited in the last month)"}
                {category === "all_customers" && "Send to all customers"}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className={`rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 ${
              formik.isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {formik.isSubmitting ? "Sending..." : "Send Discounts"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscountsForm;
