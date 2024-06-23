import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceSingleNew from "@/components/Service/NewFormService";

export const metadata: Metadata = {
  title: "Service single Edit",
  description: "This is Service single New page for NailsAdmin Template",
};

const ServiceEditPage = () => {
  return (
    <DefaultLayout>
      <ServiceSingleNew />
    </DefaultLayout>
  );
};

export default ServiceEditPage;
