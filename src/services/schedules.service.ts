import { Schedule, ScheduledOfUser } from './../types/Schedule';
import { http } from "../lib/http";

export const schedule = async (values: ScheduledOfUser): Promise<any> => {
    return await http.post<any>("/schedules", values);
};

export const scheduleList = async (): Promise<any> => {
    return await http.get<any>("/schedules");
};

export const scheduleDelete = async (id: number): Promise<any> => {
    return await http.delete<any>(`/schedules/${id}`);
};

export const scheduleEdit = async (id: number, value: Schedule): Promise<any> => {
    return await http.put<any>(`/schedules/${id}`, value);
};
