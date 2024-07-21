import { CATEGORY } from "@/types/Category";
import { http } from "../lib/http";
export const categories = async (values: CATEGORY): Promise<any> => {
  return await http.post<any>("/categories", values);
};

export const getCategories = async (): Promise<any> => {
  return await http.get<any>(`/categories?all=true`);
};

export const getCategoryShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/categories/${id}`);
};

export const getCategoryUpdate = async (
  values: CATEGORY,
  id: number,
): Promise<any> => {
  return await http.put<any>(`/categories/${id}`, values);
};
export const deleteCategory = async (id: number | null): Promise<any> => {
  return await http.delete<any>(`/categories/${id}`);
};
