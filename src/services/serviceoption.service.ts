import { http } from "@/lib/http";
import { ServiceOptionSearchForm } from "@/types/ServiceDialogSearch";

export const serviceOption = async (
  values: ServiceOptionSearchForm,
): Promise<any> => {
  return await http.get<any>("/service-option", { params: values });
};

export const getServiceOptionShow = async (
  id: number,
  assistantId: string,
): Promise<any> => {
  return await http.get<any>(`/service-option/${id}/${assistantId}`);
};
