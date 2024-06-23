import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceList from "@/components/Service/List";

export const metadata: Metadata = {
  title: "Service List | NailsAdmin Template",
  description: "This is Service List page for NailsAdmin Template",
};

const ServiceListPage = () => {
  return (
    <DefaultLayout>
      <ServiceList />
    </DefaultLayout>
  );
};

export default ServiceListPage;
