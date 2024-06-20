import { AssistantAddForm } from "@/types/AssistantAddForm";
import { http } from "../lib/http";
import { AssistantEditForm } from "@/types/AssistantEditFrom";
import { AssistantSearchForm } from "@/types/AssitantSearch";
export const assistants = async (values: AssistantAddForm): Promise<any> => {
  return await http.post<any>("/assistants", values);
};
export const  getListService = async (): Promise<any> => {
  return await http.get<any>("/services");
};

export const getListAssistant = async (values: AssistantSearchForm, page: number): Promise<any> => {
  return await http.get<any>(`/assistants?page=${page}`, { params: values });
};

export const  getAssistantShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/assistants/${id}`);
};

export const assistantUpdate = async (values: AssistantEditForm, id: number): Promise<any> => {
    return await http.put<any>(`/assistants/${id}`,values);
};

export const assistantDelete = async (id: number): Promise<any> => {
    return await http.delete<any>(`/assistants/${id}`);
};

export const getAssistants = async (): Promise<any> => {
  return await http.get<any>("/assistants");
};
