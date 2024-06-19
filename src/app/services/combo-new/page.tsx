import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceComboNew from "@/components/Service/NewComboService";

export const metadata: Metadata = {
  title: "Service combo New | NailsAdmin Template",
  description:
    "This is combo single New page for NailsAdmin Template",
};

const ServiceSingleNewPage = () => {
  return (
    <DefaultLayout>
      <ServiceComboNew />
    </DefaultLayout>
  );
};

export default ServiceSingleNewPage;
