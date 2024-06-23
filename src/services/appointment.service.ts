import { AssistantSearchForm } from "@/types/AssitantSearch";
import { http } from "../lib/http";
import { AppointmentAddForm } from "@/types/AppointmentAddForm";

export const appointmentsPost = async (values: AppointmentAddForm): Promise<any> => {
  return await http.post<any>("/appointments", values);
};

export const  getListAppointmentCustomer = async (customer_id: number): Promise<any> => {
  return await http.get<any>(`/appointments/list/${customer_id}`);
};

export const  getAppointmentShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/appointments/${id}`);
};

