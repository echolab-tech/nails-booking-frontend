import { CategoryType } from "@/types/Category";
import { http } from "../lib/http";
import { ServiceSummaryType } from "@/types/ServiceSummary";

export const serviceSummaryNew = async (values: ServiceSummaryType): Promise<any> => {
  return await http.post<any>("/service-summary", values);
};

export const getServiceSummaries = async (
  page: number,
  isAll: boolean,
): Promise<any> => {
  return await http.get<any>(`/service-summary?page=${page}&all=${isAll}`);
};

export const getServcieSummaryById = async (id: string): Promise<any> => {
  return await http.get<any>(`/service-summary/${id}`);
};

export const updateServiceSummary = async (
  values: ServiceSummaryType,
  id: string,
): Promise<any> => {
  return await http.put<any>(`/service-summary/${id}`, values);
};
export const deleteCategory = async (id: string | null): Promise<any> => {
  return await http.delete<any>(`/service-summary/${id}`);
};
