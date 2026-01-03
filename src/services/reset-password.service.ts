import { ResetPasswordType, ResetPasswordConfirmType } from "@/types/login";
import { http } from "../lib/http";

export const resetPassword = async (values: ResetPasswordType): Promise<any> => {
  return await http.post<any>("/assistant/forgot-password", values);
};

export const resetPasswordConfirm = async (
  values: ResetPasswordConfirmType,
): Promise<any> => {
  return await http.post<any>("/assistant/reset-password", values);
};
