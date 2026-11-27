"use client";
import React from "react";
import { Field } from "formik";

/**
 * Q6 (Miro Frame 1 #6): màu của khách, tượng trưng cho độ uy tín.
 * Orange được gắn khi Manager chọn "Add Orange to the name" lúc dời hẹn; Manager bỏ màu ở Edit customer.
 */
export const CUSTOMER_COLORS: Record<string, { label: string; className: string }> = {
  green: { label: "Green — trusted", className: "bg-green-500 text-white" },
  orange: { label: "Orange — often late / rescheduled", className: "bg-orange-500 text-white" },
  red: { label: "Red — unreliable", className: "bg-red text-white" },
};

export const CustomerColorField = () => (
  <>
    <label className="mb-2 mt-4 block text-sm font-medium text-black dark:text-white">
      Color (reputation)
    </label>
    <Field
      as="select"
      name="color"
      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    >
      <option value="">None</option>
      {Object.entries(CUSTOMER_COLORS).map(([value, { label }]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Field>
  </>
);

/** Tên khách có tô màu uy tín (nếu có) */
export const CustomerName = ({
  name,
  color,
  className = "",
}: {
  name?: string | null;
  color?: string | null;
  className?: string;
}) => {
  const style = color ? CUSTOMER_COLORS[color] : undefined;
  if (!style) return <span className={className}>{name}</span>;
  return (
    <span
      className={`${className} rounded px-1.5 ${style.className}`}
      title={style.label}
    >
      {name}
    </span>
  );
};
