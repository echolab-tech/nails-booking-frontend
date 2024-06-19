import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceSingleNew from "@/components/Service/NewFormService";

export const metadata: Metadata = {
  title: "Service single New | NailsAdmin Template",
  description:
    "This is Service single New page for NailsAdmin Template",
};

const ServiceSingleNewPage = () => {
  return (
    <DefaultLayout>
      <ServiceSingleNew />
    </DefaultLayout>
  );
};

export default ServiceSingleNewPage;
