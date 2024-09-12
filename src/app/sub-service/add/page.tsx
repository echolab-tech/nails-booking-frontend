import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceSingleNew from "@/components/Service/NewFormService";
import SubServiceNew from "@/components/Service/SubService";

export const metadata: Metadata = {
  title: "Sub service New | NailsAdmin Template",
  description: "This is Service single New page for NailsAdmin Template",
};

const SubServiceNewPage = () => {
  return (
    <DefaultLayout>
      <SubServiceNew />
    </DefaultLayout>
  );
};

export default SubServiceNewPage;
