import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PaymentList from "@/components/PaymentList";

export const metadata: Metadata = {
  title: "Payment list | NailsAdmin Template",
  description: "This is Payment list page for NailsAdmin Template",
};

const PaymentListPage = () => {
  return (
    <DefaultLayout>
      <PaymentList />
    </DefaultLayout>
  );
};

export default PaymentListPage;
