import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

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

const ScheduledPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Scheduled shifts" />

      <div className="h-[500px] rounded-2xl border-2 border-stroke  pb-2.5 pt-6  dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-col">
          <div
            className={`grid grid-cols-3 rounded-sm  pl-5 pr-5 sm:grid-cols-7`}
          >
            {HEADERSTABLE.map((header) => (
              <div key={header} className="pl-2.5">
                <h5 className="text-lg font-semibold text-black">{header}</h5>
              </div>
            ))}
          </div>
          {SCHEDULEDSHIFTS.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 rounded-sm p-5 sm:grid-cols-7`}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.avata}
                  alt={item.userName}
                  width={40}
                  height={40}
                />

                <div>
                  <p className="text hidden font-medium text-black dark:text-white sm:block">
                    {item.userName}
                  </p>
                  <p className="hidden text-sm text-black dark:text-white sm:block">
                    {item.totalHours}
                  </p>
                </div>
                <Image
                  src="/images/scheduled/edit.svg"
                  width={50}
                  height={50}
                  alt="edit"
                />
              </div>

              {item.scheduleds.map((scheduled, index) => (
                <>
                  <div
                    className="bg-gray-4 flex  max-w-max items-center rounded-2xl pb-1.5 pl-5 pr-5 pt-1.5"
                    key={index}
                  >
                    <p className="text-lg text-black dark:text-white sm:block">
                      {scheduled.time}
                    </p>
                  </div>
                </>
              ))}
              <div>
                <Image
                  src="/images/scheduled/plus.svg"
                  width={50}
                  height={50}
                  alt="edit"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduledPage;
