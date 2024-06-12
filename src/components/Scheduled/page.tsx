"use client";

import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Schduled() {
  const { visibleId, toggle } = useModal();
  const [startTime, setStarTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const SCHEDULEDSHIFTS = [
    {
      avata: "/images/scheduled/avatar.png",
      userName: "Jack Doe",
      totalHours: "52h",
      scheduleds: [
        {
          days: "Mondays",
          time: "8:00 - 18:00",
        },
        {
          days: "Tuesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Wednesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Thursday",
          time: "8:00 - 18:00",
        },
        {
          days: "Fridays",
          time: "8:00 - 18:00",
        },
      ],
    },
    {
      avata: "/images/scheduled/avatar.png",
      userName: "Jack Doe",
      totalHours: "52h",
      scheduleds: [
        {
          days: "Mondays",
          time: "8:00 - 18:00",
        },
        {
          days: "Tuesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Wednesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Thursday",
          time: "8:00 - 18:00",
        },
        {
          days: "Fridays",
          time: "8:00 - 18:00",
        },
      ],
    },
    {
      avata: "/images/scheduled/avatar.png",
      userName: "Jack Doe",
      totalHours: "52h",
      scheduleds: [
        {
          days: "Mondays",
          time: "8:00 - 18:00",
        },
        {
          days: "Tuesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Wednesday",
          time: "8:00 - 18:00",
        },
        {
          days: "Thursday",
          time: "8:00 - 18:00",
        },
        {
          days: "Fridays",
          time: "8:00 - 18:00",
        },
      ],
    },
  ];

  const HEADERSTABLE = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "",
  ];
  return (
    <div className="h-[500px] w-full rounded-2xl border-2  border-stroke pb-2.5  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="relative overflow-x-auto sm:rounded-lg">
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
            {SCHEDULEDSHIFTS.map((item, index) => (
              <tr
                key={index}
                className=" even:bg-gray-50 even:dark:bg-gray-800"
              >
                <td scope="row" className="px-6 py-4">
                  <div className="flex w-max items-center gap-2">
                    <Image
                      src={item.avata}
                      alt={item.userName}
                      width={40}
                      height={40}
                      className="w-[40px]' h-[40px]"
                    />

                    <div className="">
                      <p className="flex text-lg font-medium text-black dark:text-white ">
                        {item.userName}
                      </p>
                      <p className="w-max text-sm text-black dark:text-white ">
                        {item.totalHours}
                      </p>
                    </div>
                    <Link href={`edit/${item.userName.replace(" ", "-")}`}>
                      <Image
                        src="/images/scheduled/edit.svg"
                        width={50}
                        height={50}
                        alt="edit"
                      />
                    </Link>
                  </div>
                </td>

                {item.scheduleds.map((scheduled, idx) => (
                  <td scope="row" className="relative px-6 py-4" key={idx}>
                    <div
                      className="flex w-max cursor-pointer items-center rounded-2xl bg-gray-4 pb-1.5 pl-1.5 pr-1.5 pt-1.5 lg:pl-5 lg:pr-5"
                      onClick={() => toggle(`${idx}-${index}`)}
                    >
                      <p className="whitespace-nowrap text-lg text-black dark:text-white sm:block">
                        {scheduled.time}
                      </p>
                    </div>
                    {visibleId === `${idx}-${index}` && (
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
                                        {scheduled.time.split("-")[0]}
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
                                      <option value="">
                                        {scheduled.time.split("-")[1]}
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
                              {/*footer*/}
                              <div className=" flex items-center justify-end rounded-b  p-6">
                                <button
                                  className="text-red-500 background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase outline-none transition-all duration-150 ease-linear focus:outline-none"
                                  type="button"
                                  onClick={() => toggle("")}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                                  type="button"
                                  onClick={() => toggle("")}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="fixed inset-0 z-40 bg-black opacity-10"></div>
                      </>
                    )}
                  </td>
                ))}
                <td scope="row" className="px-6 py-4">
                  <Image
                    src="/images/scheduled/plus.svg"
                    width={40}
                    height={40}
                    alt="edit"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
