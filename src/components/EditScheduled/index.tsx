"use client";
import { ScheduledOfUser } from "@/types/Schedule";
import Image from "next/image";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function EditSchduled() {
  const DATASCHDULEDOFUSER = [
    {
      days: "Monday",
      time: [{ id: uuidv4(), from: "8:00", to: "18:00" }],
    },
    {
      days: "Tuesday",
      time: [{ id: uuidv4(), from: "8:00", to: "18:00" }],
    },
    {
      days: "Wednesday",
      time: [{ id: uuidv4(), from: "8:00", to: "18:00" }],
    },
    {
      days: "Thursday",
      time: [{ id: uuidv4(), from: "8:00", to: "18:00" }],
    },
    {
      days: "Friday",
      time: [{ id: uuidv4(), from: "8:00", to: "18:00" }],
    },
  ];

  const [inputs, setInputs] = useState<ScheduledOfUser[]>(DATASCHDULEDOFUSER);

  const addHandler = (day: string) => {
    // const _inputs = DATASCHDULEDOFUSER.find((data) => data.days === day);
    // const newInput = [...inputs];

    // newInput.push({ id: uuidv4(), from: "", to: "" });
    // console.log(newInput);

    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: [...item.time, { id: uuidv4(), from: "8:00", to: "18:00" }],
          }
        : item,
    );
    setInputs(newInput);
  };

  const deleteHandler = (id: string, day: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? { ...item, time: item.time.filter((time) => time.id != id) }
        : item,
    );

    setInputs(newInput);
  };

  const inputHandler = (text: string, day: string, idTime: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: item.time.map((time) =>
              time.id === idTime ? { ...time, from: text } : time,
            ),
          }
        : item,
    );

    setInputs(newInput);
  };
  const inputHandler2 = (text: string, day: string, idTime: string) => {
    const newInput = inputs.map((item) =>
      item.days === day
        ? {
            ...item,
            time: item.time.map((time) =>
              time.id === idTime ? { ...time, to: text } : time,
            ),
          }
        : item,
    );

    setInputs(newInput);
  };

  return (
    <div className="h-full w-full rounded-2xl border-2  border-stroke pb-2.5  pb-6  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-col gap-10 ">
        {inputs.map((data) => (
          <div key={data.days} className="flex w-full items-start">
            <div className="flex w-[30%] items-center gap-8">
              <input
                id="default-checkbox"
                type="checkbox"
                value=""
                checked
                className="bg-gray-100 border-gray-300 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-9 w-9 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
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
                    key={input.id}
                    className="flex w-full items-center gap-4"
                  >
                    <select
                      className="w-[40%] rounded-xl border"
                      name="whatever"
                      id="frm-whatever"
                      onChange={(text) =>
                        inputHandler(text.target.value, data.days, input.id)
                      }
                    >
                      <option value="">{input.from}</option>
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
                      onChange={(text) =>
                        inputHandler2(text.target.value, data.days, input.id)
                      }
                    >
                      <option value="">{input.to}</option>
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
                      onClick={() => deleteHandler(input.id, data.days)}
                      src="/images/scheduled/trash.svg"
                      alt="delete"
                      width={40}
                      height={40}
                    />
                  </div>
                ))}
              </div>
              <span
                className="text-blue2 cursor-pointer font-semibold"
                onClick={() => addHandler(data.days)}
              >
                Add a shifts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
