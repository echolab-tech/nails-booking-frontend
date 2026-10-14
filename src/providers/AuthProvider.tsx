"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StaffIdentity } from "@/types/staff-access";
import { canAccessAdminPath, staffHome, hasPermission } from "@/lib/staff-access";
import Link from "next/link";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: StaffIdentity | null;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PUBLIC_ROUTES = ["/auth/signin", "/auth/forgotPassword", "/auth/resetPassword", "/reset-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StaffIdentity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedPath, setCheckedPath] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const isPublic = PUBLIC_ROUTES.some(path => pathname === path || pathname.startsWith(path + "/"));

  useEffect(() => {
    const controller = new AbortController();
    setError("");
    if (isPublic) {
      setCheckedPath(pathname);
      return () => controller.abort();
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/auth/signin");
      return () => controller.abort();
    }
    async function check() {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
        const response = await fetch(base + "/assistant/me", {
          headers: { Accept: "application/json", Authorization: "Bearer " + token },
          signal: controller.signal,
          cache: "no-store",
        });
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userLogin");
          setUser(null);
          setIsAuthenticated(false);
          router.replace("/auth/signin");
          return;
        }
        if (!response.ok) throw new Error("Unable to check access. Please try again.");
        const identity = (await response.json()).data as StaffIdentity;
        if (!identity.role || !Array.isArray(identity.permissions)) throw new Error("Your account has no assigned permissions.");
        setUser(identity);
        setIsAuthenticated(true);
        // Never authorize from the editable userLogin value in localStorage.
        localStorage.setItem("userLogin", JSON.stringify(identity));
        if (pathname === "/staff/appointments" || (!hasPermission(identity, "*") && pathname === "/")) {
          router.replace(staffHome(identity));
          return;
        }
        setCheckedPath(pathname);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to check access.");
      }
    }
    void check();
    return () => controller.abort();
  }, [pathname, isPublic, router, retry]);

  return (
    <AuthContext.Provider value={{ user, isManager: hasPermission(user, "*"), isAuthenticated, setIsAuthenticated }}>
      {isPublic ? children : error ? (
        <div role="alert" className="p-8">
          <p>{error}</p>
          <button className="mt-4 rounded bg-primary px-4 py-2 text-white" onClick={() => setRetry(value => value + 1)}>Try again</button>
        </div>
      ) : checkedPath === pathname && isAuthenticated ? canAccessAdminPath(user, pathname) ? children : (
        <div role="alert" className="p-8">
          <h1 className="mb-4 text-xl font-bold">Access denied</h1>
          <p>Your account does not have permission to open this page.</p>
          <Link className="mt-4 inline-block text-primary" href={staffHome(user)}>Back to Calendar</Link>
        </div>
      ) : (
        <p className="p-8" role="status">Checking access…</p>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
