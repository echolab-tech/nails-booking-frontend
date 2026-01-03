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
