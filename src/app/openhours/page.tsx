import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DropdownDefault from "@/components/Dropdowns/DropdownDefault";
import EditSchduled from "@/components/EditScheduled";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OpenHours from "@/components/OpenHours/page";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function OpenHoursPage() {
  return (
    <DefaultLayout>
      <span className="font-bold text-3xl text-black">Edit opening hours</span>
      <OpenHours />
    </DefaultLayout>
  );
}
