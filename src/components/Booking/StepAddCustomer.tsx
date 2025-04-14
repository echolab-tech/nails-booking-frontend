"use client";
import React, { useEffect, useState } from "react";
import { CustomerType } from "../../types/customer";
import { FaArrowLeft } from "react-icons/fa";
import { addCustomersBooking, customers, getAllCustomer } from "@/services/customer.service";
import { toast } from "react-toastify";
import { useAppointment } from "@/contexts/AppointmentContext";

interface StepAddCustomerProps {
  handleNext: () => void;
  handleBackToCalendar: () => void;
}

const StepAddCustomer = ({
  handleNext,
  handleBackToCalendar,
}: StepAddCustomerProps) => {
  const [customerData, setCustomerData] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const { dispatch } = useAppointment();

  useEffect(() => {
    fetchCustomer(searchTerm);
  }, [searchTerm]);

  const fetchCustomer = async (searchTerm: string) => {
    try {
      const response = await getAllCustomer(searchTerm);
      setCustomerData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  const handleButtonClick = (customer: CustomerType) => {
    // Cập nhật customer vào context
    dispatch({
      type: "SET_CUSTOMER",
      payload: customer,
    });

    // Thêm appointment mới nếu cần
    // dispatch({ type: "ADD_APPOINTMENT" });

    // Chuyển qua step tiếp theo
    handleNext();
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

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setNewCustomer({ name: "", phone: "" }); // Reset form khi đóng
  };

  const handleSaveCustomer = async () => {
    try {
      const response = await addCustomersBooking(newCustomer); // Gửi dữ liệu khách hàng mới
  
      if (response.status === 200) { // Kiểm tra mã trạng thái HTTP
        toast.success("Add customer successfully.");
        setTimeout(() => {
          fetchCustomer(searchTerm);
        },1000);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
    handleCloseDialog();
  };


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
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          className="w-[30%] rounded border border-gray-300 px-4 py-2"
        />
      </div>

      { customerData.length > 0 ? (
        <div className="mt-4 space-y-4">
          {customerData.map((item, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(item)}
              className={`text-dark flex w-full items-center rounded border border-stroke bg-transparent px-4 py-4 font-semibold hover:bg-gray-2`}
            >
              <span className="text-lg font-medium">{item.name}</span>
              <span className="ml-auto text-lg font-medium">{item.phone}</span>
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
              <h2 className="text-xl font-bold text-center mb-4">Add Customer New</h2>
  
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Enter customer name"
                    className="mt-1 w-full rounded border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
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
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          )}
        </>
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
