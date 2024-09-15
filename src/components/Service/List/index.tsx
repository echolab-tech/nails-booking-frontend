"use client";

import React, { useState, useEffect } from "react";
import {
  deletePackage,
  deleteService,
  getListService,
} from "@/services/service.service";
import { formatPrice } from "@/components/common/format_currency";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { BsTrash } from "react-icons/bs";
import { FaRegPenToSquare } from "react-icons/fa6";
import Search from "../Search";
import { serviceType } from "@/types/service";
import PaginationCustom from "@/components/Pagination/Pagination";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";
import { toast } from "react-toastify";
import Skeleton from "@/components/common/Skeleton";
import { deleteSubService } from "@/services/sub-service.service";

const ITEMS_PER_PAGE = 10;

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

const ServiceList = () => {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 15,
  });
  const [serviceData, setServiceData] = useState<serviceType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [idDel, setIdDel] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    setIsLoading(true);
    getListService(paginationData.current_page, null).then((data) => {
      setServiceData(data.data.data);
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
    getListService(page, "").then((data) => {
      setServiceData(data.data.data);
      setPaginationData({
        ...paginationData,
        current_page: data.data.meta.current_page,
        total_pages: data.data.meta.last_page,
      });
      setIsLoading(false);
    });
  };

  const handleSearch = (term: string) => {
    getListService(paginationData.current_page, term).then((data) => {
      setServiceData(data.data.data);
    });
  };

  const onClose = () => {
    setIdDel(null);
    setOpenModal(false);
  };

  const handleEdit = (id: number, type: string) => {
    if (type == "service") {
      router.push(`edit/${id}`);
    }

    if (type == "combo") {
      router.push(`/services/package/edit/${id}`);
    }

    if (type == "sub_service") {
      router.push(`/sub-service/edit/${id}`);
    }
  };

  const onDelete = async () => {
    try {
      let data; // Declare 'data' variable outside the conditionals

      if (serviceType === "service") {
        const response = await deleteService(idDel);
      } else if (serviceType === "sub_service") {
        const response = await deleteSubService(idDel);
      } else {
        const response = await deletePackage(idDel);
      }
      // Fetch the updated list after deletion
      fetchService();
      setOpenModal(false);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.warning("You cannot delete this item!");
    }
  };

  const handleDelete = (serviceId: number, type: string) => {
    if (type == "service") {
      setServiceType("service");
    }
    if (type == "sub_service") {
      setServiceType("sub_service");
    }
    if (type == "combo") {
      setServiceType("combo");
    }
    setIdDel(serviceId);
    setOpenModal(true);
  };

  return (
    <>
      <div className="flex flex-col justify-between xl:flex-row">
        <Search
          placeholder="search"
          handleSearch={(value) => handleSearch(value)}
        />
        <div className="inline-flex gap-2">
          <button
            className="w-100 rounded bg-black px-4 py-2 text-white hover:bg-blue-600 xl:w-[120px]"
            onClick={() => router.push("form-new")}
          >
            Add single
          </button>
          <button
            className="w-100 rounded bg-black px-4 py-2 text-white hover:bg-blue-600 xl:w-[120px]"
            onClick={() => router.push("package/add")}
          >
            Add pakage
          </button>
          <button
            className="w-100 rounded bg-black px-4 py-2 text-white hover:bg-blue-600 xl:w-[150px]"
            onClick={() => router.push("/sub-service/add")}
          >
            Add sub service
          </button>
        </div>
      </div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="mt-5 rounded-sm border border-stroke bg-white  px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Service Name
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Option
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Type
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceData?.map((serviceItem: any, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {serviceItem?.name}
                      </h5>
                    </td>

                    {/* Conditional rendering based on type */}
                    {serviceItem.type === "service" && (
                      <>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          {serviceItem?.serviceOptions?.map(
                            (optionItem: any, j) => (
                              <div key={j} className="flex">
                                <span>{optionItem?.name}</span>
                                <span>
                                  {optionItem?.time}min {"- "}
                                  {formatPrice(optionItem.price)}
                                </span>
                              </div>
                            ),
                          )}
                        </td>
                      </>
                    )}

                    {serviceItem.type === "combo" && (
                      <>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <p>{serviceItem?.count} services</p>
                        </td>
                      </>
                    )}

                    {serviceItem.type === "sub_service" && (
                      <>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <p>
                            {serviceItem?.time} min {"- "}
                            {formatPrice(serviceItem?.price)}
                          </p>
                        </td>
                      </>
                    )}

                    {/* Common columns (Category, Type, Actions) */}
                    {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p>{serviceItem?.category?.name}</p>
                    </td> */}
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p>{serviceItem.type}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() =>
                            handleDelete(serviceItem?.id, serviceItem?.type)
                          }
                        >
                          <BsTrash size={25} className="text-red" />
                        </button>
                        <button
                          className="hover:text-primary"
                          onClick={() =>
                            handleEdit(serviceItem?.id, serviceItem?.type)
                          }
                        >
                          <FaRegPenToSquare
                            size={25}
                            className="text-primary"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-4 flex justify-center">
            <PaginationCustom
              currentPage={paginationData?.current_page}
              totalPages={paginationData?.total_pages}
              onPageChange={handlePageChange}
            />
          </div> */}
        </div>
      )}
      <DialogConfirm
        openModal={openModal}
        message=" Are you sure you want to delete this service ?"
        onClose={onClose}
      >
        <button
          onClick={() => onDelete()}
          className="justify-center rounded bg-red p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {"Yes, I'm sure"}
        </button>
        <button
          onClick={onClose}
          className="justify-center	rounded bg-zinc-800	 p-3 font-medium text-gray hover:bg-opacity-90"
        >
          No, cancel
        </button>
      </DialogConfirm>
    </>
  );
};

export default ServiceList;
