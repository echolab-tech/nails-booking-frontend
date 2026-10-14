import { redirect } from "next/navigation";

// Compatibility for old bookmarks; use the shared admin Calendar.
export default function LegacyStaffAppointments() {
  redirect("/calendar");
}
