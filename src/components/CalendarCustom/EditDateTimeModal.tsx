"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";

/**
 * Miro Frame 1 #86: click vào 1 service → "Edit Date & Time" → chọn lại ngày / giờ
 * → hệ thống dời service đến ngày/giờ mới trong Calendar.
 * Ngày và giờ là 2 ô riêng, lớn, dễ chọn (Miro #10).
 */
interface EditDateTimeModalProps {
  open: boolean;
  initialStart?: string | null; // ISO hoặc "YYYY-MM-DD HH:mm:ss"
  onClose: () => void;
  onSave: (date: string, time: string) => Promise<void> | void;
}

const inputClass =
  "w-full rounded border border-stroke px-4 py-4 text-xl text-dark dark:border-strokedark dark:bg-boxdark dark:text-white";

const EditDateTimeModal = ({ open, initialStart, onClose, onSave }: EditDateTimeModalProps) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const m = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/.exec(initialStart ?? "");
    setDate(m?.[1] ?? "");
    setTime(m?.[2] ?? "");
  }, [open, initialStart]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(date, time);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={open} size="lg" onClose={onClose}>
      <Modal.Header>Edit Date &amp; Time</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-semibold">Date</span>
            <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block font-semibold">Time</span>
            <input
              type="time"
              step={300}
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-zinc-800 px-4 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!date || !time || saving}
            onClick={handleSave}
            className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-4"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditDateTimeModal;
