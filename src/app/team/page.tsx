import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Team from "@/components/Team";

export const metadata: Metadata = {
  title: "Team | NailsAdmin Template",
  description:
    "This is Team page for NailsAdmin Template",
};

const CalendarPage = () => {
  return (
    <DefaultLayout>
      <Team />
    </DefaultLayout>
  );
};

export default CalendarPage;
