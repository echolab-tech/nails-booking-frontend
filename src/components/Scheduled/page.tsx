"use client";

import { useModal } from "@/hooks/useModal";
import { getListAssistant } from "@/services/assistants.service";
import { scheduleEdit, scheduleList } from "@/services/schedules.service";
import { Schedule } from "@/types/Schedule";
import { Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";


interface SearchValues {
  name: string;
  email: string;
  phone: number | null;
  address: string;
}

export default function Schduled() {
  const { visibleId, toggle } = useModal();
  const [startTime, setStarTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [id, setId] = useState(0);
  const [visibleModalId, setVisibleModalId] = useState<string>("");
  const [scheduleLists, setScheduleList] = useState<any[]>([]);
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  

  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
    email: "",
    phone: null,
    address: "",
  });

  const fetchDataSheduleList = useCallback(async (page:number) => {
    const schedules = await getListAssistant(searchValues, page);

    
    setScheduleList(schedules.data.assistants);
  },[searchValues]);

  useEffect(() => {
    fetchDataSheduleList(1);
  }, [fetchDataSheduleList]);

  useEffect(() => {
    if (isEditSuccess) {
      fetchDataSheduleList(1);
      setIsEditSuccess(false);
    }
  }, [fetchDataSheduleList, isEditSuccess]);

 

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


  const checkScheduleOfDays = (day: string, name:string) => {
    const scheduleOfDay: any = [];
    scheduleLists.map((item) => {
      scheduleOfDay.push(
        ...item.schedule.filter((shift: any) => shift.weekdays === day && item.name === name),
      );
    });
    return scheduleOfDay;
  };
  

  const ScheduleNewSchema = Yup.object().shape({
    start_time: Yup.string()

      .required("Required"),
    end_time: Yup.string()

      .required("Required"),
  });

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
            {scheduleLists.map((item, index) => (
              <tr
                key={index}
                className=" even:bg-gray-50 even:dark:bg-gray-800"
              >
                <td scope="row" className="px-6 py-4">
                  <div className="flex w-max items-center gap-2">
                    <Image
                      src={
                        item.avatar ?? "/images/scheduled/avatar.png"
                      }
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
                        {item.totalHours}
                      </p>
                    </div>
                    <Link
                      href={`edit/${item.name.replace(" ", "-")}?userID=${item.id}`}
                    >
                      <Image
                        src="/images/scheduled/edit.svg"
                        width={50}
                        height={50}
                        alt="edit"
                      />
                    </Link>
                  </div>
                </td>
                {item.schedule && item.schedule.map((scheduled: any, idx: number) => (
                  <td scope="row" className="relative px-6 py-4" key={idx}>
                    {checkScheduleOfDays(scheduled.weekdays, item.name).map(
                      (time: any, id: number) => (
                        <div
                          key={time.id}
                          className=" mt-2 w-max cursor-pointer items-center rounded-2xl bg-gray-4 pb-1.5 pl-1.5 pr-1.5 pt-1.5 lg:pl-5 lg:pr-5"
                          onClick={() => {
                            toggle(`${index}-${idx}`);
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
                    {visibleId === `${index}-${idx}` && (
                      <div className="absolute  -bottom-20 right-0 z-9 w-40 rounded-md border-[1px] border-black bg-white p-2">
                        <p
                          className="w-max cursor-pointer text-sm text-black dark:text-white"
                          onClick={() => toggle("Editthisday")}
                        >
                          Edit this day
                        </p>
                        <p className="w-max text-sm text-black dark:text-white ">
                          Edit regular shifts
                        </p>

                        <p className="w-max text-sm text-black dark:text-white ">
                          Add time off
                        </p>

                        <p className="w-max text-sm text-red">
                          Delete thius shifts
                        </p>
                      </div>
                    )}
                    {visibleId === "Editthisday" && (
                      <>
                        <div className="fixed inset-0 z-50 flex  items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                          <div className="relative mx-auto my-6 w-auto max-w-3xl">
                            {/*content*/}
                            <div className="relative flex  w-[500px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                              {/*header*/}
                              <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-2">
                                <button
                                  className="float-right ml-auto flex border-0"
                                  onClick={() => toggle("")}
                                >
                                  <span className="flex h-6 w-6 items-center bg-transparent text-3xl text-black  outline-none focus:outline-none">
                                    ×
                                  </span>
                                </button>
                              </div>
                              {/*body*/}
                              <Formik
                                enableReinitialize={true}
                                initialValues={{
                                  start_time: startTime,
                                  end_time: endTime,
                                }}
                                validationSchema={ScheduleNewSchema}
                                onSubmit={(
                                  values: Schedule,
                                  { resetForm },
                                ) => {
                                  values.start_time = startTime;
                                  values.end_time = endTime;
                                  scheduleEdit(id, values)
                                    .then((data) => {
                                      toggle("")
                                      setIsEditSuccess(true)
                                      toast.success(
                                        "Schedule update successfully.",
                                      );
                                      resetForm();
                                    })
                                    .catch((error) => {
                                      toast.error("Failed to update schdule.");
                                    });
                                }}
                              >
                                {({
                                  errors,
                                  touched,
                                  validateField,
                                  validateForm,
                                  setFieldValue,
                                }) => (
                                  <Form>
                                    <div className="w-full  p-5">
                                      <div className="flex items-center gap-5">
                                        <div className="w-[50%]">
                                          <p className="w-max cursor-pointer text-sm font-semibold text-black dark:text-white">
                                            Start time
                                          </p>
                                          <select
                                            className="w-[100%] rounded-xl border"
                                            name="whatever"
                                            id="frm-whatever"
                                            onChange={(text) =>
                                              setStarTime(text.target.value)
                                            }
                                          >
                                            <option value="">
                                              {startTime}
                                            </option>
                                            <option value="0:00">0:00</option>
                                            <option value="1:00">1:00</option>
                                            <option value="2:00">2:00</option>
                                            <option value="3:00">3:00</option>
                                            <option value="4:00">4:00</option>
                                            <option value="5:00">5:00</option>
                                            <option value="6:00">6:00</option>
                                            <option value="7:00">7:00</option>
                                            <option value="8:00">8:00</option>
                                            <option value="9:00">9:00</option>
                                            <option value="10:00">10:00</option>
                                            <option value="11:00">11:00</option>
                                            <option value="12:00">12:00</option>
                                            <option value="13:00">13:00</option>
                                            <option value="14:00">14:00</option>
                                            <option value="15:00">15:00</option>
                                            <option value="16:00">16:00</option>
                                            <option value="17:00">17:00</option>
                                            <option value="18:00">18:00</option>
                                            <option value="19:00">19:00</option>
                                            <option value="20:00">20:00</option>
                                            <option value="21:00">21:00</option>
                                            <option value="22:00">22:00</option>
                                            <option value="23:00">23:00</option>
                                          </select>
                                        </div>
                                        <p className="mt-5 w-max cursor-pointer text-xl font-semibold text-black dark:text-white">
                                          -
                                        </p>
                                        <div className="w-[50%]">
                                          <p className="w-max cursor-pointer text-sm font-semibold text-black dark:text-white">
                                            End time
                                          </p>
                                          <select
                                            className="w-[100%] rounded-xl border"
                                            name="whatever"
                                            id="frm-whatever"
                                            onChange={(text) =>
                                              setEndTime(text.target.value)
                                            }
                                          >
                                            <option value="">{endTime}</option>
                                            <option value="0:00">0:00</option>
                                            <option value="1:00">1:00</option>
                                            <option value="2:00">2:00</option>
                                            <option value="3:00">3:00</option>
                                            <option value="4:00">4:00</option>
                                            <option value="5:00">5:00</option>
                                            <option value="6:00">6:00</option>
                                            <option value="7:00">7:00</option>
                                            <option value="8:00">8:00</option>
                                            <option value="9:00">9:00</option>
                                            <option value="10:00">10:00</option>
                                            <option value="11:00">11:00</option>
                                            <option value="12:00">12:00</option>
                                            <option value="13:00">13:00</option>
                                            <option value="14:00">14:00</option>
                                            <option value="15:00">15:00</option>
                                            <option value="16:00">16:00</option>
                                            <option value="17:00">17:00</option>
                                            <option value="18:00">18:00</option>
                                            <option value="19:00">19:00</option>
                                            <option value="20:00">20:00</option>
                                            <option value="21:00">21:00</option>
                                            <option value="22:00">22:00</option>
                                            <option value="23:00">23:00</option>
                                          </select>
                                        </div>

                                        <Image
                                          className="mt-5 cursor-pointer"
                                          //   onClick={() => deleteHandler(input.id, data.days)}
                                          src="/images/scheduled/trash.svg"
                                          alt="delete"
                                          width={30}
                                          height={30}
                                        />
                                      </div>
                                    </div>
                                    <div className=" flex items-center justify-end rounded-b  p-6">
                                      <button
                                        className="text-red-500 background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase outline-none transition-all duration-150 ease-linear focus:outline-none"
                                        type="submit"
                                        onClick={() => toggle("")}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                                        type="submit"

                                        // onClick={() => toggle("")}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                              {/*footer*/}
                            </div>
                          </div>
                        </div>
                        <div className="fixed inset-0 z-40 bg-black opacity-10"></div>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
