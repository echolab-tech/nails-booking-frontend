"use client";

import React, { useState, useEffect } from "react";
import {
  deleteService,
  getListPackages,
  getListService,
} from "@/services/service.service";
import { formatPrice } from "@/components/common/format_currency";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { BsTrash } from "react-icons/bs";
import { FaRegPenToSquare } from "react-icons/fa6";
import Search from "../Search";
import { ServicePackageType, serviceType } from "@/types/service";
import PaginationCustom from "@/components/Pagination/Pagination";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

const PackageList = () => {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });
  const [packages, setPackages] = useState<ServicePackageType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [idDel, setIdDel] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServicePackage();
  }, []);

  const fetchServicePackage = async () => {
    getListPackages(paginationData.current_page).then((data) => {
      setPackages(data.data.data);
      setPaginationData({
        ...paginationData,
        current_page: data.data.metadata.current_page,
      });
    });
  };

  const handlePageChange = (page: number) => {
    getListService(paginationData.current_page, "").then((data) => {
      setPackages(data.data.data);
    });
  };

  const handleSearch = (term: string) => {
    getListService(paginationData.current_page, term).then((data) => {
      setPackages(data.data.data);
    });
  };

  const onClose = () => {
    setIdDel(null);
    setOpenModal(false);
  };

  const handleEdit = (id: string) => {
    router.push(`edit/${id}`);
  };

  const options = [
    { value: "everyone", label: "Everyone" },
    { value: "females", label: "Females only" },
    { value: "males", label: "Male only" },
  ];

  const onDelete = async () => {
    try {
      await deleteService(idDel);
      fetchServicePackage();
      setOpenModal(false);
      toast.success("Delete Success !!!");
    } catch (error) {
      toast.warning("you cannot delete !!!");
    }
  };

  const handleDelete = (serviceId: string) => {
    setIdDel(serviceId);
    setOpenModal(true);
  };

  return (
    <>
      <Search
        placeholder="search"
        handleSearch={(value) => handleSearch(value)}
      />
      <div className="mt-5 rounded-sm border border-stroke bg-white  px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Package name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Service
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Price
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Package available for
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {packages?.map((item, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {item?.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {item?.services?.map((service, j) => (
                      <div key={j} className="flex">
                        <span>{service?.name}</span>
                      </div>
                    ))}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {formatPrice(item?.price)}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p>
                      {
                        options?.find(
                          (option) => option.value === item?.available_for,
                        )?.label
                      }
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleDelete(item?.id)}
                      >
                        <BsTrash size={25} className="text-red" />
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => handleEdit(item?.id)}
                      >
                        <FaRegPenToSquare size={25} className="text-primary" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center">
          <PaginationCustom
            currentPage={paginationData?.current_page}
            totalPages={paginationData?.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
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

export default PackageList;
