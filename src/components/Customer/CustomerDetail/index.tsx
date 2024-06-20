"use client";

// Status booking : 
// 0 : book -> checkout
// 1 : confirm -> checkout
// 2 : cancel -> rebook
// 3 : delay -> checkout
// 4 : complete -> rebook

import React, { useState, useEffect } from 'react';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";
import { getCustomerShow } from "@/services/customer.service";
import { useParams } from "next/navigation";
import { formatDateHours } from '@/components/common/format_date';

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
        <div className="text-center mt-7">
          <img
            src={customer?.customer?.avatar}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full mb-4 rounded-full border border-gray-200"
            style={{ objectFit: 'cover' }}
          />
          <h2 className="text-lg font-semibold">{customer?.customer?.name}</h2>
          <p className="text-gray-600">{customer?.customer?.email}</p>
          <div className="w-full flex justify-center mt-3">
            <button
              type="submit"
              className="rounded bg-white p-3 font-medium text-black border-2 hover:bg-opacity-90"
            >
              Action
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 p-3 font-medium text-white hover:bg-opacity-90 ml-4"
            >
              Book Now
            </button>
          </div>
          <div className="flex items-center mt-4 pl-1">
            <LiaBirthdayCakeSolid className="mr-3"/>
            <p className="text-gray-600">{customer?.customer?.birthday ? formatDateHours(customer?.customer?.birthday) : ''}</p>
          </div>
          <div className="flex items-center pl-1">
            <AiOutlineUserAdd className="mr-3"/>
            <p className="text-gray-600">Created {customer?.customer?.created_at ? formatDateHours(customer?.customer?.created_at) : ''}</p>
          </div>
        </div>
      </div>
      {/* hiển thị tab */}
      <div className="w-2/3 bg-gray-200 p-4">
        <div className="flex justify-center mb-4">
          <button
            className={`rounded-3xl px-4 py-2 mr-2 ${
              activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => handleTabClick(1)}
          >
            Overview
          </button>
          <button
            className={`rounded-3xl px-4 py-2 mr-2 ${
              activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => handleTabClick(2)}
          >
            Appointments
          </button>
          <button
            className={`rounded-3xl px-4 py-2 mr-2 ${
              activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => handleTabClick(3)}
          >
            Sales
          </button>
          <button
            className={`rounded-3xl px-4 py-2 ${
              activeTab === 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'
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
                <h2 className="text-lg font-semibold mb-4">Wallet</h2>
                <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex">
                  <div className="w-3/4">
                    <div className="ms-8 my-8">Balance</div>
                    <div className="ms-8 my-8">đ 100.000.00</div>
                  </div>
                  <div className="w-1/4 flex items-center justify-center">
                    <div>
                      <BsExclamationCircle className="size-10"/>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold mb-4 mt-7">Summary</h2>
                <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex">
                  <div className="w-3/4">
                    <div className="ms-8 my-8">Total sales</div>
                    <div className="ms-8 my-8">đ {customer?.customer?.total_sales}</div>
                  </div>
                  <div className="w-1/4 flex items-center justify-center">
                    <div>
                      <BsExclamationCircle className="size-10"/>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-2 w-2/4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex mx-auto my-4">
                    <div className="w-3/4">
                      <div className="ms-8 my-8">Appointments</div>
                      <div className="ms-8 my-8">{customer?.customer?.appointments_count}</div>
                    </div>
                    <div className="w-1/4 flex items-center justify-center">
                      <div>
                        <BsExclamationCircle className="size-10"/>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2 w-2/4 rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex mx-auto my-4">
                    <div className="w-3/4">
                      <div className="ms-8 my-8">Cancelled</div>
                      <div className="ms-8 my-8">{customer?.customer?.cancelled_bookings_count}</div>
                    </div>
                    <div className="w-1/4 flex items-center justify-center">
                      <div>
                        <BsExclamationCircle className="size-10"/>
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
                    <h2 className="text-lg font-semibold mb-4">{bookingMonth?.Month}</h2>
                    {Array.isArray(bookingMonth?.Bookings) && bookingMonth?.Bookings.length > 0 && bookingMonth?.Bookings.map((booking: any, bookingIndex: number) => (
                      <div key={bookingIndex}>
                        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-4">
                          <div className="w-full my-4">
                            <div className="w-full my-4 ms-8">
                              <div className="font-bold">Appointment</div>
                              <div>{formatDateHours(booking?.start_time)}</div>
                            </div>
                          </div>
                          {Array.isArray(booking?.details) && booking?.details.map((detail: any, detailIndex: number) => (
                            <div className="flex my-4 ms-8" key={detailIndex}>
                              <div className="w-3/4">
                                <div>{detailIndex + 1}. {detail?.service?.name}</div>
                                <div>
                                  {detail?.service?.options?.map((option: any, optionIndex: number) => (
                                    <span key={optionIndex}>
                                      {optionIndex > 0 && ', '}
                                      {option?.time} min - {detail?.assistant?.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="w-1/4 flex items-center justify-center">
                                <div className="font-bold">
                                  ${detail?.service?.options?.[0]?.price || detail?.service?.total_fee || 'N/A'}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="w-full flex justify-center mt-7">
                            {(booking?.status === 0 || booking?.status === 1 || booking?.status === 3) ? (
                              <button
                                type="submit"
                                className="rounded-full bg-white p-2 text-black border hover:bg-opacity-90 mb-7"
                              >
                                Checkout
                              </button>
                            ) : (
                              <button
                                type="submit"
                                className="rounded-full bg-white p-2 text-black border hover:bg-opacity-90 mb-7"
                              >
                                Rebook
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <h2 className="text-lg font-semibold">Thông tin tab 3</h2>
              <div>
                {/* Nội dung cho tab 3 */}
              </div>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <h2 className="text-lg font-semibold">Thông tin tab 4</h2>
              <div>
                {/* Nội dung cho tab 3 */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
