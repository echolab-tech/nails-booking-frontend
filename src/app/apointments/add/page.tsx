import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ApointmentAdd from "@/components/Apointments/ApointmentsAdd";

export const metadata: Metadata = {
  title: "Apointment New | NailsAdmin Template",
  description: "This is Apointment New page for NailsAdmin Template",
};

const ApointmentNewPage = () => {
  return (
    <DefaultLayout>
      <ApointmentAdd />
    </DefaultLayout>
  );
};

export default ApointmentNewPage;
