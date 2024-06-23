import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryNew from "@/components/Category/CategoryNew";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Category New | NailsAdmin Template",
  description: "This is Category New page for NailsAdmin Template",
};

const CategoryNewPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category New" />
      <CategoryNew />
    </DefaultLayout>
  );
};

export default CategoryNewPage;
