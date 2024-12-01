import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ServiceSummaryNew from "@/components/ServiceSummary/ServiceSummaryNew";

export const metadata: Metadata = {
  title: "Service Summary New | NailsAdmin Template",
  description: "This is Service Summary New page for NailsAdmin Template",
};

const ServiceSummaryNewPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Service Summary New" />
      <ServiceSummaryNew />
    </DefaultLayout>
  );
};

export default ServiceSummaryNewPage;
