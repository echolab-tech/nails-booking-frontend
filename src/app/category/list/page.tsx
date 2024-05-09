import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryList from "@/components/Category/CategoryList";

export const metadata: Metadata = {
  title: "Category List | NailsAdmin Template",
  description:
    "This is Category List page for NailsAdmin Template",
};

const CategoryListPage = () => {
  return (
    <DefaultLayout>
      <CategoryList />
    </DefaultLayout>
  );
};

export default CategoryListPage;
