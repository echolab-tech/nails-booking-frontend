import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WaitList from "@/components/WaitList/List";

export const metadata: Metadata = {
  title: "Service List | NailsAdmin Template",
  description: "This is Service List page for NailsAdmin Template",
};

const WaitListPage = () => {
  return (
    <DefaultLayout>
      <WaitList />
    </DefaultLayout>
  );
};

export default WaitListPage;
