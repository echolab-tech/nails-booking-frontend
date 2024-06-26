import React, { forwardRef } from "react";
import { ErrorMessage, useField } from "formik";

const CustomInput = forwardRef(({ label, ...props }, ref) => {
  const [field, meta] = useField(props);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <input {...field} {...props} ref={ref} autoComplete="true" />
      {meta.touched && meta.error ? (
        <div style={errorMessage}>{meta.error}</div>
      ) : null}
    </div>
  );
});

// Adding display name for better debugging
CustomInput.displayName = "CustomInput";

export default CustomInput;

const errorMessage = {
  color: "red",
  position: "absolute",
  fontSize: "11px",
};
