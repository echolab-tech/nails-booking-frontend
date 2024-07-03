"use client";
import { getAssistantShow } from "@/services/assistants.service";
import { ScheduledOfUser } from "@/types/Schedule";
import { log } from "console";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import { createSchedule } from "@/services/schedules.service";
import { toast, ToastContainer } from "react-toastify";
// const { visibleId, toggle } = useModal();

export default function EditSchduled() {
  const searchParams = useSearchParams();
  const userID = searchParams.get("userID");
  const [dataAssistant, setDataAssistant] = useState<any>();

  const [isSuccess, setIsSuccess] = useState(false);

  const fetchDataAssistant = useCallback(async (userID: number) => {
    const schedules = await getAssistantShow(userID);

    setDataAssistant(schedules.data);
  }, []);

  useEffect(() => {
    if (userID) {
      fetchDataAssistant(Number(userID));
    }
  }, [fetchDataAssistant, userID]);

  const DATASCHDULEDOFUSER = useMemo(() => {
    const LISTDAY = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    console.log(dataAssistant);

    const scheduleOfUser: any[] = [];
    if (dataAssistant) {
      LISTDAY.map((day) => {
        const arrTime: {
          id?: string;
          from: string;
          assistant_id?: number;
          date: string;
          to: string;
        }[] = [];
        dataAssistant.data.schedule.map((data: any) => {
          if (data.weekdays === day) {
            arrTime.push({
              id: data.id,
              from: data.start_time,
              to: data.end_time,
              date: data.date,
            });
          }
        });

        scheduleOfUser.push({
          days: day,
          time: arrTime,
        });
   
      })
      
      return scheduleOfUser;
    }
  }, [dataAssistant]);

  

  const [inputs, setInputs] = useState<ScheduledOfUser[]>([]);

  useEffect(() => {
    if (!inputs.length && DATASCHDULEDOFUSER) {
      setInputs(DATASCHDULEDOFUSER);
    }
  }, [DATASCHDULEDOFUSER, inputs]);


  const addHandler = (day: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: [
              ...item.time,
              item.time.length == 0 ? {
                from: '8:00',
                assistant_id: dataAssistant.data.id,
                to: '18:00',
                weekdays: item.days
              }: {
                from: "8:00",
                to: "18:00",
                date: item.time[0].date,
                assistant_id: dataAssistant.data.id,
                weekdays: item.days

              },
             
            ],
          }
        : item,
    );
    setInputs(newInput);
  };

  const deleteHandler = (key: number, day: string, id?: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: item.time.filter((time, index) =>
              id ? time.id != id : index != key,
            ),
          }
        : item,
    );

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
            time: item.time.map((time,idx) =>
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

  const handleCreateSchedule = () => {
    const dataCreateSchedule: {
      schedules: any[];
    } = {
      schedules: [],
    };

    inputs.map((item) =>
      item.time.map((time) =>
      dataCreateSchedule.schedules.push(
          time.id
            ? {
                id: time.id,
                start_time: time.from,
                date: time.date,
                end_time: time.to,
              }
            : {
                start_time: time.from,
                assistant_id: dataAssistant.data.id,
                date: time.date,
                end_time: time.to,
                weekdays: item.days
              },
        ),
      ),
    );

    createSchedule(dataCreateSchedule)
      .then((data) => {
       
        toast.success(data.data.message)
        
      })
      .catch((error) => {
        toast.error("Failed to update schdule.");
      });
  };

  
  return (
    <div  className="h-full w-full rounded-2xl border-2  border-stroke pb-2.5  pb-6  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <Breadcrumb
        pageName={`Set ${dataAssistant?.data?.name}'s regular shifts`}
      />
   
      <div className="flex flex-col gap-10 ">
        {inputs.map((data) => (
          <div key={data.days} className="flex w-full items-start">
            <div className="flex w-[30%] items-center gap-8">
              <input
                id="default-checkbox"
                type="checkbox"
                defaultChecked
                className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-6 w-6 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="default-checkbox"
                className="text-lg font-semibold text-black"
              >
                {data.days}
              </label>
            </div>
            <div className="flex w-[70%] flex-col gap-4">
              <div className="flex flex-col gap-8">
                {data.time.map((input, key) => (
                  <div
                    key={key}
                    className="flex w-full items-center gap-4"
                  >
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

                    <Image
                      className="cursor-pointer"
                      onClick={() => deleteHandler(key, data.days, input?.id)}
                      src="/images/scheduled/trash.svg"
                      alt="delete"
                      width={20}
                      height={20}
                    />
                  </div>
                ))}
              </div>
              <span
                className="cursor-pointer font-semibold text-blue2"
                onClick={() => addHandler(data.days)}
              >
                Add a shifts
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className=" flex items-center justify-center rounded-b  p-6">
        <Link href="/scheduled">
          <button
            className="text-white bg-bodydark mb-1 rounded mr-10 px-6 py-3 text-sm font-bold uppercase outline-none transition-all duration-150 ease-linear focus:outline-none"
            type="submit"
          >
            Cancel
          </button>
        </Link>
        
        <button
          className="active:bg-primary mb-1 ml-10 rounded bg-primary px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
          onClick={handleCreateSchedule}
        >
          Save
        </button>
      </div>
      <ToastContainer />

    </div>
  );
}
