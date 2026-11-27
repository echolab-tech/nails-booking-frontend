"use client";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "flowbite-react";

/**
 * Miro Frame 1 #6 — popup sau khi dời 1 service đến thời gian / thợ khác:
 *   1) Is this service now requested this technician? Yes / No
 *   2) Add Orange to the name for this Customer? Yes / No  (Q6: Status → "The customer is late")
 *   3) Notifying this Customer? Yes / No
 *   Next
 * Nếu Manager không nhấn Next sau 60 giây → service được trả về vị trí cũ.
 */
interface DragConfirmModalProps {
  open: boolean;
  initialRequested: boolean;
  timeoutSeconds?: number;
  onNext: (options: { isRequested: boolean | null; markOrange: boolean; notifyCustomer: boolean }) => void;
  onCancel: () => void;
  onTimeout: () => void;
}

const YesNo = ({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex gap-2">
    {[true, false].map((v) => (
      <button
        key={String(v)}
        type="button"
        onClick={() => onChange(v)}
        className={`rounded px-4 py-1.5 font-medium ${
          value === v ? "bg-primary text-white" : "border border-stroke text-black dark:text-white"
        }`}
      >
        {v ? "Yes" : "No"}
      </button>
    ))}
  </div>
);

const DragConfirmModal = ({
  open,
  initialRequested,
  timeoutSeconds = 60,
  onNext,
  onCancel,
  onTimeout,
}: DragConfirmModalProps) => {
  const [isRequested, setIsRequested] = useState<boolean | null>(null);
  const [orange, setOrange] = useState<boolean | null>(null);
  const [notify, setNotify] = useState<boolean | null>(null);
  const [left, setLeft] = useState(timeoutSeconds);
  const timeoutRef = useRef(onTimeout);
  timeoutRef.current = onTimeout;

  useEffect(() => {
    if (!open) return;
    setIsRequested(null); // không chọn → giữ trạng thái cũ
    setOrange(null);
    setNotify(null);
    setLeft(timeoutSeconds);
    const timer = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          timeoutRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open, timeoutSeconds]);

  return (
    <Modal show={open} size="lg" onClose={onCancel}>
      <Modal.Header>Move this service</Modal.Header>
      <Modal.Body>
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <span>
              1) Is this service now requested this technician?
              <span className="block text-xs text-gray-500">
                Currently: {initialRequested ? "requested" : "not requested"}
              </span>
            </span>
            <YesNo value={isRequested} onChange={setIsRequested} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>
              2) Add Orange to the name for this customer?
              <span className="block text-xs text-gray-500">
                Sets the customer status to “The customer is late”.
              </span>
            </span>
            <YesNo value={orange} onChange={setOrange} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>
              3) Notifying this customer?
              <span className="block text-xs text-gray-500">
                Delays over 29 minutes are always notified.
              </span>
            </span>
            <YesNo value={notify} onChange={setNotify} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Moving back automatically in <b>{left}s</b>
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded bg-zinc-800 px-4 py-2 font-medium text-white hover:bg-opacity-90"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onNext({ isRequested, markOrange: orange === true, notifyCustomer: notify === true })}
              className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DragConfirmModal;
