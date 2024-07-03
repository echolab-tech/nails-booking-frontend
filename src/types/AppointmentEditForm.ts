export type AppointmentEditForm = {
    id: number,
    customer_id: number|null,
    total_fee: number|null,
    status: number|null,
    description_request: string | null,
    checkout_session_id: string | null,
    booking_type: number | null,
    is_group: number | null,
    total_time: string | null,
    start_time: string | null,
    end_time: string | null,
    bookingDetails: [] | any,
}