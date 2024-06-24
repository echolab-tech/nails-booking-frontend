import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceComboNew from "@/components/Service/NewComboService";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Service combo New | NailsAdmin Template",
  description: "This is combo single New page for NailsAdmin Template",
};

const ServicePackagePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add a new package" />
      <ServiceComboNew />
    </DefaultLayout>
  );
};

export default ServicePackagePage;
