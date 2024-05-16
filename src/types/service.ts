export type ServiceType = {
    id: number;
    name: string;
    category: string;
    assistantServices: Array<assistantServiceType>
    serviceOptions: Array<serviceOptionType>
};

type assistantServiceType = {
    id: number;
    name: string
};

type serviceOptionType = {
    id: number;
    name: string;
    time: string;
    price: number;
    serviceOptionAssistants: Array<serviceOptionAssistantType> 
};

type serviceOptionAssistantType = {
    id: number;
    name: string;
    time: string;
    price: number;
    assistant_id: number;
    service_option_id: number
};
