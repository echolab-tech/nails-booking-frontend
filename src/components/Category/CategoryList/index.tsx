"use client";
import React, { useEffect, useState } from "react";
import {
  deleteCategory,
  getCategories,
  getCategoryShow,
} from "@/services/categories.service";
import { CATEGORY } from "@/types/Category";
import PaginationCustom from "@/components/Pagination/Pagination";
import DialogEdit from "../Dialog/Dialog";
import { CATEGORYESHOW } from "@/types/CategoryEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "flowbite-react";
import { DialogConfirm } from "@/components/Dialog/DialogConfirm";
// const ITEMS_PER_PAGE = 5;
interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}
const CategoryList = () => {
  const [categoryData, setCategoryData] = useState<CATEGORYESHOW[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [idDel, setIdDel] = useState<number | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<CATEGORYESHOW | null>(null);

  useEffect(() => {
    fetchCategories(1);
  }, []);

  const fetchCategories = async (page: number) => {
    try {
      const response = await getCategories(page);
      setCategoryData(response.data.data);
      setPaginationData(response.data.metadata);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onPageChange = (page: number) => {
    fetchCategories(page);
  };

  const onClose = () => {
    setIdDel(null);
    setOpenModal(false);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleButtonClick = async (categoryId: number) => {
    try {
      const response = await getCategoryShow(categoryId);
      setSelectedCategory(response.data.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching category details:", error);
    }
  };

  const updateCategoryList = async () => {
    try {
      const response = await getCategories(paginationData.current_page);
      setCategoryData(response.data.data);
      setPaginationData(response.data.metadata);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleButtonDelete = (categoryId: number) => {
    setOpenModal(true);
    setIdDel(categoryId);
  };

  const onDelete = async () => {
    try {
      await deleteCategory(idDel);
      updateCategoryList();
      setOpenModal(false);
      toast.success("Delete Success !!!");
    } catch (error) {
      toast.warning("you cannot delete !!!");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Category Name
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((category, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {category.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => handleButtonDelete(category.id)}
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                        onClick={() => handleButtonClick(category.id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    {isDialogOpen && selectedCategory && (
                      <DialogEdit
                        onClose={() => setIsDialogOpen(false)}
                        show={isDialogOpen}
                        category={selectedCategory}
                        updateCategoryList={updateCategoryList}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ToastContainer />
      </div>
      <DialogConfirm
        openModal={openModal}
        message=" Are you sure you want to delete this category ?"
        onClose={onClose}
      >
        <button
          onClick={() => onDelete()}
          className="justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {"Yes, I'm sure"}
        </button>
        <button
          onClick={() => setOpenModal(false)}
          className="justify-center	rounded bg-zinc-800	 p-3 font-medium text-gray hover:bg-opacity-90"
        >
          No, cancel
        </button>
      </DialogConfirm>
      <PaginationCustom
        currentPage={paginationData.current_page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
export default CategoryList;
