export type StaffRole = string;

export interface StaffIdentity {
  id: number;
  name: string;
  email: string;
  role: StaffRole;
  permissions: string[];
}
