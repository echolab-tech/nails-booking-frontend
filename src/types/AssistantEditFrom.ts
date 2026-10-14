export type AssistantEditForm = {
    id: number,
    role?: string,
    name: string,
    email: string,
    phone: number | null,
    address: string,
    avatar: any | null,
    birthday:  string | null,
    services:[] | null,
}