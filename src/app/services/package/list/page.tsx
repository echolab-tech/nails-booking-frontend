import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceComboNew from "@/components/Service/NewComboService";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ServiceList from "@/components/Service/List";
import PackageList from "@/components/Service/ListPackage";

export const metadata: Metadata = {
  title: "Service combo New | NailsAdmin Template",
  description: "This is combo single New page for NailsAdmin Template",
};

const PackageListPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List package" />
      <PackageList />
    </DefaultLayout>
  );
};

export default PackageListPage;
