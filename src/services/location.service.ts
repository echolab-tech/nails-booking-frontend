import { http } from "../lib/http";

export const getLocations = async (): Promise<any> => {
  return await http.get<any>(`/locations`);
};
