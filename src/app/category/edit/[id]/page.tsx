import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryNew from "@/components/Category/CategoryNew";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Category Update | NailsAdmin Template",
  description: "This is Category New page for NailsAdmin Template",
};

const CategoryUpdatePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category Update" />
      <CategoryNew />
    </DefaultLayout>
  );
};

export default CategoryUpdatePage;
