export type serviceType = {
  id: number;
  name: string;
  discription: string | null;
  is_booking_online: boolean | number;
  category: serviceCategoryType;
  assistantServices: Array<assistantServiceType>;
  serviceOptions: Array<serviceOptionType>;
  serviceCombos: Array<any>;
  serviceLocations: Array<ServiceLocationType>;
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
  price_type: string;
  parent_id: string;
  service_option_id: number;
};

type serviceCategoryType = {
  id: number;
  name: string;
};

export type ServiceLocationType = {
  id: number;
  location_id: string;
  service_id: string;
};

export type SubServiceType = {
  id: number;
  name: string;
  time: string;
  price: number;
  discription: string | null;
  assistantServices: Array<assistantServiceType>;
  subServiceAdvancePrices: Array<serviceOptionAssistantType>;
  serviceLocations: Array<ServiceLocationType>;
  services: string[];
};

export type ServicePackageForm = {
  name: string | null;
  description: string | null;
  available_for: string;
  services: string[];
  price_type: string | null;
  price: number | null;
  enable_booking: boolean;
};

export type ServicePackageType = {
  id: string;
  name: string | null;
  description: string | null;
  available_for: string;
  services: Array<PackageServiceType>;
  price_type: string | null;
  price: number | null;
  enable_booking: boolean;
};

type PackageServiceType = {
  id: number;
  name: string;
};
