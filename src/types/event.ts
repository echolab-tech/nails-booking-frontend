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
};

type serviceSelectType = {
  id: string | null;
  serviceId: string;
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
