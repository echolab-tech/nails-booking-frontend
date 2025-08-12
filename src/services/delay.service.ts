import { DelayType } from "@/types/Delay";
import { http } from "../lib/http";

export const sendDelay = async (values: DelayType): Promise<any> => {
  return await http.post<any>("/send-delay", values);
};
