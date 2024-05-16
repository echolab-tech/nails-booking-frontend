export type serviceTypeNew = {
    name: string;
    service_category_id: string | null;
    is_booking_online: number
    assistantServices: Array<assistantServiceType>
    serviceOptions: Array<serviceOptionType>
};

type assistantServiceType = {
    id: number;
};

type serviceOptionType = {
    name: string;
    time: string;
    price: number;
    serviceOptionAssistants: Array<serviceOptionAssistantType> 
};

type serviceOptionAssistantType = {
    name: string;
    time: string;
    price: number;
    assistant_id: number;
    service_option_id: number
};
