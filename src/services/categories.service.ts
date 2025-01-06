import { CategoryType } from "@/types/Category";
import { http } from "../lib/http";
export const categories = async (values: CategoryType): Promise<any> => {
  return await http.post<any>("/categories", values);
};

export const getCategories = async (
  page: number,
  isAll: boolean,
): Promise<any> => {
  return await http.get<any>(`/categories?page=${page}&all=${isAll}`);
};

export const getCategoryById = async (id: string): Promise<any> => {
  return await http.get<any>(`/categories/${id}`);
};

export const updateCategory = async (
  values: CategoryType,
  id: string,
): Promise<any> => {
  return await http.put<any>(`/categories/${id}`, values);
};
export const deleteCategory = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/categories/${id}`);
};

export const getListServiceSummary = async (): Promise<any> => {
  return await http.get<any>(`/list-service-summary`);
};
export const deleteServiceSummary = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/service-summary/${id}`);
};
