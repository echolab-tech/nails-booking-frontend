export type AssistantEditForm = {
    id: number,
    name: string,
    email: string,
    phone: number | null,
    address: string,
    avatar: any | null,
    birthday:  string | null,
    increase: number | null,
    reduce: number | null,
    services:[] | null,
}