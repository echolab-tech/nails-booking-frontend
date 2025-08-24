export interface WaitListType {
  id?: string;
  id_customer: string;
  id_service: string;
  id_sub_service: string | null;
  desired_time: string;
  waitlist_added_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WaitListCreateRequest {
  id_customer: string;
  id_service: string;
  id_sub_service: string | null;
  desired_time: string;
}

export interface WaitListUpdateRequest {
  id_service?: string;
  id_sub_service?: string;
  desired_time?: string;
}