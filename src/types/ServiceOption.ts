export type ServiceOptionType = {
  id: string;
  category_id: string;
  category_name: string;
  count: number;
  service_options: Array<OptionType>;
};

type OptionType = {
  id: string;
  option_name: string;
  service_name: string;
  price: number;
  duration: string;
};
