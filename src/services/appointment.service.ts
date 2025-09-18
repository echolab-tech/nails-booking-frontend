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

export const updateEntireAppointment = async (
  id: string,
  values: BookingFormType,
): Promise<any> => {
  return await http.put<any>(`/appointments/edit/${id}`, values);
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
  customer_id: string,
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

export const appointmentsCheckAssistant = async (
  values: any,
): Promise<any> => {
  return await http.post<any>("/appointments/check", values);
};

export const deleteAppointment = async (id: number): Promise<any> => {
  return await http.delete<any>(`/appointments/${id}`);
};

export const deleteMultiAppointment = async (
  values: AppointmentSearchForm,
  ): Promise<any> => {
  return await http.post<any>(`/appointments/delete-multi`, values);
};

export const exportAppointment = async (
  values: AppointmentSearchForm,
  hasDelete: boolean = false,
): Promise<void> => {
  const params: any = { 
    ...values, 
    download: 'pdf' 
  };

  if (hasDelete) {
    params.hasDelete = true;
  }

  const res = await http.get(`/appointments`, {
    params,
    responseType: 'blob',
  });

  // Tạo link download
  const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "appointments.pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const cancelAppointmentByGroup = async (
  id: any,
  ): Promise<any> => {
  return await http.post<any>(`/appointments/cancel-appointment-by-group/${id}`);
};

export const cancelOnlyServiceOfCustomer = async (
  id: any,
  ): Promise<any> => {
  return await http.post<any>(`/appointments/cancel-only-service/${id}`);
}