import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryNew from "@/components/Category/CategoryNew";

export const metadata: Metadata = {
  title: "Category New | NailsAdmin Template",
  description:
    "This is Category New page for NailsAdmin Template",
};

const CategoryNewPage = () => {
  return (
    <DefaultLayout>
      <CategoryNew />
    </DefaultLayout>
  );
};

export default CategoryNewPage;
