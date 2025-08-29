"use client";
import PaginationCustom from "@/components/Pagination/Pagination";
import { getListAppointment, exportAppointment, deleteMultiAppointment} from "@/services/appointment.service";
import { serviceOption } from "@/services/serviceoption.service";
import { AppointmentEditForm } from "@/types/AppointmentEditForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/common/Skeleton";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";

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

const ApointmentList = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
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
  const [inputValues, setInputValues] = useState<SearchValues>({
    name_customer: "",
    start_time: "",
    end_time: "",
  });
  useEffect(() => {
    fetchAppointments(1);
  }, []);
  const fetchAppointments = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getListAppointment(searchValues, page);
      setInputValues(searchValues);
      const ids = response.data.appointMents.map((appt: any) => appt.id);
      setSelectedIds(ids);
      setAppointments(response.data.appointMents);
      setPaginationData(response.data.paginationData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onPageChange = (page: number) => {
    fetchAppointments(page);
  };
  const handleChangeSearchValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };
  const handleSearch = async () => {
    fetchAppointments(1);
  };
  const handleOpenModelDelete = () => {
    setOpenModalConfirm(true);
  }
  const closeModalConfirm = async() => {
    setOpenModalConfirm(false);
  };
  const handlePrint = async() => {
    try {
      setIsLoading(true);
      await exportAppointment(inputValues);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const handlePrintAnhDelete = async() => {
    setOpenModalConfirm(false);
    try {
      setIsLoading(true);
      await exportAppointment(inputValues, true);
      fetchAppointments(1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error :", error);
    }
  };
  const handleDelete = async() => {
    try {
      setOpenModalConfirm(false);
      await deleteMultiAppointment(inputValues);
      fetchAppointments(1);
    } catch (error) {
      console.error("Error delete multi appointment:", error);
    }
    console.log("Arr dête", selectedIds);
  };
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="p-6.5">
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/4">
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
          <div className="w-full xl:w-2/4">
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
          <div className="w-full xl:w-1/4">
            <div className="flex w-full justify-center gap-2" style={{ marginTop: "5px" }}>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                onClick={() => handlePrint()}
              >
                Print
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                style={{ backgroundColor: "red" }}
                onClick={() => handleOpenModelDelete()}
              >
                Delete
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
      {isLoading ? (
        <Skeleton />
      ) : (
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
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <a href="#">
                      <h5 className="font-medium text-blue-500 dark:text-white">
                        {index + 1}
                      </h5>
                    </a>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <a href={`/customers/detail/${appointment.customer.id}`}>
                      <h5 className="font-medium text-blue-500 dark:text-white">
                        {appointment.customer.name}
                      </h5>
                    </a>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.bookingDetails
                        .map(
                          (serviceOption: any) =>
                            serviceOption?.service_option?.title,
                        )
                        .join(", ")}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.booking_type === 1 ? "Admin" : ""}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.start_time.slice(0, 16)}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.total_time}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    {/* <a href="#"> */}
                    <h5 className="font-medium text-blue-500 dark:text-white">
                      {appointment.bookingDetails
                        .map((serviceOption: any) => serviceOption.resourceName)
                        .join(", ")}
                    </h5>
                    {/* </a> */}
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {appointment.total_fee}$
                    </h5>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PaginationCustom
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
            <DialogConfirm
        openModal={openModalConfirm}
        message="Do you want to print appointments from the screen?"
        onClose={closeModalConfirm}
      >
        <button
          onClick={() => handlePrintAnhDelete()}
          className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {"Yes, I'm sure"}
        </button>
        <button
          onClick={() => handleDelete()}
          className="justify-center	rounded bg-zinc-800	 p-3 font-medium text-gray hover:bg-opacity-90"
        >
          No, cancel
        </button>
      </DialogConfirm>
    </div>
  );
};
export default ApointmentList;
