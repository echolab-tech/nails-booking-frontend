"use client";

// Status booking :
// 0 : book -> checkout
// 1 : confirm -> checkout
// 2 : cancel -> rebook
// 3 : delay -> checkout
// 4 : complete -> rebook

import React, { useState, useEffect } from "react";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";
import { getCustomerShow } from "@/services/customer.service";
import { useParams } from "next/navigation";
import { formatDateHours } from "@/components/common/format_date";

const Tabs = () => {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(1);
  const [customer, setCustomer] = useState<any | null>(null);
  const customerId = parseInt(params.id);

  useEffect(() => {
    fetchCustomer(customerId);
  }, []);

  const handleTabClick = (tabNumber: any) => {
    setActiveTab(tabNumber);
  };

  const fetchCustomer = async (customerId: number) => {
    try {
      const data = await getCustomerShow(customerId);
      const customerData = data?.data?.data;
      setCustomer(customerData);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  };

  return (
    <div className="flex rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="w-1/3 bg-gray">
        <div className="mt-7 text-center">
          <img
            src={customer?.customer?.avatar}
            alt="Avatar"
            className="border-gray-200 mx-auto mb-4 h-24 w-24 rounded-full rounded-full border"
            style={{ objectFit: "cover" }}
          />
          <h2 className="text-lg font-semibold">{customer?.customer?.name}</h2>
          <p className="text-gray-600">{customer?.customer?.email}</p>
          <div className="mt-3 flex w-full justify-center">
            <button
              type="submit"
              className="rounded border-2 bg-white p-3 font-medium text-black hover:bg-opacity-90"
            >
              Action
            </button>
            <button
              type="submit"
              className="ml-4 rounded bg-blue-600 p-3 font-medium text-white hover:bg-opacity-90"
            >
              Book Now
            </button>
          </div>
          <div className="mt-4 flex items-center pl-1">
            <LiaBirthdayCakeSolid className="mr-3" />
            <p className="text-gray-600">
              {customer?.customer?.birthday
                ? formatDateHours(customer?.customer?.birthday)
                : ""}
            </p>
          </div>
          <div className="flex items-center pl-1">
            <AiOutlineUserAdd className="mr-3" />
            <p className="text-gray-600">
              Created{" "}
              {customer?.customer?.created_at
                ? formatDateHours(customer?.customer?.created_at)
                : ""}
            </p>
          </div>
        </div>
      </div>
      {/* hiển thị tab */}
      <div className="bg-gray-200 w-2/3 p-4">
        <div className="mb-4 flex justify-center">
          <button
            className={`mr-2 rounded-3xl px-4 py-2 ${
              activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Overview
          </button>
          <button
            className={`mr-2 rounded-3xl px-4 py-2 ${
              activeTab === 2 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Appointments
          </button>
          <button
            className={`mr-2 rounded-3xl px-4 py-2 ${
              activeTab === 3 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Sales
          </button>
          <button
            className={`rounded-3xl px-4 py-2 ${
              activeTab === 4 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleTabClick(4)}
          >
            Client details
          </button>
        </div>

        {/* Nội dung từng tab */}
        <div className="mt-4">
          {activeTab === 1 && (
            <div className="flex font-bold">
              <div className="w-full">
                <h2 className="mb-4 text-lg font-semibold">Wallet</h2>
                <div className="flex rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="w-3/4">
                    <div className="my-8 ms-8">Balance</div>
                    <div className="my-8 ms-8">đ 100.000.00</div>
                  </div>
                  <div className="flex w-1/4 items-center justify-center">
                    <div>
                      <BsExclamationCircle className="size-10" />
                    </div>
                  </div>
                </div>

                <h2 className="mb-4 mt-7 text-lg font-semibold">Summary</h2>
                <div className="flex rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="w-3/4">
                    <div className="my-8 ms-8">Total sales</div>
                    <div className="my-8 ms-8">
                      đ {customer?.customer?.total_sales}
                    </div>
                  </div>
                  <div className="flex w-1/4 items-center justify-center">
                    <div>
                      <BsExclamationCircle className="size-10" />
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mx-auto my-4 mr-2 flex w-2/4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="w-3/4">
                      <div className="my-8 ms-8">Appointments</div>
                      <div className="my-8 ms-8">
                        {customer?.customer?.appointments_count}
                      </div>
                    </div>
                    <div className="flex w-1/4 items-center justify-center">
                      <div>
                        <BsExclamationCircle className="size-10" />
                      </div>
                    </div>
                  </div>
                  <div className="mx-auto my-4 ml-2 flex w-2/4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="w-3/4">
                      <div className="my-8 ms-8">Cancelled</div>
                      <div className="my-8 ms-8">
                        {customer?.customer?.cancelled_bookings_count}
                      </div>
                    </div>
                    <div className="flex w-1/4 items-center justify-center">
                      <div>
                        <BsExclamationCircle className="size-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="flex">
              <div className="w-full">
                {customer?.bookings?.map((bookingMonth: any, index: number) => (
                  <div className="mb-6" key={index}>
                    <h2 className="mb-4 text-lg font-semibold">
                      {bookingMonth?.Month}
                    </h2>
                    {Array.isArray(bookingMonth?.Bookings) &&
                      bookingMonth?.Bookings.length > 0 &&
                      bookingMonth?.Bookings.map(
                        (booking: any, bookingIndex: number) => (
                          <div key={bookingIndex}>
                            <div className="mb-4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                              <div className="my-4 w-full">
                                <div className="my-4 ms-8 w-full">
                                  <div className="font-bold">Appointment</div>
                                  <div>
                                    {formatDateHours(booking?.start_time)}
                                  </div>
                                </div>
                              </div>
                              {Array.isArray(booking?.details) &&
                                booking?.details.map(
                                  (detail: any, detailIndex: number) => (
                                    <div
                                      className="my-4 ms-8 flex"
                                      key={detailIndex}
                                    >
                                      <div className="w-3/4">
                                        <div>
                                          {detailIndex + 1}.{" "}
                                          {detail?.service?.name}
                                        </div>
                                        <div>
                                          {detail?.service?.options?.map(
                                            (
                                              option: any,
                                              optionIndex: number,
                                            ) => (
                                              <span key={optionIndex}>
                                                {optionIndex > 0 && ", "}
                                                {option?.time} min -{" "}
                                                {detail?.assistant?.name}
                                              </span>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex w-1/4 items-center justify-center">
                                        <div className="font-bold">
                                          $
                                          {detail?.service?.options?.[0]
                                            ?.price ||
                                            detail?.service?.total_fee ||
                                            "N/A"}
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              <div className="mt-7 flex w-full justify-center">
                                {booking?.status === 0 ||
                                booking?.status === 1 ||
                                booking?.status === 3 ? (
                                  <button
                                    type="submit"
                                    className="mb-7 rounded-full border bg-white p-2 text-black hover:bg-opacity-90"
                                  >
                                    Checkout
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="mb-7 rounded-full border bg-white p-2 text-black hover:bg-opacity-90"
                                  >
                                    Rebook
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <h2 className="text-lg font-semibold">Comming Soon ...</h2>
              <div>{/* Nội dung cho tab 3 */}</div>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <h2 className="text-lg font-semibold">Comming Soon ...</h2>
              <div>{/* Nội dung cho tab 3 */}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
