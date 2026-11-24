"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Miro Frame 1 #19: chọn ngày sinh bằng 3 ô Tháng / Ngày / Năm.
 * Năm là danh sách cuộn (không phải bấm lùi từng tháng như date picker mặc định).
 * value / onChange dùng định dạng "YYYY-MM-DD" ("" nếu chưa chọn đủ).
 */
interface BirthdayPickerProps {
  value?: string | null;
  onChange: (value: string) => void;
  name?: string;
  yearsBack?: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const selectClass =
  "w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary";

const daysInMonth = (year: number, month: number) =>
  new Date(year || 2000, month, 0).getDate(); // month: 1-12; năm trống → dùng năm nhuận 2000

const BirthdayPicker = ({ value, onChange, name, yearsBack = 100 }: BirthdayPickerProps) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
    if (m) {
      setYear(m[1]);
      setMonth(String(Number(m[2])));
      setDay(String(Number(m[3])));
    }
  }, [value]);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: yearsBack + 1 }, (_, i) => String(now - i));
  }, [yearsBack]);

  const maxDay = month ? daysInMonth(Number(year), Number(month)) : 31;

  const emit = (y: string, mo: string, d: string) => {
    if (y && mo && d) {
      const safeDay = Math.min(Number(d), daysInMonth(Number(y), Number(mo)));
      onChange(`${y}-${mo.padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`);
    } else {
      onChange("");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2" data-name={name}>
      <select
        aria-label="Birth month"
        className={selectClass}
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
          emit(year, e.target.value, day);
        }}
      >
        <option value="">Month</option>
        {MONTHS.map((label, i) => (
          <option key={label} value={String(i + 1)}>
            {label}
          </option>
        ))}
      </select>
      <select
        aria-label="Birth day"
        className={selectClass}
        value={day}
        onChange={(e) => {
          setDay(e.target.value);
          emit(year, month, e.target.value);
        }}
      >
        <option value="">Day</option>
        {Array.from({ length: maxDay }, (_, i) => String(i + 1)).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        aria-label="Birth year"
        className={selectClass}
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
          emit(e.target.value, month, day);
        }}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BirthdayPicker;
