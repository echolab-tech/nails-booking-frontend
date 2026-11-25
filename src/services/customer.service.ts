import { CustomerEditForm } from "@/types/customerEditForm";
import { http } from "../lib/http";
import { CustomerForm } from "@/types/customerForm";
import { CustomerSearchForm } from "@/types/customerSearchForm";
import { CustomerFormAdd } from "@/types/customerAdd";

export const customers = async (values: CustomerForm): Promise<any> => {
  return await http.post<any>("/customers", values);
};

export const addCustomersBooking = async (values: CustomerFormAdd): Promise<any> => {
  return await http.post<any>("/customers/add/new", values);
};

export const addDesciptionOfCustomer = async (customerId: number, description: string): Promise<any> => {
  return await http.post<any>("/customers/description", { customerId, description });
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

export const getAllCustomer = async (search?: any): Promise<any> => {
  return await http.get<any>(`/customers?getall=true&searchText=${search}`);
};

export const getCustomerShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/customers/${id}`);
};

export const getSearchCustomer = async (
  page: number,
  search: any | null,
): Promise<any> => {
  return await http.get<any>(
    `/customers?search=${search ? search : ""}&page=${page}`,
  );
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

// Miro Frame 1 #19: Exception — thời gian / giá cộng thêm theo từng khách cho từng service
export type CustomerServiceException = {
  id: number;
  customer_id: number;
  service_id: number;
  extra_minutes: number;
  extra_price: number;
  note?: string | null;
  service?: { id: number; name: string };
};

export const getCustomerExceptions = async (customerId: string | number): Promise<any> => {
  return await http.get<any>(`/customers/${customerId}/exceptions`);
};

export const saveCustomerException = async (
  customerId: string | number,
  data: { service_id: number | string; extra_minutes: number; extra_price: number; note?: string },
): Promise<any> => {
  return await http.post<any>(`/customers/${customerId}/exceptions`, data);
};

export const deleteCustomerException = async (customerId: string | number, id: number): Promise<any> => {
  return await http.delete<any>(`/customers/${customerId}/exceptions/${id}`);
};
