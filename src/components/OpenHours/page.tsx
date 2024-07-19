"use client";
import Image from "next/image";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { createSchedule } from "@/services/schedules.service";
import { toast } from "react-toastify";
import { ListOpenHoursType } from "@/types/OpenHours";
import { createOpenHours, getListOpenHours } from "@/services/openhours.service";

export default function OpenHours() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [dataOpenHours, setDataOpenHours] = useState<any>();

  const fetchDataOpenHour = useCallback(async () => {
    const openHours = await getListOpenHours();

    setDataOpenHours(openHours.data.data);
  }, []);

  useEffect(() => {
    fetchDataOpenHour();
  }, []);

  const DATASOPENHOUR = useMemo(() => {
    const LISTDAY = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const listOpenHour: any[] = [];
    if (dataOpenHours) {
      LISTDAY.map((day) => {
        const arrTime: {
          id?: string;
          from: string;
          to: string;
          isDelete?: boolean;
          status: number;
          days_of_week: string;
        }[] = [];

        dataOpenHours[`${day}`].map((data: any) => {
          if (data.days_of_week === day) {
            arrTime.push({
              id: data.id,
              from: data.start_time,
              to: data.end_time,
              isDelete: false,
              status: data.status,
              days_of_week: data.days_of_week,
            });
          }
        });

        listOpenHour.push({
          days: day,
          isChecked: arrTime[0].status == 1,
          time: arrTime,
        });
      });

      return listOpenHour;
    }
  }, [dataOpenHours]);

  const [inputs, setInputs] = useState<ListOpenHoursType[]>([]);

  console.log(inputs);

  useEffect(() => {
    if (!inputs.length && DATASOPENHOUR) {
      setInputs(DATASOPENHOUR);
    }
  }, [DATASOPENHOUR, inputs]);

  const addHandler = (day: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: [
              ...item.time,
              {
                from: "8:00",
                to: "18:00",
                days_of_week: item.days,
                isDelete: false,
                isNewInput: true,
                status: 1,
              },
            ],
          }
        : item,
    );
    setInputs(newInput);
  };

  const deleteHandler = (key: number, day: string, id?: string) => {
    const newInput = inputs.map((item) => {
      if (item.days === day) {
        const newTime = item.time.map((time, index) => {
          if (key === index) {
            return {
              ...time,
              isDelete: !time.isDelete,
            };
          }

          return time;
        });
        console.log(newTime);

        return {
          ...item,
          time: newTime,
        };
      }

      return item;
    });

    setInputs(newInput);
  };

  const inputHandler = (
    text: string,
    day: string,
    key: number,
    idTime?: string,
  ) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: item.time.map((time, idx) =>
              idTime
                ? time.id === idTime
                  ? { ...time, from: text }
                  : time
                : idx === key
                  ? { ...time, from: text }
                  : time,
            ),
          }
        : item,
    );

    setInputs(newInput);
  };
  const inputHandler2 = (
    text: string,
    day: string,
    key: number,
    idTime?: string,
  ) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: item.time.map((time, idx) =>
              idTime
                ? time.id === idTime
                  ? { ...time, to: text }
                  : time
                : idx === key
                  ? { ...time, to: text }
                  : time,
            ),
          }
        : item,
    );

    setInputs(newInput);
  };
  const handleChangeDays = (e: any, index: number) => {
    const newInputs = [...inputs];

    newInputs[index].isChecked = e.target.checked;

    setInputs(newInputs);
  };

  console.log(inputs);

  const checkListDelete = (arrTime: any[]) => {
   const listDelete = arrTime.filter((time) => {
    return time.isDelete == false
   })
  return listDelete
  }

  
  


  const handleEditOpenHours = () => {
    const dataCreateOpenHours: {
      open_hours: any[];
    } = {
      open_hours: [],
    };

    inputs.map((item) => {
      if (item.isChecked) {
        item.time.map((time) => {
          if (time.isNewInput && !time.isDelete) {
            dataCreateOpenHours.open_hours.push({
              days_of_week: item.days,
              start_time: time.from,
              end_time: time.to,
              status: item.isChecked ? 1 : 0,
              isDelete: time.isDelete,
            });
          }
          if (!time.isNewInput) {
            dataCreateOpenHours.open_hours.push({
              id: time.id,
              start_time: time.from,
              end_time: time.to,
              isDelete: time.isDelete,
              days_of_week: time.days_of_week,
              status: item.isChecked ? 1 : 0,
            });
          }
        });
      }
    });

    
    

    createOpenHours(dataCreateOpenHours)
      .then((data) => {
        toast.success(data.data.message);
      })
      .catch((error) => {
        toast.error("Failed to update schdule.");
      });
  };

  return (
    <div className=" mt-4 h-full w-full rounded-2xl border-2  border-stroke pb-2.5  pb-6  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-col gap-10 ">
        {inputs.map((data, idx) => (
          <div key={data.days} className="flex w-full items-start">
            <div className="flex w-[30%] items-center gap-8">
              <input
                id="default-checkbox"
                type="checkbox"
                defaultChecked={data.isChecked}
                onChange={(e) => handleChangeDays(e, idx)}
                className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-6 w-6 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />

              <label
                htmlFor="default-checkbox"
                className="text-lg font-semibold text-black"
              >
                {data.days}
              </label>
            </div>
            {data.isChecked ? (
              <div className="flex w-[70%] flex-col gap-4">
                <div className="flex flex-col gap-8">
                  {data.time.map((input, key) => (
                   <React.Fragment key={key}>
                    {!input.isDelete &&  <div  className="flex w-full items-center gap-4">
                      <select
                        className="w-[40%] rounded-xl border"
                        name="whatever"
                        id="frm-whatever"
                        value={input.from}
                        onChange={(text) =>
                          inputHandler(
                            text.target.value,
                            data.days,
                            key,
                            input.id,
                          )
                        }
                      >
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

                      <span className="text-xl font-semibold ">-</span>
                      <select
                        className="w-[40%] rounded-xl border"
                        name="whatever"
                        id="frm-whatever2"
                        value={input.to}
                        onChange={(text) =>
                          inputHandler2(
                            text.target.value,
                            data.days,
                            key,
                            input.id,
                          )
                        }
                      >
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

                      {checkListDelete(data.time).length > 1 && (
                        <Image
                          className="cursor-pointer"
                          onClick={() =>
                            deleteHandler(key, data.days, input?.id)
                          }
                          src="/images/icon/icon-delete.svg"
                          alt="delete"
                          width={20}
                          height={20}
                        />
                      )}

                      {checkListDelete(data.time).length < 2 && (
                        <Image
                          className="cursor-pointer"
                          onClick={() => addHandler(data.days)}
                          src="/images/icon/icon-plus.svg"
                          alt="delete"
                          width={20}
                          height={20}
                        />
                      )}
                    </div>}
                   </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mr-[90px] flex w-full justify-end">
                <button className="rounded-xl border px-4 py-1">Close</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className=" flex items-center justify-center rounded-b  p-6">
        <button
          //   onClick={() => router.back()}
          className="mb-1 mr-10 rounded bg-bodydark px-6 py-3 text-sm font-bold uppercase text-white outline-none transition-all duration-150 ease-linear focus:outline-none"
          type="button"
        >
          Cancel
        </button>

        <button
          className="mb-1 ml-10 rounded bg-primary px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-primary"
          onClick={handleEditOpenHours}
        >
          Save
        </button>
      </div>
    </div>
  );
}
