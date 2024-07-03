export type CustomerType = {
  id: string;
  name: string;
  email: string;
  phone: number | null;
  birthday: string | null;
  gender: number | null;
  language: number | null;
  source: number | null;
  occupation: string;
  country: number | null;
  avatar: any | null;
  address: string;
  status: number | null;
};
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  status: { color_code: string };
  reviews: number;
  total_sales: number;
}

export interface CustomerResponse {
  data: Customer[];
  meta: {
    total_items: number;
    per_page: number;
    current_page: number;
  };
}
