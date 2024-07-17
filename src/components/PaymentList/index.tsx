"use client";
import PaginationCustom from "@/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getListPayment } from "@/services/payment.service";
import { getStatusPayment } from "../utils/getStatusPayment";

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

interface SearchValues {
  name_customer: string;
  start_time: string;
  end_time: string;
}

const PaymentList = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name_customer: "",
    start_time: "",
    end_time: "",
  });
  useEffect(() => {
    fetchPayments(paginationData.current_page);
  }, []);
  const fetchPayments = async (page: number) => {
    try {
      const response = await getListPayment(page);
      setPayments(response?.data?.data);
      setPaginationData(response?.data?.metadata);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onPageChange = (page: number) => {
    fetchPayments(page);
  };
  const handleChangeSearchValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };
  const handleSearch = async () => {
    fetchPayments(paginationData?.current_page);
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/3">
            {/* <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Name <span className="text-meta-1">*</span>
              </label> */}
            <input
              type="text"
              name="name_customer"
              value={searchValues.name_customer}
              onChange={handleChangeSearchValues}
              placeholder="Search by client"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="w-full xl:w-1/3">
            <div className="mb-4.5 flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="w-full flex-1 xl:w-auto">
                <input
                  type="date"
                  name="start_time"
                  value={searchValues.start_time}
                  onChange={handleChangeSearchValues}
                  placeholder="Enter your email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="flex w-full items-center justify-center xl:w-auto">
                <span className="mx-2 text-black dark:text-white">TO</span>
              </div>
              <div className="w-full flex-1 xl:w-auto">
                <input
                  type="date"
                  name="end_time"
                  value={searchValues.end_time}
                  onChange={handleChangeSearchValues}
                  placeholder="Enter your email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
          <div className="w-full xl:w-1/3">
            <div className="flex w-full justify-center">
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        {/* <div className="mb-4.5 flex flex-col">
            <div className="flex w-full justify-center">
              <button
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                // onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div> */}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Payment Date
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Payment ID
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Customer
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Team Member
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Type
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white ">
                Method
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {payment?.payment_date}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <a href={`/payments/detail/${payment.id}`}>
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      {payment?.id}
                    </h5>
                  </a>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <a
                    href={`/customers/detail/${payment?.booking?.customer?.id}`}
                  >
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      {payment?.booking?.customer?.name}
                    </h5>
                  </a>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    Admin
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {getStatusPayment(payment?.status)}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {payment.payment_method}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {/* <a href="#"> */}
                  <h5 className="font-medium text-black dark:text-white">
                    {payment?.amount}
                  </h5>
                  {/* </a> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationCustom
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
export default PaymentList;
