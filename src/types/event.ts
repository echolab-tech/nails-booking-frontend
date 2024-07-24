import { CustomerType } from "./customer";

export type EventType = {
  id: string;
  resourceId: string;
  title: string;
  start: string;
  end: string;
};

export type BookingFormType = {
  customer: CustomerType | null;
  services: Array<serviceSelectType> | [];
  tips: Array<tipsType> | [];
  paymentMethod: string;
  totalFee: number;
  totalTime: number;
  payTotal: number;
};

type serviceSelectType = {
  id: string | null;
  serviceOptionId: string;
  serviceName: string;
  name: string;
  price: number | null;
  start: string;
  end: string;
  assistant: {
    id: string;
    name: string;
  };
};

type tipsType = {
  bookingId: string | null;
  assistantId: string;
  fee: number;
};
