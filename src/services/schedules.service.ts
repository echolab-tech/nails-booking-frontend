import { Schedule, ScheduledOfAssistant, ScheduledOfUser } from './../types/Schedule';
import { http } from "../lib/http";

export const createSchedule = async (values: ScheduledOfAssistant): Promise<any> => {
    return await http.post<any>("/schedules", values);
};

export const getListSchedule = async (): Promise<any> => {
    return await http.get<any>("/schedules");
};

export const deleteSchedule = async (id: number): Promise<any> => {
    return await http.delete<any>(`/schedules/${id}`);
};

export const editSchedule = async (id: number, value: Schedule): Promise<any> => {
    return await http.put<any>(`/schedules/${id}`, value);
};
