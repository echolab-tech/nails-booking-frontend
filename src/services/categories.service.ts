import { CATEGORY } from "@/types/Category";
import { http } from "../lib/http";
export const categories = async (values: CATEGORY): Promise<any> => {
    return await http.post<any>("/categories", values);
};

export const getCategories = async (page: number): Promise<any> => {
    return await http.get<any>(`/categories?page=${page}`);
};

export const getCategoryShow = async (id: BigInt): Promise<any> => {
    return await http.get<any>(`/categories/${id}`);
};

export const getCategoryUpdate = async (values: CATEGORY, id: BigInt): Promise<any> => {
    return await http.put<any>(`/categories/${id}`,values);
};
export const deleteCategory = async (id: BigInt): Promise<any> => {
    return await http.delete<any>(`/categories/${id}`);
};