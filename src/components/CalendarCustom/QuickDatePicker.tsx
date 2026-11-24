"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "flowbite-react";

/**
 * Miro Frame 1 #1 / #2: hộp lịch nhỏ đặt sau Tháng/Ngày/Năm trên cùng của Calendar.
 * Khi mở ra hiện 3 cột: Tháng (12), Ngày (28–31 theo tháng), Năm (chỉ năm hiện tại và năm kế tiếp).
 * Dùng để nhảy nhanh đến ngày hẹn 3–12 tháng tới mà không phải bấm next từng tuần.
 */
interface QuickDatePickerProps {
  open: boolean;
  currentDate: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const columnClass =
  "h-56 w-full overflow-y-auto rounded border border-stroke bg-white text-center text-lg dark:border-strokedark dark:bg-boxdark";

const QuickDatePicker = ({ open, currentDate, onClose, onSelect }: QuickDatePickerProps) => {
  const thisYear = new Date().getFullYear();
  const years = useMemo(() => [thisYear, thisYear + 1], [thisYear]);

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [day, setDay] = useState(currentDate.getDate());

  useEffect(() => {
    if (open) {
      const y = currentDate.getFullYear();
      setYear(years.includes(y) ? y : thisYear);
      setMonth(currentDate.getMonth() + 1);
      setDay(currentDate.getDate());
    }
  }, [open, currentDate, years, thisYear]);

  const maxDay = daysInMonth(year, month);
  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [maxDay, day]);

  const itemClass = (active: boolean) =>
    `block w-full py-2 ${active ? "bg-primary font-bold text-white" : "hover:bg-gray-2 dark:hover:bg-meta-4"}`;

  return (
    <Modal show={open} size="lg" onClose={onClose}>
      <Modal.Header>Go to date</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="mb-1 text-center text-sm font-semibold">Month</div>
            <div className={columnClass} role="listbox" aria-label="Month">
              {MONTHS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={itemClass(month === i + 1)}
                  onClick={() => setMonth(i + 1)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-center text-sm font-semibold">Day</div>
            <div className={columnClass} role="listbox" aria-label="Day">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={itemClass(day === d)}
                  onClick={() => setDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-center text-sm font-semibold">Year</div>
            <div className={columnClass} role="listbox" aria-label="Year">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={itemClass(year === y)}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
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
            onClick={() => onSelect(new Date(year, month - 1, Math.min(day, maxDay)))}
            className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Go
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default QuickDatePicker;
