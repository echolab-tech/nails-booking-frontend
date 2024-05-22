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

      <div className="h-[500px] w-full rounded-2xl border-2  border-stroke pb-2.5  pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="text-gray-500 dark:text-gray-400 w-full text-left text-sm rtl:text-right">
            <thead>
              <tr>
                {HEADERSTABLE.map((header) => (
                  <th scope="row" key={header} className="pl-10 pr-10">
                    <h5 className="text-lg font-semibold text-black">
                      {header}
                    </h5>
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
                        className="w-[40px' h-[40px]"
                      />

                      <div className="">
                        <p className="flex text-lg font-medium text-black dark:text-white ">
                          {item.userName}
                        </p>
                        <p className="w-max text-sm text-black dark:text-white ">
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
                  </td>

                  {item.scheduleds.map((scheduled, index) => (
                    <td scope="row" className="px-6 py-4" key={index}>
                      <div className="bg-gray-4 flex w-max items-center rounded-2xl pb-1.5 pl-1.5 pr-1.5 pt-1.5 lg:pl-5 lg:pr-5">
                        <p className="whitespace-nowrap text-lg text-black dark:text-white sm:block">
                          {scheduled.time}
                        </p>
                      </div>
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
    </DefaultLayout>
  );
};

export default ScheduledPage;
