"use client";
import React, { useState, useEffect } from "react";
import { FcBusinessman } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import { getCategoryById } from "@/services/categories.service";
import { CategoryType } from "@/types/Category";
import { getService } from "@/services/service.service";
import { getServiceCategoriesBySummaryId } from "@/services/service-summary.service";

const StepAddCategory = ({
  handleBack,
  handleNext,
  formik,
}: any) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = sessionStorage.getItem('bookingFormData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        if (parsedData.customer_name) {
          formik.setFieldValue('customer_name', parsedData.customer_name);
        }
        if (parsedData.appointment_type) {
          formik.setFieldValue('appointment_type', parsedData.appointment_type);
        }
        
        if (parsedData.appointment_category) {
          setSelectedButton(parsedData.appointment_category);
        }
        if (parsedData.appointment_type?.service_categories?.length > 0) {
          setCategories(parsedData.appointment_type.service_categories);
        } else if (parsedData.appointment_type?.id) {
          await fetchCategories(parsedData.appointment_type.id);
        }
      } else if (formik.values.appointment_type?.id) {
        await fetchCategories(formik.values.appointment_type.id);
      }
    };

    fetchData();
  }, [formik.values.appointment_type?.id]);
  
  const fetchCategories = async (id: string) => {
    getServiceCategoriesBySummaryId(id).then((result) => {
      const categoryData = result?.data?.data;
      setCategories(categoryData);
      const currentData = JSON.parse(sessionStorage.getItem('bookingFormData') || '{}');
      sessionStorage.setItem('bookingFormData', JSON.stringify({
        ...currentData,
        appointment_type: {
          ...currentData.appointment_type,
          service_categories: categoryData
        }
      }));
    });
  };

  const handleButtonClick = (category: CategoryType) => {
    if (!category) return;
  
    setSelectedButton(category.name);
    
    formik.setFieldValue("appointment_category", category.name);
    formik.setFieldValue("categories", category.id);
    
    const currentData = JSON.parse(sessionStorage.getItem('bookingFormData') || '{}');
    sessionStorage.setItem('bookingFormData', JSON.stringify({
      ...currentData,
      appointment_category: category.name,
      categories: category.id,
      selectedCategory: category,
      currentStep: 'category'
    }));
  
    setTimeout(() => {
      handleNext();
    }, 0);
  };

  return (
    <div className="w-full space-y-6">
      <div className="p-10 bg-lime-50 w-full rounded-lg space-y-2">
        <div className="flex items-center border border-primary rounded-lg px-[13px] py-[20px] w-fit h-[50px] bg-white">
          <div className="flex items-center justify-center">
            <FcBusinessman className="w-[40px] h-[40px]" />
          </div>
          <span className="font-medium text">{formik.values.customer_name}</span>
        </div>
        <div>
          <p className="text mb-1 ">
            Service summary : <span className="text-primary">{formik.values.appointment_type?.name || ''}</span>
          </p>
        </div>
      </div>
      <div className="p-10 bg-white w-full rounded-lg shadow-lg space-y-8">
        <div className="space-y-1">
          <h3 className="text-2xl text-primary mb-1 font-bold">
            Select category
          </h3>
          <p className="text-primary">
            Please select the category we need to serve first person
          </p>
        </div>
        <div className="mt-4 mb-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {categories?.map((category: any, index: number) => (
            <div className="col-span-12 xl:col-span-6" key={index}>
              <button
                onClick={() => handleButtonClick(category)}
                className="w-full flex justify-between bg-transparent hover:bg-gray-2 text-dark font-semibold py-4 px-4 border border-stroke rounded hover:border-primary"
              >
                {category?.name}
                <MdArrowForwardIos size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-gray-4"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepAddCategory;
