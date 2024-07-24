export type Assistant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string | null;
  birthday: string | null;
  services: any | [];
  created_at: string | null;
  updated_at: string | null;
};

export type ResourceType = {
  id: string;
  title: string;
  businessHours: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
  }[];
};
