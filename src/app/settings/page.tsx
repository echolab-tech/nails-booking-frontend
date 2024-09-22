import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card } from "flowbite-react";
import { CiGift } from "react-icons/ci";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Link href="/settings/gift-cards">
              <Card className="max-w-sm">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <CiGift fontSize={30} />
                  Gift cards
                </h5>
                <p className="text-gray-700 font-normal dark:text-gray-400">
                  Choose how you would like to sell your gift cards, and
                  customise their settings.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
