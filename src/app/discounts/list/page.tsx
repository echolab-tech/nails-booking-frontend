import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DiscountsForm from "@/components/Discounts/List/page";

export const metadata: Metadata = {
  title: "Discounts List | NailsAdmin Template",
  description: "This is Discounts List page for NailsAdmin Template",
};

const DiscountsListPage = () => {
  return (
    <DefaultLayout>
      <DiscountsForm />
    </DefaultLayout>
  );
};

export default DiscountsListPage;
