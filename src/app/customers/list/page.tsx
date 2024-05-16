import TableFive from "@/components/Tables/TableFive";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CustomersList = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10">
        <TableFive />
      </div>
    </DefaultLayout>
  );
};

export default CustomersList;