import { Metadata } from "next";
import AppointmentAddAssistant from "@/components/Apointments/AddAssistant";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Appointment add assistant | NailsAdmin Template",
  description: "This is Appointment add assistant page for NailsAdmin Template",
};

const AppointmentAddAssistantPage = () => {
  return (
    <DefaultLayout>
      <AppointmentAddAssistant />
    </DefaultLayout>
  );
};

export default AppointmentAddAssistantPage;
