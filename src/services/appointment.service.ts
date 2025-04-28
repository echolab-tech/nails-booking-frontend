import { AppointmentSearchForm } from "@/types/AppointmentSearch";
import { http } from "../lib/http";
import { BookingFormType } from "@/types/event";

export const appointmentsPost = async (
  values: any,
): Promise<any> => {
  return await http.post<any>("/appointments", values);
};

export const updateAppointment = async (
  id: string,
  values: BookingFormType,
): Promise<any> => {
  return await http.put<any>(`/appointments/${id}`, values);
};

export const getAppointmentByDate = async (
  start: string,
  end: string,
): Promise<any> => {
  return await http.get<any>(
    `/appointments/list?start_date=${start}&end_date=${end}`,
  );
};

export const getListAppointmentCustomer = async (
  customer_id: number,
): Promise<any> => {
  return await http.get<any>(`/appointments/list/${customer_id}`);
};

export const getAppointmentById = async (id: number): Promise<any> => {
  return await http.get<any>(`/appointments/${id}`);
};

export const getListAppointment = async (
  values: AppointmentSearchForm,
  page: number,
): Promise<any> => {
  return await http.get<any>(`/appointments?page=${page}`, { params: values });
};

export const checkoutAppointment = async (
  id: string | null,
  values: BookingFormType,
): Promise<any> => {
  return await http.post<any>(`/appointments/checkout/${id}`, values);
};

export const appointmentsUpdateStatus = async (
  id: string | null,
  values: any,
): Promise<any> => {
  return await http.post<any>(`/appointments/update-status/${id}`, {
    status: values,
  });
};

