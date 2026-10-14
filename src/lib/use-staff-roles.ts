"use client";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";

export function useStaffRoles() {
  const [roles, setRoles] = useState<{ name: string; label: string }[]>([]);
  useEffect(() => {
    let active = true;
    http.get<{ data: { name: string; label: string }[] }>("/staff/roles").then(response => {
      if (active) setRoles(response.data.data);
    }).catch(() => { if (active) setRoles([]); });
    return () => { active = false; };
  }, []);
  return roles;
}
