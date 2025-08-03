"use client";
import React, { useEffect, useState } from "react";
import { CustomerType } from "../../types/customer";
import { FaArrowLeft } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

import {
  addCustomersBooking,
  customers,
  getAllCustomer,
} from "@/services/customer.service";
import { toast } from "react-toastify";
import { useAppointment } from "@/contexts/AppointmentContext";
import { getListAppointmentCustomer } from "@/services/appointment.service";

interface StepAddCustomerProps {
  handleNext: () => void;
  handleBackToCalendar: () => void;
}

interface PastAppointment {
  id: number;
  date: string;
  time: string;
  status: string;
  services: {
    name: string;
    price: number;
    service: string;
    duration: string;
  }[];
}

const StepAddCustomer = ({
  handleNext,
  handleBackToCalendar,
}: StepAddCustomerProps) => {
  const { state, dispatch } = useAppointment();
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [showCustomerList, setShowCustomerList] = useState(true);
  const [pastAppointments, setPastAppointments] = useState<PastAppointment[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomer(searchTerm);
    if (isOpenDialog) {
      setNewCustomer((prev) => ({
        ...prev,
        phone: searchTerm,
      }));
    }
  }, [searchTerm, isOpenDialog]);

  const fetchCustomer = async (searchTerm: string) => {
    try {
      const response = await getAllCustomer(searchTerm);
      setCustomerData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleCustomerSelect = async (customer: CustomerType) => {
    if (customer.status === 2) {
      toast.error("This customer is not allowed to make bookings");
      return;
    }
    
    dispatch({ type: "SET_CUSTOMER", payload: customer });
    setShowCustomerList(false);
    setLoading(true);
    try {
      const response = await getListAppointmentCustomer(customer?.id);
      console.log(response?.data?.data);
      
      setPastAppointments(response?.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setIsOpenDialog(true);
  };

  const formatPhoneNumber = (value: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const cleaned = value.replace(/\D/g, "");

    // Định dạng số: (xxx) xxx-xxxx
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue); // Định dạng số điện thoại
    setNewCustomer({ ...newCustomer, phone: formattedValue });
  };

  const handlePhoneSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setSearchTerm(formattedValue);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setNewCustomer({ name: "", phone: "" }); // Reset form khi đóng
  };

  const handleSaveCustomer = async () => {
    try {
      const response = await addCustomersBooking(newCustomer); // Gửi dữ liệu khách hàng mới
      if (response.status === 200) {
        // Kiểm tra mã trạng thái HTTP

        toast.success("Add customer successfully.");
        setTimeout(() => {
          fetchCustomer(searchTerm);
        }, 1000);
        handleCustomerSelect(response.data.data);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
    handleCloseDialog();
  };

  const handleEdit = (appointmentId: number) => {
    // Implement edit logic
    console.log("Edit appointment:", appointmentId);
  };

  const handleCancel = (appointmentId: number) => {
    // Implement cancel logic
    console.log("Cancel appointment:", appointmentId);
  };

  const handleBackToCustomerList = () => {
    setShowCustomerList(true);
    setPastAppointments([]);
    dispatch({ type: "SET_CUSTOMER", payload: null });
  };

  const appointmentIds = state.appointments.map(appointment => appointment?.customer?.id);

  return (
    <div className="w-full space-y-8 rounded-lg bg-white p-10 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-2xl font-bold text-primary">
            Select customer
          </h3>
          <p className="text-sm">Please select the customer we need to serve</p>
        </div>
        <input
          type="text"
          value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          onChange={handlePhoneSearchChange}
          placeholder="Search customers..."
          className="w-[30%] rounded border border-gray-300 px-4 py-2"
        />
      </div>

      {showCustomerList ? (
        <>
          {customerData.length > 0 ? (
            <div className="mt-4 space-y-4">
              {customerData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCustomerSelect(item)}
                  style={{ backgroundColor: item.status_info?.color_code || "#fff" }}
                  className={`text-dark flex w-full items-center rounded border border-stroke px-4 py-4 font-semibold hover:bg-gray-2 ${
                    appointmentIds.includes(item.id) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={appointmentIds.includes(item.id)}
                >
                  <span className="text-lg font-medium">{item.name}</span>
                  <span className="ml-auto text-lg font-medium">
                    {item.phone}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <button
                  onClick={handleAddCustomer}
                  className="hover:bg-primary-dark mt-4 rounded bg-primary px-4 py-2 text-white"
                >
                  add customer
                </button>
              </div>
              {isOpenDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <h2 className="mb-4 text-center text-xl font-bold">
                      Add Customer New
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-700 block text-sm font-medium">
                          Name
                        </label>
                        <input
                          type="text"
                          value={newCustomer.name}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter customer name"
                          className="mt-1 w-full rounded border border-gray-300 px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 block text-sm font-medium">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={newCustomer.phone}
                          // onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                          onChange={handlePhoneChange}
                          placeholder="Enter customer phone"
                          className="mt-1 w-full rounded border border-gray-300 px-4 py-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        onClick={handleCloseDialog}
                        className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCustomer}
                        className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl text-primary">
              Past Appointments for{" "}
              {
                state.appointments[state.currentAppointmentIndex]?.customer
                  ?.name
              }
            </h3>
            <div className="space-x-4">
              <button
                onClick={handleBackToCustomerList}
                className="rounded-lg border px-4 py-2"
              >
                Back to Customer List
              </button>
              <button
                onClick={handleNext}
                className="rounded-lg bg-primary px-4 py-2 text-white"
              >
                Book new appointment
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center">Loading past appointments...</div>
          )}
          {!loading && (
            <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No past appointments found
                </p>
              ) : (
                pastAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-primary p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">
                          Date:{" "}
                          {appointment?.date}
                        </p>
                        <p>
                          Time:{" "}
                          {appointment?.time}
                        </p>
                        <p>Status: {appointment.status}</p>
                        <div className="mt-2">
                          <p className="font-medium">Services:</p>
                          <ul className="list-inside list-disc">
                            {appointment.services.map((service, index) => (
                              <li key={index}>
                                {service.service} - ${service.price} - {service?.duration}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(appointment.id)}
                          className="rounded-lg bg-blue-500 px-3 py-1 text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="bg-red rounded-lg px-3 py-1 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackToCalendar}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white disabled:bg-gray-4"
        >
          <FaArrowLeft />
          Back
        </button>
      </div>
    </div>
  );
};

export default StepAddCustomer;
