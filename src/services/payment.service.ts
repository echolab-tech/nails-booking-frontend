import { http } from "../lib/http";

export const getListPayment = async (page: number): Promise<any> => {
  return await http.get<any>(`/payments?page=${page}`);
};
