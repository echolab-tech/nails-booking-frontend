export type serviceTypeNew = {
    name: string;
    service_category_id: string | null;
    is_booking_online: number
    assistantServices: [] | null
    serviceOptions: Array<serviceOptionType> | null;
};


type serviceOptionType = {
    name: string;
    time: string;
    price: number;
    price_type: string,
    serviceOptionAssistants: Array<serviceOptionAssistantType> 
};

type serviceOptionAssistantType = {
    name: string;
    time: string;
    price: number;
    assistant_id: number;
    price_type: string,
    service_option_id: number
};
