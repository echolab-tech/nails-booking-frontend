import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ServiceSummaryList from "@/components/ServiceSummary/ServiceSummaryList";

export const metadata: Metadata = {
  title: "Service Summary List | NailsAdmin Template",
  description: "This is Service Summary List page for NailsAdmin Template",
};

const ServiceSummaryListPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Service Summary List" />
      <ServiceSummaryList />
    </DefaultLayout>
  );
};

export default ServiceSummaryListPage;
