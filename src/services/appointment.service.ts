import { AppointmentSearchForm } from "@/types/AppointmentSearch";
import { http } from "../lib/http";
import { BookingFormType } from "@/types/event";

export const appointmentsPost = async (
  values: BookingFormType,
): Promise<any> => {
  return await http.post<any>("/appointments", values);
};

export const getAppointmentByDate = async (): Promise<any> => {
  return await http.get<any>(`/appointments/list/`);
};

export const getListAppointmentCustomer = async (
  customer_id: number,
): Promise<any> => {
  return await http.get<any>(`/appointments/list/${customer_id}`);
};

export const getAppointmentShow = async (id: number): Promise<any> => {
  return await http.get<any>(`/appointments/${id}`);
};

export const getListAppointment = async (
  values: AppointmentSearchForm,
  page: number,
): Promise<any> => {
  return await http.get<any>(`/appointments?page=${page}`, { params: values });
};
