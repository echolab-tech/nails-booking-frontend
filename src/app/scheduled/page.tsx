import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import Link from "next/link";
import Schduled from "@/components/Scheduled/page";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ScheduledPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Scheduled shifts" />
      <Schduled />
    </DefaultLayout>
  );
};

export default ScheduledPage;
