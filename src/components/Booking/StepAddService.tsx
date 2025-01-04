"use client";
import React, { useEffect, useState } from "react";
import { FcBusinessman, FcIdea } from "react-icons/fc";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { CategoryType } from "../../types/Category";
import { MdArrowForwardIos } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { Tooltip } from "flowbite-react";
import { getCategoryById } from "@/services/categories.service";
import { getServiceByCategoryId } from "@/services/serviceoption.service";
import { serviceTypeNew } from "@/types/ServiceNew";

const StepAddService = ({
  handleBack,
  handleNext,
  showDetail,
  onShowDetail,
  formik,
}: any) => {
  const [categories, setCategories] = useState<serviceTypeNew[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [serviceOptions, setServiceOptions] = useState<any[]>([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingFormData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.categories) {
        fetchCategories(parsedData.categories);
        if (parsedData.categoryId) {
          setSelectedCategoryId(parsedData.categoryId);
        }
      }
    }
  }, []);

  const fetchCategories = async (id: string) => {
    try {
      const result = await getServiceByCategoryId(id);
      if (result?.data?.data) {
        setCategories(result.data.data);
        const storedData = JSON.parse(sessionStorage.getItem('bookingFormData') || '{}');
        if (storedData.categoryId) {
          const selectedCategory = result.data.data.find(
            (cat: any) => cat.id === storedData.categoryId
          );
          if (selectedCategory) {
            setSelectedCategoryId(selectedCategory.id);
            setServiceOptions(selectedCategory.serviceOptions || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleShowDetail = (category: any) => {
    onShowDetail();
    setSelectedCategoryId(category.id);
    const options = category.serviceOptions || [];
    setServiceOptions(options);
    
    const currentData = JSON.parse(sessionStorage.getItem('bookingFormData') || '{}');
    sessionStorage.setItem('bookingFormData', JSON.stringify({
      ...currentData,
      categoryId: category.id
    }));
  };

  const handleCheckboxChange = (event: any, option: any) => {
    const isChecked = event.target.checked;
    let selectedServices = [...formik.values.services];

    if (isChecked) {
      selectedServices.push(option);
    } else {
      selectedServices = selectedServices.filter(
        (item) => item.id !== option.id
      );
    }

    formik.setFieldValue("services", selectedServices);
    handleNext();
  };
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
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
          <p className="text mb-1">
            Service category : <span className="text-primary">{formik.values.appointment_category || ''}</span>
          </p>
        </div>
      </div>
      <div className="p-10 bg-white w-full rounded-lg shadow-lg">
        <h3 className="text-2xl text-primary mb-3">
          I want to order a service...
        </h3>
        <div className="mt-4 mb-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          {categories?.map((item, index) => (
            <div className="col-span-12 xl:col-span-6" key={index}>
              <button
                onClick={() => handleShowDetail(item)}
                className="w-full flex justify-between bg-transparent hover:bg-gray-2 text-dark font-semibold py-4 px-4 border border-stroke rounded"
              >
                {item?.name}
                <MdArrowForwardIos size={20} />
              </button>
            </div>
          ))}
          {selectedCategoryId && (
            <div className="col-span-12">
              {serviceOptions.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between items-center mb-4 border-b py-4 border-stroke"
                >
                  <div className="flex">
                    <input
                      id={`checkbox-${index}`}
                      type="checkbox"
                      checked={formik.values.services.some(
                        (service: any) => service.id === item.id
                      )}
                      onChange={(e) => handleCheckboxChange(e, item)}
                      className="w-6 h-6 text-blue-600 bg-transparent border-stroke border-2 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-${index}`}
                      className="ms-2 me-4 text-sm font-medium text-gray-900 dark:text-gray-300 block"
                    >
                      <div className="flex">
                        <p className="font-bold">{item?.title}</p>
                        <Tooltip
                          content={item?.description}
                          style="dark"
                          trigger="hover"
                          className="w-[300px]"
                        >
                          <IoIosHelpCircleOutline size={20} color="warning" />
                        </Tooltip>
                      </div>
                      <p>{item?.option_name}</p>
                    </label>
                  </div>
                  <div className="flex">{formatPrice(Number(item?.price))}</div>
                </div>
              ))}
              {serviceOptions.length === 0 && (
                <p className="text-center text-gray-500">No service options available for this category</p>
              )}
            </div>
          )}
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

export default StepAddService;
