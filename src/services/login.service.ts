import { LoginType } from "@/types/login";
import { http } from "../lib/http";

export const login = async (values: LoginType): Promise<any> => {
  return await http.post<any>("/assistant/login", values);
};
