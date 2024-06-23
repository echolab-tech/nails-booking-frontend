import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ApointmentList from "@/components/Apointments/ApoinmentsList";

export const metadata: Metadata = {
  title: "Apointment list | NailsAdmin Template",
  description: "This is Apointment list page for NailsAdmin Template",
};

const ApointmentListPage = () => {
  return (
    <DefaultLayout>
      <ApointmentList />
    </DefaultLayout>
  );
};

export default ApointmentListPage;
