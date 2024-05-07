import { useState } from "react";

interface ToastProps {
  message: String;
  type: String;
  isShow: boolean;
}
const Toast = (prop: ToastProps) => {
  const colors = {
    success: "bg-teal-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  const bgColor = colors["warning"];
  if (prop.type == "error") {
    const bgColor = colors["error"];
  }
  if (prop.type == "warning") {
    const bgColor = colors["warning"];
  }

  if (prop.type == "success") {
    const bgColor = colors["success"];
  }
  return (
    <div
      className={`${prop.isShow ? "block" : "hidden"} bg-gray-800 absolute right-1 top-1 w-100 max-w-xs rounded-xl text-sm text-white shadow-lg ${bgColor}`}
      role="alert"
    >
      <div className="flex p-4">
        {prop.message}
        <div className="ms-auto">
          <button
            type="button"
            className="inline-flex size-5 flex-shrink-0 items-center justify-center rounded-lg text-white opacity-50 hover:text-white hover:opacity-100 focus:opacity-100 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg
              className="size-4 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
