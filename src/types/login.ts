export type LoginType = {
  email: string;
  password: string;
};

export type ResetPasswordType = {
  email: string;
};

export type ResetPasswordConfirmType = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

export type ForgotEmailType = {
  phone: string;
};

export type ForgotEmailResponseType = {
  success: boolean;
  email: string;
  masked_email: string;
  message: string;
};
