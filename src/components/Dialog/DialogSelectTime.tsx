"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface DialogSelectTimeProps {
  message: string;
  onClose: () => void;
  openModal: boolean;
  handleChangeDate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Miro Frame 1 #10: "Hệ thống hiện lên hộp Calendar và hộp thời gian (lớn để dễ thấy)
 * cho Manager có thể chọn vào 1 trong 2; hoặc trong cả 2 hộp".
 * Trước đây là 1 ô datetime-local nhỏ (phải tự nhập giờ) và không cho chọn ngày hôm nay.
 */
export function DialogSelectTime({
  openModal,
  message,
  onClose,
  handleChangeDate,
}: DialogSelectTimeProps) {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (openModal) {
      setDate("");
      setTime("");
      setError("");
    }
  }, [openModal]);

  const handleOk = () => {
    if (!date || !time) {
      setError("Please select both a date and a time");
      return;
    }
    const selected = new Date(`${date}T${time}:00`);
    if (selected.getTime() <= Date.now()) {
      setError("You cannot select a time in the past");
      return;
    }
    setError("");
    const event = {
      target: { value: `${date}T${time}:00` },
    } as React.ChangeEvent<HTMLInputElement>;
    handleChangeDate(event);
    onClose();
  };

  const inputClass = `w-full rounded border px-4 py-4 text-xl text-dark ${
    error ? "border-red" : "border-stroke focus:border-primary"
  }`;

  return (
    <Modal show={openModal} size="lg" onClose={() => onClose()} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="text-gray-400 dark:text-gray-200 mx-auto mb-4 h-14 w-14" />
          <h3 className="text-gray-500 dark:text-gray-400 mb-5 text-lg font-normal">
            {message}
          </h3>
          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-lg font-semibold text-primary">Date</span>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError("");
                }}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-lg font-semibold text-primary">Time</span>
              <input
                type="time"
                step={300}
                className={inputClass}
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError("");
                }}
              />
            </label>
          </div>
          {error && <p className="mt-2 text-left text-sm text-red">{error}</p>}
          <div className="mt-5 flex justify-center gap-4">
            <Button color="gray" onClick={onClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleOk} disabled={!date || !time}>
              OK
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
