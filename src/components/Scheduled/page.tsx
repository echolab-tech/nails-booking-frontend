"use client";

import { useModal } from "@/hooks/useModal";
import { getListAssistant } from "@/services/assistants.service";
import {
  deleteSchedule,
  editSchedule,
  getListSchedule,
} from "@/services/schedules.service";
import { Schedule, ScheduledOfUser } from "@/types/Schedule";
import { table, time } from "console";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import PaginationCustom from "../Pagination/Pagination";
import ModalEdit from "./ModalEdit/page";

interface SearchValues {
  name: string;
  email: string;
  phone: number | null;
  address: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

export default function Scheduled() {
  const { visibleId, toggle } = useModal();
  const [startTime, setStarTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [id, setId] = useState(0);
  const [visibleModalId, setVisibleModalId] = useState<string>("");
  const [assistantLists, setAssistantList] = useState<any[]>([]);
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });
  const [assistantData, setAssistantData] = useState<ScheduledOfUser[]>([]);
  const onPageChange = (page: number) => {
    fetchDataAssistantList(page);
  };

  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
    email: "",
    phone: null,
    address: "",
  });

  useEffect(() => {
    fetchDataAssistantList(1);
  }, []);

  useEffect(() => {
    if (isEditSuccess) {
      fetchDataAssistantList(1);
      setIsEditSuccess(false);
    }
  }, [isEditSuccess]);
  const handleButtonDelete = async (scheduleID: number) => {
    try {
      await deleteSchedule(scheduleID);
      fetchDataAssistantList(paginationData.current_page); // Load updated schedule list
    } catch (error) {
      toast.warning("Delete Fail !!!");
    }
  };

  const fetchDataAssistantList = async (page: number) => {
    const assistants = await getListAssistant(searchValues, page);
    setAssistantData(assistants.data.assistants);
    setPaginationData(assistants.data.paginationData);

    setAssistantList(assistants.data.assistants);
  };

  useEffect(() => {
    fetchDataAssistantList(1);
  }, []);

  const HEADERSTABLE = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const totalHours = (schedules: any[]) => {
    const listTime = schedules.map(
      (item) =>
        Number(item.end_time.split(":")[0]) -
        Number(item.start_time.split(":")[0]),
    );
    const total = listTime.reduce((partialSum, a) => partialSum + a, 0);
    return total;
  };

  const checkScheduleOfDays = (day: string, id: string) => {
    const scheduleOfDay: any = [];
    assistantLists.map((item) => {
      scheduleOfDay.push(
        ...item.schedule.filter(
          (shift: any) => shift.weekdays === day && item.id === id,
        ),
      );
    });
    return scheduleOfDay;
  };

  const handleSaveEdit = (values: any) => {
    // values.start_time = startTime;
    // values.end_time = endTime;
    editSchedule(id, values)
      .then((data) => {
        toggle("");
        setIsEditSuccess(true);
      })
      .catch((error) => {
        toast.error("Failed to update schdule.");
      });
  };

  return (
    <div className="h-[700px] w-full rounded-2xl border-2  border-stroke pb-2.5  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="relative h-full overflow-x-auto sm:rounded-lg">
        <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
          <thead>
            <tr>
              {HEADERSTABLE.map((header) => (
                <th scope="row" key={header} className="pl-10 pr-10">
                  <h5 className="text-lg font-semibold text-black">{header}</h5>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assistantLists.map((item, index) => (
              <tr
                key={index}
                className=" even:bg-gray-50 even:dark:bg-gray-800"
              >
                <td scope="row" className="px-6 py-4">
                  <div className="flex w-max items-center gap-2">
                    <Image
                      src={item.avatar ?? "/images/scheduled/avatar.png"}
                      alt={item.userName}
                      width={40}
                      height={40}
                      className="w-[40px]' h-[40px]"
                    />

                    <div className="">
                      <p className="flex text-lg font-medium text-black dark:text-white ">
                        {item.name}
                      </p>
                      <p className="w-max text-sm text-black dark:text-white ">
                        {`${totalHours(item.schedule)}h`}
                      </p>
                    </div>
                    <Link
                      href={`edit/${item.name.replace(" ", "-")}?userID=${item.id}`}
                    >
                      <Image
                        src="/images/scheduled/edit.svg"
                        width={30}
                        height={30}
                        alt="edit"
                      />
                    </Link>
                  </div>
                </td>
                {HEADERSTABLE.slice(1).map((headerDay, idx) => (
                  <td
                    scope="row"
                    className="relative px-6 py-4"
                    key={headerDay}
                  >
                    <td key={headerDay}>
                      {checkScheduleOfDays(headerDay, item.id).map(
                        (time: any, id: number) => (
                          <div
                            key={time.id}
                            className=" mt-2 w-max cursor-pointer items-center rounded-2xl bg-gray-4 pb-1.5 pl-1.5 pr-1.5 pt-1.5 lg:pl-5 lg:pr-5"
                            onClick={() => {
                              toggle(`${index}-${idx}-${time.id}`);
                              setVisibleModalId(`${index}-${idx}`);
                              setStarTime(time.start_time);
                              setEndTime(time.end_time);
                              setId(time.id);
                            }}
                          >
                            <p className="w-max text-sm text-black dark:text-white">
                              {`${time.start_time} - ${time.end_time}`}
                            </p>
                          </div>
                        ),
                      )}
                      {visibleId === `${index}-${idx}-${id}` && (
                        <div className="absolute  -bottom-20 right-0 z-9 w-40 rounded-md border-[1px] border-black bg-white p-2">
                          <p
                            className="w-max cursor-pointer text-sm text-black dark:text-white"
                            onClick={() => toggle("Editthisday")}
                          >
                            Edit this day
                          </p>
                          <Link
                            href={`edit/${item.name.replace(" ", "-")}?userID=${item.id}`}
                          >
                            <p className="w-max cursor-pointer text-sm text-black dark:text-white">
                              Edit regular shifts
                            </p>
                          </Link>

                          <p className="w-max text-sm text-black dark:text-white ">
                            Add time off
                          </p>

                          {/* <p className="w-max text-sm text-red"> */}
                          <p
                            className="w-max cursor-pointer text-sm text-black dark:text-white"
                            onClick={() => handleButtonDelete(id)}
                          >
                            {" "}
                            Delete this shifts
                          </p>
                        </div>
                      )}
                      {visibleId === "Editthisday" && (
                        <ModalEdit
                          setStartTime={setStarTime}
                          setEndTime={setEndTime}
                          startTime={startTime}
                          endTime={endTime}
                          toggle={toggle}
                          handleSaveEdit={handleSaveEdit}
                        />
                      )}
                    </td>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
      <PaginationCustom
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
