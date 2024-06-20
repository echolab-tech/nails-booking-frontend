export type AssistantAddForm = {
    name: string,
    email: string,
    password: string,
    phone: number | null,
    address: string,
    avatar: any | null,
    birthday:  string | null,
    services:[] | null,
}