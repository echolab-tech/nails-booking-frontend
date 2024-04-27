

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CalendarHours from "@/components/CalendarHours/CalendarHoursList";

export const metadata: Metadata = {
  title: "Calendar List | NailsAdmin Template",
  description:
    "This is Calendar List page for NailsAdmin Template",
};

const hoursOfDay = ['8:00', '9:00', '10:00', '11:00', '12:00'];
const employeeList = ['Nhân viên A', 'Nhân viên B', 'Nhân viên C'];

const CalendarHoursListPage = () => {
  return (
    <DefaultLayout>
      <CalendarHours hours={hoursOfDay} employees={employeeList} />
    </DefaultLayout>
  );
};

export default CalendarHoursListPage;