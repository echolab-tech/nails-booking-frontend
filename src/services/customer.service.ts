import { CustomerEditForm } from "@/types/customerEditForm";
import { http } from "../lib/http";
import { CustomerForm } from "@/types/customerForm";
import { CustomerSearchForm } from "@/types/customerSearchForm";

export const customers = async (values: CustomerForm): Promise<any> => {
  return await http.post<any>("/customers", values);
};

export const getListCustomers = async (
  values: CustomerSearchForm,
  page: number,
): Promise<any> => {
  return await http.get<any>(`/customers?page=${page}`, { params: values });
};

export const customersList = async (): Promise<any> => {
    return await http.get<any>("/customers");
};

export const getCustomerShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/customers/${id}`);
};

export const getCustomerUpdate = async (
  values: CustomerEditForm,
  id: number,
): Promise<any> => {
  return await http.put<any>(`/customers/${id}`, values);
};

export const deleteCustomer = async (id: number): Promise<any> => {
  return await http.delete<any>(`/customers/${id}`);
};

export const getCountry = async (): Promise<any> => {
  return await http.get<any>("/country");
};

export const getStatus = async (): Promise<any> => {
  return await http.get<any>("/status");
};
