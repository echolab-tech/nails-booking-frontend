export type serviceTypeNew = {
  name: string | null;
  description: string | null;
  service_category_id: number | null;
  is_booking_online: boolean;
  assistantServices: number[];
  serviceOptions: {
    name: string | null;
    time: string | null;
    price: number | null;
    price_type: string | null;
    type: string | null;
    serviceOptionAssistants: [
    {
      assistant_id: number | null;
      time: string | null;
      price_type: string | null;
      price: number | null;
    }
  ];
  }[];
  category: string | null;  // Add this line
};
