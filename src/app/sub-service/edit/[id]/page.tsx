import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ServiceSingleNew from "@/components/Service/NewFormService";
import SubServiceNew from "@/components/Service/SubService";

export const metadata: Metadata = {
  title: "Sub service edit | NailsAdmin Template",
  description: "This is Service single New page for NailsAdmin Template",
};

const SubServiceEditPage = () => {
  return (
    <DefaultLayout>
      <SubServiceNew />
    </DefaultLayout>
  );
};

export default SubServiceEditPage;
