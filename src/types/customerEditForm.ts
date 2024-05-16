export type CustomerEditForm = {
  id: number;
  name: string;
  email: string;
  phone: number | null;
  birthday: string | null;
  gender: number | null;
  // pronouns: number | null;
  language: number | null;
  source: number | null;
  occupation: string;
  country: number | null;
  avatar: any | null;
  // password: string;
  address: string;
  status: number | null;
};
