export type serviceType = {
  id: number;
  name: string;
  discription: string | null;
  is_booking_online: boolean | number;
  category: serviceCategoryType;
  assistantServices: Array<assistantServiceType>;
  serviceOptions: Array<serviceOptionType>;
  serviceCombos: Array<any>;
};

type assistantServiceType = {
  id: number;
  name: string;
};

type serviceOptionType = {
  id: number;
  name: string;
  time: string;
  price: number;
  parent_id: number | null;
  serviceOptionAssistants: Array<serviceOptionAssistantType>;
};

type serviceOptionAssistantType = {
  id: number;
  name: string;
  time: string;
  price: number;
  assistant_id: number;
  service_option_id: number;
};

type serviceCategoryType = {
  id: number;
  name: string;
};

export type ServicePackageType = {
  name: string | null;
  description: string | null;
  available_for: string;
  services: string[];
  price_type: string | null;
  price: number | null;
  enable_booking: boolean;
};
