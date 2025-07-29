"use client";

import { useState } from "react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { deleteCustomer, getListCustomers } from "@/services/customer.service";
import { toast } from "react-toastify";
// import { Customer } from "@/types/customer";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";
import PaginationCustom from "../Pagination/Pagination";
import Search from "@/app/customers/search/page";
import Skeleton from "../common/Skeleton";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  status: Status;
  reviews: number;
  total_sales: number;
}

export interface Status {
  id: number;
  color_code: string;
  name_status: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

interface SearchValues {
  birthday: string;
  searchText: string;
}

const CustomerTable = () => {
  const router = useRouter();
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [idDel, setIdDel] = useState<number>(0);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });
  const [searchValues, setSearchValues] = useState<SearchValues>({
    birthday: "",
    searchText: "",
  });

  useEffect(() => {
    fetchCustomerData(1);
  }, [searchValues]);
  console.log(customerData);

  const fetchCustomerData = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getListCustomers(searchValues, page);
      setCustomerData(response.data.data.data);
      setPaginationData({
        ...paginationData,
        current_page: response.data.data.metadata.current_page,
        total_pages: response.data.data.metadata.total_pages,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async (birthday: string, searchText: string) => {
    const values = { birthday, searchText };
    setSearchValues(values);
    fetchCustomerData(1);
  };

  const handleButtonDetail = (customerId: number) => {
    router.push(`/customers/detail/${customerId}`);
  };

  const handleButtonEdit = (customerId: number) => {
    router.push(`/customers/edit/${customerId}`);
  };

 const onClose = () => {
    setIdDel(0);
    setOpenModal(false);
  };

  const handleButtonDelete = async (customerId: number) => {
    setOpenModal(true);
    setIdDel(customerId);
  };

  const onDelete = async () => {
    try {
      await deleteCustomer(idDel);
      setOpenModal(false);
      fetchCustomerData(1);
      toast.success("Delete Success !!!");
    } catch (error) {
      toast.error("Delete Failed. Please try again.");
      console.error("Error deleting customer:", error);
    }
  };

  const onPageChange = (page: number) => {
    fetchCustomerData(page);
  };

  const handleInputChangeText = async (value: string) => {
    // console.log("Updated search text from child:", searchText);
    // Xử lý dữ liệu searchText tại đây
    const page = 1;
    const result = await getListCustomers({ ...searchValues, searchText: value }, page);
    setCustomerData(result.data.data.data);
      setPaginationData({
        ...paginationData,
        current_page: result.data.data.metadata.current_page,
        total_pages: result.data.data.metadata.total_pages,
      });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Search handleSearch={handleSearch} handleInputChange={handleInputChangeText}/>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Phone
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Status
                </th>

                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Reviews
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Total Sales
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {customerData?.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {item.name}
                    </h5>
                    <p className="text-sm">{item.email}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{item.phone}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium"
                      style={{ backgroundColor: item.status.color_code }}
                    ></div>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p
                      className={`rounded-f ull inline-flex bg-opacity-10 px-3 py-1 text-sm font-medium ${item.reviews}`}
                    >
                      *****
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium`}
                    >
                      đ {item.total_sales}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleButtonDetail(item.id)}
                      >
                        <svg
                          color="green"
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => handleButtonEdit(item.id)}
                      >
                        <FaEdit color="blue" />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => handleButtonDelete(item?.id)}
                      >
                        <svg
                          color="red"
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.375 3.375H12.4688V2.8125C12.4688 1.80938 11.6597 1 10.6562 1H7.34375C6.34062 1 5.53125 1.80938 5.53125 2.8125V3.375H2.625C2.27812 3.375 2 3.65312 2 4C2 4.34688 2.27812 4.625 2.625 4.625H3.06875L3.625 15.2781C3.66562 16.1813 4.42188 16.875 5.325 16.875H12.675C13.5812 16.875 14.3344 16.1844 14.375 15.2781L14.9313 4.625H15.375C15.7219 4.625 16 4.34688 16 4C16 3.65312 15.7219 3.375 15.375 3.375ZM6.15625 2.8125C6.15625 2.525 6.35625 2.3125 6.625 2.3125H11.375C11.6625 2.3125 11.875 2.525 11.875 2.8125V3.375H6.15625V2.8125ZM13.125 15.2125C13.1094 15.5625 12.825 15.8438 12.475 15.8438H5.325C4.975 15.8438 4.69062 15.5625 4.675 15.2125L4.12188 4.625H13.8781L13.125 15.2125Z"
                            fill=""
                          />
                          <path
                            d="M7.25 14.125C7.59688 14.125 7.875 13.8469 7.875 13.5V7.53125C7.875 7.18437 7.59688 6.90625 7.25 6.90625C6.90312 6.90625 6.625 7.18437 6.625 7.53125V13.5C6.625 13.8469 6.90312 14.125 7.25 14.125Z"
                            fill=""
                          />
                          <path
                            d="M10.75 14.125C11.0969 14.125 11.375 13.8469 11.375 13.5V7.53125C11.375 7.18437 11.0969 6.90625 10.75 6.90625C10.4031 6.90625 10.125 7.18437 10.125 7.53125V13.5C10.125 13.8469 10.4031 14.125 10.75 14.125Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        <DialogConfirm
              openModal={openModal}
              message="If you delete this, all bookings related to this customer will also be removed. Are you sure you want to proceed ?"
              onClose={onClose}
            >
              <button
                onClick={() => onDelete()}
                className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {"Yes, I'm sure"}
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="justify-center rounded bg-zinc-800 p-3 font-medium text-gray hover:bg-opacity-90"
              >
                No, cancel
              </button>
            </DialogConfirm>
      <PaginationCustom
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CustomerTable;
