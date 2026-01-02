"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface DialogSelectTimeProps {
  message: string;
  onClose: () => void;
  openModal: boolean;
  handleChangeDate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DialogSelectTime({
  openModal,
  message,
  onClose,
  handleChangeDate,
}: DialogSelectTimeProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleOk = () => {
    const selectedDay = selectedDate.split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    if (selectedDay <= today) {
      setError("You cannot select a date in the past");
      return;
    }

    setError("");

    if (selectedDate) {
      const event = {
        target: { value: selectedDate },
      } as React.ChangeEvent<HTMLInputElement>;
      handleChangeDate(event);
    }
    onClose();
  };

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => onClose()}
        popup
        className=""
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-gray-400 dark:text-gray-200 mx-auto mb-4 h-14 w-14" />
            <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg font-normal">
              {message}
            </h3>
            <div className="space-y-4">
              <label
                htmlFor="start-time"
                className="block text-lg font-semibold text-primary"
              >
                Select Start Time
              </label>
              <input
                type="datetime-local"
                id="start-time"
                className={`w-full rounded px-4 py-2 text-dark border ${
                  error
                    ? "border-red focus:border-red focus:ring-red-500"
                    : "border-stroke focus:border-primary focus:ring-primary"
                }`}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setError("");
                }}
              />
              {error && (
                <p className="mt-1 text-left text-sm text-red">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <Button color="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="blue"
                onClick={handleOk}
                disabled={!selectedDate}
              >
                OK
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
