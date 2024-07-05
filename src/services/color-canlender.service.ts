import { http } from "../lib/http";

export const getListColors = async (): Promise<any> => {
  return await http.get<any>("/calendar-colors");
};
