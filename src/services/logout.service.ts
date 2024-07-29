import { http } from "../lib/http";

export const logout = async (): Promise<any> => {
  try {
    const response = await http.post<any>("assistant/logout");
    return response.data;
  } catch (error) {
    throw new Error(`Logout failed: ${error}`);
  }
};
