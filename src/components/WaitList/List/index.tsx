"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { deleteWaitList, getListWaitList } from "@/services/waitlist.service";
import Search from "@/components/common/Search";
import { toast } from "react-toastify";

interface WaitGroup {
  key: string;
  customer: any;
  items: any[];
}

// Gom các dòng waiting list của cùng khách + cùng thời gian mong muốn thành 1 dòng
const groupByCustomer = (rows: any[] = []): WaitGroup[] => {
  const map = new Map<string, WaitGroup>();
  rows.forEach((row) => {
    const desired = String(row?.wait_list_detail?.desired_time ?? "").substring(0, 16);
    const key = `${row?.id_customer ?? row?.customer?.id}|${desired}`;
    if (!map.has(key)) map.set(key, { key, customer: row.customer, items: [] });
    map.get(key)!.items.push(row);
  });
  return Array.from(map.values()).map((g) => ({
    ...g,
    // service chính trước, add-on sau
    items: g.items.sort(
      (a, b) => Number(!!a?.wait_list_detail?.id_sub_service) - Number(!!b?.wait_list_detail?.id_sub_service),
    ),
  }));
};

// "YYYY-MM-DD HH:mm:ss" (giờ của tiệm) → "MM/DD/YYYY h:mm AM" mà không đổi múi giờ
const formatWallTime = (value?: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(value ?? "");
  if (!m) return value ?? "";
  const hour = Number(m[4]);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${m[2]}/${m[3]}/${m[1]} ${h12}:${m[5]} ${hour < 12 ? "AM" : "PM"}`;
};


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

  // Miro Frame 1 #84: X để manager xóa khách (và tất cả service của khách) khỏi list
  const handleRemove = async (group: WaitGroup) => {
    if (!window.confirm(`Remove ${group.customer?.name ?? "this customer"} from the waiting list?`)) return;
    try {
      for (const item of group.items) {
        await deleteWaitList(item.id);
      }
      toast.success("Removed from the waiting list");
      fetchWaitList();
    } catch (error) {
      toast.error("Failed to remove from the waiting list");
    }
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
                {groupByCustomer(waitListData).map((group) => {
                  const customer = group.customer;
                  const status = group.items[0]?.wait_list_detail?.status;
                  return (
                    <tr key={group.key}>
                      {/* WaitList ID + nút X (Miro Frame 1 #84) */}
                      <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            title="Remove this customer from the waiting list"
                            aria-label="Remove from waiting list"
                            onClick={() => handleRemove(group)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white hover:bg-red-600"
                          >
                            ×
                          </button>
                          <h5 className="font-medium text-black dark:text-white">
                            {group.items.map((i: any) => i.id).join(", ")}
                          </h5>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {customer?.name}
                        </p>
                        <p className="text-sm text-gray-500">{customer?.phone}</p>
                      </td>

                      {/* Tất cả service + add-on khách đã chọn (Miro Frame 1 #84) */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <ul className="space-y-1">
                          {group.items.map((item: any) => {
                            const detail = item.wait_list_detail;
                            const isSub = !!detail?.id_sub_service;
                            return (
                              <li key={item.id}>
                                <span className={`${isSub ? "pl-4 text-sm" : "font-medium"} text-black dark:text-white`}>
                                  {isSub ? `+ ${detail?.sub_service?.name ?? ""}` : detail?.service?.name}
                                </span>
                                {isSub && detail?.sub_service?.time && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    {detail.sub_service.time} min
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </td>

                      {/* Desired Time — đúng giờ đã chọn, không đổi múi giờ */}
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        {formatWallTime(group.items[0]?.wait_list_detail?.desired_time)}
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                            status === "waiting"
                              ? "bg-yellow-100 text-yellow-700"
                              : status === "done"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status}
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
