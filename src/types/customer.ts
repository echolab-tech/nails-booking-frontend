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
