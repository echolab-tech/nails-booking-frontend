"use client";
import React, { createContext, useContext, useState } from "react";

// Khởi tạo kiểu dữ liệu
interface AppointmentType {
  customer: any;
  services: any[];
  other_services: any[];
  serviceSummary: any;
}

interface BookingContextType {
  appointments: AppointmentType[];
  addAppointment: (appointment: AppointmentType) => void;
  updateAppointment: (
    index: number,
    updatedAppointment: AppointmentType,
  ) => void;
  resetAppointments: () => void;
}

// Khởi tạo context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider
export const BookingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  // Thêm một appointment
  const addAppointment = (appointment: AppointmentType) => {
    setAppointments((prev) => [...prev, appointment]);
  };

  // Cập nhật một appointment
  const updateAppointment = (
    index: number,
    updatedAppointment: AppointmentType,
  ) => {
    setAppointments((prev) =>
      prev.map((item, i) => (i === index ? updatedAppointment : item)),
    );
  };

  // Reset tất cả appointments
  const resetAppointments = () => {
    setAppointments([]);
  };

  return (
    <BookingContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        resetAppointments,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
