import { http } from "@/lib/http";
import { DataCreateOpenHours } from "@/types/OpenHours";

export const getListOpenHours = async (): Promise<any> => {
    return await http.get<any>(`/open-hours/`);
  };

  export const createOpenHours = async (values: DataCreateOpenHours): Promise<any> => {
    return await http.post<any>("/open-hours/", values);
};