import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ServiceSummaryNew from "@/components/ServiceSummary/ServiceSummaryNew";

export const metadata: Metadata = {
  title: "Category Update | NailsAdmin Template",
  description: "This is Category New page for NailsAdmin Template",
};

const ServiceSummaryUpdatePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category Update" />
      <ServiceSummaryNew />
    </DefaultLayout>
  );
};

export default ServiceSummaryUpdatePage;
