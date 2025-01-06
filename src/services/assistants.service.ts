import { AssistantAddForm } from "@/types/AssistantAddForm";
import { http } from "../lib/http";
import { AssistantEditForm } from "@/types/AssistantEditFrom";
import { AssistantSearchForm } from "@/types/AssitantSearch";
export const assistants = async (values: AssistantAddForm): Promise<any> => {
  return await http.post<any>("/assistants", values, {
    headers: {
      "Content-Type": "mumultipart/form-data",
    },
  });
};
export const getListService = async (): Promise<any> => {
  return await http.get<any>("/services");
};

export const getListAssistant = async (
  values: AssistantSearchForm,
  page: number,
): Promise<any> => {
  return await http.get<any>(`/assistants?page=${page}`, { params: values });
};

export const getAssistantShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/assistants/${id}`);
};

export const assistantUpdate = async (
  values: AssistantEditForm,
  id: number,
): Promise<any> => {
  return await http.post<any>(`/assistants/${id}`, values, {
    headers: {
      "Content-Type": "mumultipart/form-data",
    },
  });
};

export const assistantDelete = async (id: number): Promise<any> => {
  return await http.delete<any>(`/assistants/${id}`);
};

export const getIsDeleted = async (id: number): Promise<any> => {
  return await http.get<any>(`/assistants/check-deleted/${id}`);
};
export const getAssistants = async (): Promise<any> => {
  return await http.get<any>("/assistants");
};

export const getAssistantAvalible = async (
  serviceIds: number,
  subServiceIds: Array<number>,
): Promise<any> => {
  return await http.get<any>(`/get-assistants-available`, {
    params: {
      serviceIds: serviceIds,
      subServiceIds: subServiceIds,
    },
    paramsSerializer: {
      indexes: false,
    },
  });
};

export const getAllAssistants = async (): Promise<any> => {
  return await http.get<any>("/assistants?getall=true");
};

export const getAssistantBookings = async (
  assistantId: number,
  date: string,
): Promise<any> => {
  return await http.get<any>(
    `/customer/assistants/${assistantId}/bookings?date=${date}`,
  );
};
