import { CategoryType } from "@/types/Category";
import { http } from "../lib/http";
import { ServiceSummaryType } from "@/types/ServiceSummary";

export const serviceSummaryNew = async (
  values: ServiceSummaryType,
): Promise<any> => {
  return await http.post<any>("/services-summary", values);
};

export const getServiceSummaries = async (
  page: number | null,
  isAll: boolean | null,
): Promise<any> => {
  if (page) {
    return await http.get<any>(`/services-summary?page=${page}`);
  }
  if (isAll) {
    return await http.get<any>(`/services-summary?all=${isAll}`);
  }
};

export const getServcieSummaryById = async (id: string): Promise<any> => {
  return await http.get<any>(`/services-summary/${id}`);
};

export const updateServiceSummary = async (
  values: ServiceSummaryType,
  id: string,
): Promise<any> => {
  return await http.put<any>(`/services-summary/${id}`, values);
};
export const deleteCategory = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/services-summary/${id}`);
};
