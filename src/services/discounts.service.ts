import { http } from "../lib/http";

export const sendDiscounts = async (values: any): Promise<any> => {
  return await http.post<any>("/send-discounts", values);
};
