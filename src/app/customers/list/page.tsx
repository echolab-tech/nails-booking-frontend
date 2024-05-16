
"use client";
import { customersList, deleteCustomer, getCustomerShow } from '@/services/customer.service';
import { CustomerEditForm } from '@/types/customerEditForm';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerList = () => {
    const router = useRouter();
    const [customers, setCustomer] = useState<CustomerEditForm[]>([]);
    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
        const response = await customersList();
            setCustomer(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
     const handleButtonClick = async (customerId: number) => {
       try {
         router.push(`/customers/edit/${customerId}`);
       } catch (error) {
         console.error("Error fetching category details:", error);
       }
     };

     const handleButtonDelete = async (customerId: number) => {
       try {
         await deleteCustomer(customerId);
         toast.success("Delete Success !!!");
       } catch (error) {
         toast.warning("you cannot delete !!!");
       }
     };
    return (
      <>
        {customers.map((customer, index) => (
          <button className="hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
              onClick={() => handleButtonDelete(customer.id)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        ))}
        <ToastContainer />
      </>
    );
}
export default CustomerList;