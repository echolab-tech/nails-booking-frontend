import { StaffIdentity } from "../types/staff-access";

export function hasPermission(user: Pick<StaffIdentity, "permissions"> | null | undefined, permission: string): boolean {
  return user?.permissions?.includes("*") === true || user?.permissions?.includes(permission) === true;
}

export function canAccessAdminPath(user: StaffIdentity | null, pathname: string): boolean {
  if (!user) return false;
  if (hasPermission(user, "*")) return true;
  if (!hasPermission(user, "appointments.view_all")) return false;
  if (pathname === "/calendar") return true;
  return hasPermission(user, "appointments.manage") && (
    pathname === "/booking/new" || /^\/booking\/edit\/\d+$/.test(pathname)
  );
}

export function staffHome(user: Pick<StaffIdentity, "permissions"> | null): string {
  return hasPermission(user, "*") ? "/" : "/calendar";
}
