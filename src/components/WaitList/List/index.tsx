"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { getListWaitList } from "@/services/waitlist.service";
import Search from "@/components/common/Search";


const ITEMS_PER_PAGE = 10;

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

const WaitList = () => {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 15,
  });
  const [waitListData, setWaitListData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchWaitList();
  }, []);

  const fetchWaitList = async () => {
    setIsLoading(true);
    getListWaitList(paginationData.current_page, null).then((data) => {
      setWaitListData(data.data.data);
      // setPaginationData({
      //   ...paginationData,
      //   current_page: data.data.meta.current_page,
      //   total_pages: data.data.meta.last_page,
      // });
      setIsLoading(false);
    });
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    getListWaitList(page, "").then((data) => {
      setWaitListData(data.data.data);
      setPaginationData({
        ...paginationData,
        current_page: data.data.meta.current_page,
        total_pages: data.data.meta.last_page,
      });
      setIsLoading(false);
    });
  };

  const handleSearch = (term: string) => {
    getListWaitList(paginationData.current_page, term).then((data) => {
      setWaitListData(data.data.data);
    });
  };

  return (
    <>
      <div className="flex flex-col justify-between xl:flex-row">
        <Search
          placeholder="search"
          handleSearch={(value) => handleSearch(value)}
        />
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="mt-5 rounded-sm border border-stroke bg-white  px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-meta-4">
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    WaitList ID
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Customer
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Service
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Desired Time
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {waitListData?.map((item: any, index: number) => {
                  const detail = item.wait_list_detail;
                  const customer = item.customer;
                  return (
                    <tr key={index}>
                      {/* WaitList ID */}
                      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {item?.id}
                        </h5>
                      </td>

                      {/* Customer */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {customer?.name}
                        </p>
                        <p className="text-sm text-gray-500">{customer?.phone}</p>
                      </td>

                      {/* Service / Sub Service */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {detail?.is_service ? (
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {detail?.service?.name}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {detail?.sub_service?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {detail?.sub_service?.time} min - ${detail?.sub_service?.price}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Desired Time */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {new Date(detail?.desired_time).toLocaleString()}
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            detail?.status === "waiting"
                              ? "bg-yellow-100 text-yellow-700"
                              : detail?.status === "done"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {detail?.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default WaitList;
