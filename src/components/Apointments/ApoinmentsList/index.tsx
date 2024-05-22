'use client'
import PaginationCustom from "@/components/Pagination/Pagination";
import { useState } from "react";

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}
const ApointmentList = () => {
    const [paginationData, setPaginationData] = useState<PaginationData>({
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      per_page: 10,
    });
    const onPageChange = (page: number) => {
      
    };
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white ">
                  ID
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Client
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Services
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Created By
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Scheduled date
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white ">
                  Duration
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Assistants
                </th>
                <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white ">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {categoryData.map((category, index) => ( */}
              <tr>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <a href="#">
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      1
                    </h5>
                  </a>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <a href="#">
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      Nguyễn Văn A
                    </h5>
                  </a>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    Service 1 ,Service 2
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    Admin
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    30/05/2024 16:00
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    1h30m
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    Nguyễn Văn B
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    50$
                  </h5>
                </td>
              </tr>
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
}
export default ApointmentList;
